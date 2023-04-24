'use strict';

const { CallbackManager } = require("langchain/callbacks");
const { LLMChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models");
const { OpenAI } = require("langchain/llms");
const { PromptTemplate } = require("langchain/prompts");
const { templates } = require('../utils/templates');
const { summarizeLongDocument } = require('../utils/summarizer');
const Ably = require('ably');

const getTextFromPredefinedTemplate = (obj) => {
  return `'${JSON.stringify(obj)}'`
}

module.exports = {
  findChatGPTComponent(ctx) {
    ctx.body = strapi.plugin('strapi-gpt').service('strapi-gpt').getChatGPTComponent();
  },
  findContentTypes(ctx) {
    ctx.body = strapi.plugin('strapi-gpt').service('strapi-gpt').getContentTypes();
  },
  async createChatGPTComponent(ctx) {
    strapi.reload.isWatching = false;

    try {
      const data = await strapi
        .plugin('strapi-gpt')
        .service('strapi-gpt')
        .createChatGPTComponent();
      if (data) setImmediate(() => strapi.reload());
      ctx.body = data;
    } catch (error) {
      console.log(error);
    }
  },
  async refreshData(ctx) {
    const settings = await strapi.plugins['strapi-gpt'].service('settings').getSettings();
    const allEnabledFields = [];
    settings.collections.map((cl) => {
      if (cl.isEnabled === true) {
        allEnabledFields.push(cl.collectionName)
      }
    });
    if (allEnabledFields.length > 0) {
      console.log(':::::REMOVING EXISTING VECTOR DATA:::::');
      await strapi.plugin('strapi-gpt').service('pinecone').removeAllVectors();
    }
    for (const collection of settings.collections) {
      if (collection.isEnabled) {
        let query = {}
        if (allEnabledFields.length > 0) {
          query.populate = allEnabledFields
        }
        const allDataOfCol = await strapi.db.query(collection.uid).findMany(query)
        const data = []
        for (const dataOfCol of allDataOfCol) {
          const text = getTextFromPredefinedTemplate(dataOfCol);
          data.push({
            text,
            metadata: {
              content_id: dataOfCol.id,
              text
            }
          });
        }
        const chunks = await strapi.plugin('strapi-gpt').service('upsert').get_document_chunks(data);
        await strapi.plugin('strapi-gpt').service('pinecone').upsert(chunks)
      }
    }
    ctx.send({
      message: 'Data refreshed successfully to the vector db.'
    })
  },
  async query(ctx) {
    try {
      const { body } = ctx.request;
      const { query, userId } = body;
      
      const settings = await strapi.plugins['strapi-gpt'].service('settings').getSettings();
      const ably = new Ably.Realtime({ key: settings.config.ABLY_API_KEY });
      const llm = new OpenAI({ openAIApiKey: settings.config.OPENAI_API_KEY });

      const channel = ably.channels.get(userId);

      let summarizedCount = 0;
      // Retrieve the conversation log and save the user's prompt
      const conversationHistory = await strapi.plugins['strapi-gpt'].service('conversation').getConversation(userId, 10);
      await strapi.plugins['strapi-gpt'].service('conversation').addConversation({ entry: query, speaker: "user", user_id: userId })

      // Build an LLM chain that will improve the user prompt
      const inquiryChain = new LLMChain({
        llm, prompt: new PromptTemplate({
          template: templates.inquiryTemplate,
          inputVariables: ["userPrompt", "conversationHistory"],
        })
      });
      const inquiryChainResult = await inquiryChain.call({ userPrompt: query, conversationHistory })
      const inquiry = inquiryChainResult.text

      // Embed the user's intent and query the Pinecone index
      channel.publish("status","Embedding your inquiry and finding results from that...")
      const matches = await strapi.plugin('strapi-gpt').service('pinecone').query(query);

      channel.publish("status",`Found ${matches?.length} matches`)

      const fullDocuments = matches.map((el) => el.metadata.text);

      channel.publish("status",`Documents are summarized (they are ${fullDocuments?.join("").length} long)`)

      const onSummaryDone = (summary) => {
        summarizedCount += 1

        channel.publish("status",`Done summarizing ${summarizedCount} documents`)

      }

      const summary = await summarizeLongDocument(fullDocuments.join("\n"), inquiry, onSummaryDone, settings.config.OPENAI_API_KEY)
      channel.publish("status",`Documents are summarized. Forming final answer...`)
      const promptTemplate = new PromptTemplate({
        template: templates.qaTemplate,
        inputVariables: ["summaries", "question", "conversationHistory", "frontendUrl"],
      });

      // Creating interval to send tokens on every 100 ms because of ably limitations of 15 ms
      let tokens = [];
      const intervalId = setInterval(() => {
        channel.publish("response",tokens.join(' '));
        tokens = []; 
      }, 100);


      const chat = new ChatOpenAI({
        openAIApiKey: settings.config.OPENAI_API_KEY,
        streaming: true,
        verbose: true,
        modelName: "gpt-3.5-turbo",
        callbackManager: CallbackManager.fromHandlers({
          async handleLLMNewToken(token) {
            tokens.push(token);
          },
          async handleLLMEnd(result) {
            clearInterval(intervalId);
            channel.publish("responseEnd",result.generations[0])
          }
        }),
      });

      const chain = new LLMChain({
        prompt: promptTemplate,
        llm: chat,
      });

      await chain.call({
        summaries: summary,
        question: query,
        conversationHistory,
        frontendUrl: settings.widgetConfig.frontendHost
      });

      return ctx.send({
        "message": "started"
      })
    } catch (error) {
      console.log('StrapiGPT controller query error', JSON.stringify(error));
    }
  }
};

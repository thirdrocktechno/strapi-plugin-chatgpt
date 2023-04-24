'use strict';

const { Configuration, OpenAIApi } = require('openai');

let configuration = null;
let openai = null

module.exports = ({ strapi }) => ({
    async setOpenAIClient() {
        const settings = await strapi.plugins['strapi-gpt'].service('settings').getSettings();
        configuration = new Configuration({
            apiKey: settings.config.OPENAI_API_KEY,
        });
        openai = new OpenAIApi(configuration);
    },
    async get_embeddings(texts) {
        try {
            // Call the OpenAI API to get the embeddings
            if(!openai){
                const settings = await strapi.plugins['strapi-gpt'].service('settings').getSettings();
                configuration = new Configuration({
                    apiKey: settings.config.OPENAI_API_KEY,
                });
                openai = new OpenAIApi(configuration);
            }
            const response = await openai.createEmbedding({
                model: "text-embedding-ada-002",
                input: texts
            });

            // Extract the embedding data from the response
            const data = response.data.data;

            // Return the embeddings as a list of lists of floats
            const emb = data.map(result => result.embedding);
            return emb;
        } catch (error) {
            console.log('OPEN AI GET EMBEDDINGS ERR', error);
        }
    }
});
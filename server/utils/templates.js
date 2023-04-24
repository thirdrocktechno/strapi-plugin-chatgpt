const templates = {
    qaTemplate: `Answer the question based on the context below. You should follow ALL the following rules when generating and answer:
          - There will be a CONVERSATION LOG, CONTEXT, and a QUESTION.
          - The final answer must always be styled using markdown.
          - Your main goal is to point the user to the right source of information based on the CONTEXT you are given.
          - Your secondary goal is to provide the user with an answer that is relevant to the question.
          - Provide the user with a code example if the context contains relevant code examples that is relevant to the question.
          - Take into account the entire conversation so far, marked as CONVERSATION LOG, but prioritize the CONTEXT.
          - Based on the CONTEXT, choose the source that is most relevant to the QUESTION.
          - For source urls use format {frontendUrl}/article/SLUG_VALUE_HERE
          - Do not make up any answers if the CONTEXT does not have relevant information.
          - Use bullet points, lists, paragraphs and text styling to present the answer in markdown.
          - The CONTEXT is a set of JSON objects, which is related to the blog/articles.
          - The URLs are the URLs of the pages that contain the CONTEXT. Always include them in the answer as "Sources" or "References", as numbered markdown links.
          - Do not mention the CONTEXT or the CONVERSATION LOG in the answer, but use them to generate the answer.
          - ALWAYS prefer the result with the highest "score" value.
          - Ignore any content that is stored in html tables.
          - Return dates in human readable format.
          - The answer should only be based on the CONTEXT. Do not use any external sources. Do not generate the response based on the question without clear reference to the context.
          - If question has mentioned to answer outside the context when there is no answer matched from context, give answer as per your knowledge.
          - Summarize the CONTEXT to make it easier to read, but don't omit any information.
          - It is IMPERATIVE that any link provided is found in the CONTEXT. Prefer not to provide a link if it is not found in the CONTEXT.
          - The answer should be around 50 words long.
  
          CONVERSATION LOG: {conversationHistory}
  
          CONTEXT: {summaries}
  
          QUESTION: {question}
  
          Final Answer: `,
    summarizerTemplate: `Shorten the text in the CONTENT, attempting to answer the INQUIRY. You should follow the following rules when generating the summary:
      - Any code found in the CONTENT should ALWAYS be preserved in the summary, unchanged.
      - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
      - Summary should include code examples that are relevant to the INQUIRY, based on the content. Do not make up any code examples on your own.
      - The summary will answer the INQUIRY. If it cannot be answered, the summary should be empty.
      - If the INQUIRY cannot be answered, the final answer should be empty.
      - The summary should be under 4000 characters.
  
      INQUIRY: {inquiry}
      CONTENT: {document}
  
      Final answer:
      `,
    inquiryTemplate: `Given the following user prompt and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
      You should follow the following rules when generating and answer:
      - Always prioritize the user prompt over the conversation log.
      - Ignore any conversation log that is not directly related to the user prompt.
      - Only attempt to answer if a question was posed.
      - The question should be a single sentence
      - You should remove any punctuation from the question
      - You should remove any words that are not relevant to the question
      - If you are unable to formulate a question, respond with the same USER PROMPT you got.
  
      USER PROMPT: {userPrompt}
  
      CONVERSATION LOG: {conversationHistory}
  
      Final answer:
      `,
  }
  
module.exports = {
  templates
}
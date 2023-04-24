'use strict';

module.exports = ({ strapi }) => {
  // bootstrap phase
  (async () => {
    await strapi.plugins['strapi-gpt'].service('pinecone').setPineconeClient();
    await strapi.plugins['strapi-gpt'].service('openai').setOpenAIClient();
  })()
};

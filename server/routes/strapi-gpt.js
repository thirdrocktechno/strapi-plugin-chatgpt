module.exports = {
    // accessible only from admin UI
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/component',
        handler: 'strapi-gpt.findChatGPTComponent',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/component',
        handler: 'strapi-gpt.createChatGPTComponent',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/content-types',
        handler: 'strapi-gpt.findContentTypes',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/refresh-data',
        handler: 'strapi-gpt.refreshData',
        config: { policies: [] },
      },
      {
        method: 'POST',
        path: '/query',
        handler: 'strapi-gpt.query',
        config: {
          auth: false,
        },
      },
    ],
  };
  
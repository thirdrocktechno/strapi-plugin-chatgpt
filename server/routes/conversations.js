module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/history',
      handler: 'conversations.getUserHistory',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/add-conversation',
      handler: 'conversations.addConversation',
      config: {
        auth: false,
      },
    },
  ],
};

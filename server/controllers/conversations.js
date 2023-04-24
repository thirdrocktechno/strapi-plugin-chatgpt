'use strict';

module.exports = {
    async getUserHistory (ctx) {
        const { body } = ctx.request;
        const { user_id } = body;
        const conversations = await strapi.plugins['strapi-gpt'].service('conversation').getHistoryOfUser(user_id, 25);
        ctx.send({
            message: 'Conversations retrived successfully',
            conversations
        });
    },
    async addConversation (ctx) {
        const { body } = ctx.request;
        const { entry, user_id, speaker } = body;
        await strapi.plugins['strapi-gpt'].service('conversation').addConversation({ entry, speaker, user_id })
        ctx.send({
            message: 'Conversation added successfully'
        });
    }
}
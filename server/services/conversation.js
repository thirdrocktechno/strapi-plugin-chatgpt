'use strict';
const { isEmpty } = require('lodash');

const modelUID = 'plugin::strapi-gpt.strapi-gpt-conversation';

module.exports = ({ strapi }) => ({
    async addConversation(conversationObj) {
        const conversation = await strapi.query(modelUID).findOne({
            where: {
                $and: [
                    { speaker: conversationObj.speaker },
                    { user_id: conversationObj.user_id },
                    { entry: conversationObj.entry },
                ]
            }
        })
        if(isEmpty(conversation)){
            await strapi.query(modelUID).create({ data: conversationObj });
        }
    },
    async getHistoryOfUser(userId, limit) {
        const history = await strapi.query(modelUID).findMany({
            where: {
                user_id: {
                    $eq: userId,
                },
            },
            orderBy: [{ createdAt: 'asc' }],
            limit,
        });
        return history;
    },
    async getConversation(userId, limit) {
        const history = await strapi.query(modelUID).findMany({ 
            where: {
                user_id: {
                    $eq: userId,
                },
                speaker: {
                    $eq: 'user'
                }
            },
            limit, 
        });
        return history.map((entry) => {
            return `${entry.speaker.toUpperCase()}: ${entry.entry}`
        }).reverse()
    },
    async clearConversation(userId) {
        await strapi.query(modelUID).delete({
            where: { user_id: userId },
        });
    }
})
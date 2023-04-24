'use strict';

module.exports = {
    collectionName: 'strapi_gpt_user_conversations',
    info: {
        name: 'StrapiGPT User Conversation',
        description: '',
        singularName: 'strapi-gpt-conversation',
        pluralName: 'strapi-gpt-conversations',
        displayName: 'StrapiGPT User Conversation',
    },
    options: { "timestamps": true, "increments": true, "comment": "" },
    "attributes": {
        "entry": {
            "type": "richtext"
        },
        "speaker": {
            "type": "string"
        },
        "user_id": {
            "type": "string"
        }
    }
};

'use strict';

const _ = require('lodash');

module.exports = ({ strapi }) => ({
  getChatGPTComponent() {
    const strapiGPTComponent = strapi.components['shared.strapi-gpt'];
    return strapiGPTComponent
      ? { attributes: strapiGPTComponent.attributes, category: strapiGPTComponent.category }
      : null;
  },
  getContentTypes() {
    const contentTypes = strapi.contentTypes;
    const keys = Object.keys(contentTypes);
    let collectionTypes = [];
    let singleTypes = [];

    keys.forEach((name) => {
      const hasSharedStrapiGPTComponent = _.get(
        contentTypes[name],
        'attributes.strapi-gpt.component',
        null
      );

      if (name.includes('api::')) {
        const object = {
          isEnabled: hasSharedStrapiGPTComponent ? true : false,
          uid: contentTypes[name].uid,
          kind: contentTypes[name].kind,
          globalId: contentTypes[name].globalId,
          attributes: contentTypes[name].attributes,
        };
        contentTypes[name].kind === 'collectionType'
          ? collectionTypes.push(object)
          : singleTypes.push(object);
      }
    });

    return { collectionTypes, singleTypes } || null;
  },
  async createChatGPTComponent() {
  },
});

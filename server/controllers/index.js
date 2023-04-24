'use strict';

const strapiGPT = require('./strapi-gpt');
const settings = require('./settings');
const conversations = require('./conversations');

module.exports = {
  'strapi-gpt': strapiGPT,
  settings,
  conversations
};

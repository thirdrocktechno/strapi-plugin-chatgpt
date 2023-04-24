'use strict';

const strapiGPT = require('./strapi-gpt');
const settings = require('./settings');
const openai = require('./openai');
const upsert = require('./upsert');
const pinecone = require('./pinecone');
const conversation = require('./conversation');

module.exports = {
  'strapi-gpt': strapiGPT,
  settings,
  openai,
  upsert,
  pinecone,
  conversation
};

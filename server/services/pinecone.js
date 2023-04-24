'use strict';
const { PineconeClient } = require("@pinecone-database/pinecone");

// Create a client
const client = new PineconeClient();

// Default pinecone dimension & metric
const DEFAULT_DIM = 1536
const DEFAULT_METRIC = 'cosine'

// Set the batch size for upserting vectors to Pinecone
const UPSERT_BATCH_SIZE = 100

let index = null;

module.exports = ({ strapi }) => ({
    async setPineconeClient() {
        const settings = await strapi.plugins['strapi-gpt'].service('settings').getSettings();
        await client.init({
            apiKey: settings.config.PINECONE_API_KEY,
            environment: settings.config.PINECONE_ENVIRONMENT,
        });
        index = client.Index(settings.config.PINECONE_INDEX);
    },
    async init() {
        const settings = await strapi.plugins['strapi-gpt'].service('settings').getSettings();
        const { config } = settings;
        const reqOpts = {
            name: config.PINECONE_INDEX,
            dimension: DEFAULT_DIM,
            metric: DEFAULT_METRIC
        }
        await client.createIndex({
            createRequest: reqOpts
        })
    },
    async removeAllVectors(){
        await index.delete1({ deleteAll: true })
    },
    async upsert(chunks) {
        const vectors = [];
        for (const i of Object.keys(chunks)) {
            const chunkData = chunks[i][0];
            const metadata = chunkData.metadata;
            const vector = {
                id: i,
                values: chunkData.embedding,
                metadata
            }
            vectors.push(vector);
        }
        const batches = [];
        for (let i = 0; i < vectors.length; i += UPSERT_BATCH_SIZE) {
            batches.push(vectors.slice(i, i + UPSERT_BATCH_SIZE))
        }
        for (const batch of batches) {
            console.log(`INSERTING DATA OF BATCH ${batches.indexOf(batch) + 1}`);
            await index.upsert({
                upsertRequest: {
                    vectors: batch
                }
            })
        }
    },
    async query(query) {
        const query_embedding = await strapi.plugin('strapi-gpt').service('openai').get_embeddings([query]);
        const query_response = await index.query({
            queryRequest: {
                topK: 3,
                includeValues: false,
                includeMetadata: true,
                vector: query_embedding,
            },
        });
        const query_results = query_response.matches.map((el) => { return {id: el.id, metadata: el.metadata } })
        return query_results;
    }
})
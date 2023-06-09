'use strict';

const { get_encoding } = require("@dqbd/tiktoken");
const { v4: uuidv4 } = require('uuid')
const { TextDecoder } = require('util');

// The encoding scheme to use for tokenization
const tokenizer = get_encoding("cl100k_base");

const CHUNK_SIZE = 200; //The target size of each text chunk in tokens
const MIN_CHUNK_SIZE_CHARS = 350; //The minimum size of each text chunk in characters
const MIN_CHUNK_LENGTH_TO_EMBED = 5; //Discard chunks shorter than this
const EMBEDDINGS_BATCH_SIZE = 128; //The number of embeddings to request at a time
const MAX_NUM_CHUNKS = 10000; //The maximum number of chunks to generate from a text

// Splice method to splice in Uint32Array as there is no built in method for that type
const splice = (arr, starting, deleteCount, elements) => {
    if (arguments.length === 1) {
        return arr;
    }
    starting = Math.max(starting, 0);
    deleteCount = Math.max(deleteCount, 0);
    elements = elements || [];


    const newSize = arr.length - deleteCount + elements.length;
    const splicedArray = new arr.constructor(newSize);

    splicedArray.set(arr.subarray(0, starting));
    splicedArray.set(elements, starting);
    splicedArray.set(arr.subarray(starting + deleteCount), starting + elements.length);
    return splicedArray;
};

module.exports = ({ strapi }) => ({
    get_text_chunks(text, chunk_token_size = null) {
        // Return an empty list if the text is empty or whitespace
        if (!text || text.trim().length === 0) {
            return [];
        }

        // Tokenize the text
        let tokens = tokenizer.encode(text, null, []);

        // Initialize an empty list of chunks
        const chunks = [];

        // Use the provided chunk token size or the default one
        const chunk_size = chunk_token_size || CHUNK_SIZE;

        // Initialize a counter for the number of chunks
        let num_chunks = 0;

        // Loop until all tokens are consumed
        while (tokens.length && num_chunks < MAX_NUM_CHUNKS) {
            // Take the first chunk_size tokens as a chunk
            const chunk = tokens.slice(0, chunk_size);

            // Decode the chunk into text
            const chunk_text = new TextDecoder().decode(tokenizer.decode(chunk))

            // Skip the chunk if it is empty or whitespace
            if (!chunk_text || chunk_text.trim().length === 0) {
                // Remove the tokens corresponding to the chunk text from the remaining tokens
                tokens = splice(tokens,0,chunk.length);
                // Continue to the next iteration of the loop
                continue;
            }

            // Find the last period or punctuation mark in the chunk
            const last_punctuation = Math.max(
                chunk_text.lastIndexOf('.'),
                chunk_text.lastIndexOf('?'),
                chunk_text.lastIndexOf('!'),
                chunk_text.lastIndexOf('\n')
            );
            let chunk_text_to_append;

            // If there is a punctuation mark, and the last punctuation index is before MIN_CHUNK_SIZE_CHARS
            if (last_punctuation !== -1 && last_punctuation > MIN_CHUNK_SIZE_CHARS) {
                // Truncate the chunk text at the punctuation mark
                chunk_text_to_append = chunk_text.substring(0, last_punctuation + 1);
            } else {
                chunk_text_to_append = chunk_text;
            }

            // Remove any newline characters and strip any leading or trailing whitespace
            const trimmed_text = chunk_text_to_append.replace(/\n/g, ' ').trim();

            if (trimmed_text.length > MIN_CHUNK_LENGTH_TO_EMBED) {
                // Append the chunk text to the list of chunks
                chunks.push(trimmed_text);
            }

            // Remove the tokens corresponding to the chunk text from the remaining tokens
            tokens = splice(tokens, 0, tokenizer.encode(chunk_text_to_append, null, []).length);
            
            // Increment the number of chunks
            num_chunks += 1;
        }

        // Handle the remaining tokens
        if (tokens.length) {
            const remaining_text = new TextDecoder().decode(tokenizer.decode(tokens)).replace(/\n/g, ' ').trim();
            if (remaining_text.length > MIN_CHUNK_LENGTH_TO_EMBED) {
                chunks.push(remaining_text);
            }
        }

        return chunks;
    },
    create_document_chunks(doc, chunk_token_size) {
        // Check if the document text is empty or whitespace
        if (!doc.text || doc.text.trim().length === 0) {
            return [[], doc.id || uuidv4()];
        }

        // Generate a document id if not provided
        const doc_id = doc.id || uuidv4();

        // Split the document text into chunks
        const text_chunks = this.get_text_chunks(doc.text, chunk_token_size);

        let metadata;
        if (doc.metadata) {
            metadata = doc.metadata;
        } else {
            metadata = { document_id: '' };
        }
        metadata.document_id = doc_id;

        // Initialize an empty list of chunks for this document
        const doc_chunks = [];

        // Assign each chunk a sequential number and create a DocumentChunk object
        for (let i = 0; i < text_chunks.length; i++) {
            const chunk_id = `${doc_id}_${i}`;
            // chunk_id, text_chunks[i], metadata
            const doc_chunk = {
                id: chunk_id,
                text: text_chunks[i],
                metadata: metadata,
                embedding: null
            };
            // Append the chunk object to the list of chunks for this document
            doc_chunks.push(doc_chunk);
        }

        // Return the list of chunks and the document id
        return [doc_chunks, doc_id];
    },
    async get_document_chunks(documents, chunk_token_size = null) {
        const chunks = {};
        const all_chunks = [];

        for (const doc of documents) {
            const [doc_chunks, doc_id] = this.create_document_chunks(doc, chunk_token_size || CHUNK_SIZE);
            all_chunks.push(...doc_chunks);
            chunks[doc_id] = doc_chunks;
        }

        if (!all_chunks.length) {
            return {};
        }

        const embeddings = [];

        for (let i = 0; i < all_chunks.length; i += EMBEDDINGS_BATCH_SIZE) {
            const batch_texts = all_chunks
                .slice(i, i + EMBEDDINGS_BATCH_SIZE)
                .map((chunk) => chunk.text);

            const batch_embeddings = await strapi.plugin('strapi-gpt').service('openai').get_embeddings(batch_texts);
            embeddings.push(...batch_embeddings);
        }

        all_chunks.forEach((chunk, i) => {
            chunk.embedding = embeddings[i];
        });

        return chunks;
    }
});
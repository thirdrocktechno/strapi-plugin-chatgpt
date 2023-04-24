import { request } from '@strapi/helper-plugin';

const chatGPT = {
  refreshData: async () => {
    return await request(`/strapi-gpt/refresh-data`, {
      method: 'POST',
    });
  }
};
export default chatGPT;

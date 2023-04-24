'use strict';

module.exports = ({ strapi }) => {
  const getPluginStore = () => {
    return strapi.store({
      environment: '',
      type: 'plugin',
      name: 'strapi-gpt',
    });
  };

  // Create default settings
  const createDefaultConfig = async () => {
    const pluginStore = getPluginStore();

    const newContentTypes = {
      collections: [],
      config: {
        OPENAI_API_KEY: '',
        PINECONE_API_KEY: '',
        PINECONE_INDEX: '',
        PINECONE_ENVIRONMENT: '',
        ABLY_API_KEY: '',
        ABLY_SUBSCRIBE_API_KEY: '',
      },
      widgetConfig: {}
    };

    const keys = Object.keys(strapi.contentTypes);
    keys.map((key) => {
      if (key.includes('api::')) {
        let obj = {
          uid: key,
          collectionName: key.split('.').pop(),
          isEnabled: false
        }
        newContentTypes.collections.push(obj)
      }
    });

    const value = newContentTypes;

    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
  };
  const createConfigFromData = async (settings) => {
    const value = settings;
    const pluginStore = getPluginStore();
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
  };
  const getSettings = async () => {
    const pluginStore = getPluginStore();

    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig();
    }
    return config;
  };
  const setSettings = async (data) => {
    return createConfigFromData(data);
  };
  return {
    getSettings,
    setSettings,
  };
};

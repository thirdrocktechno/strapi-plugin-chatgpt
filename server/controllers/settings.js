'use strict';

module.exports = ({ strapi }) => {
  const settingsService = strapi.plugins['strapi-gpt'].services.settings;

  const getSettings = async (ctx) => {
    try {
      return settingsService.getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  };
  const getWidgetSettings = async (ctx) => {
    try {
      const res = await settingsService.getSettings();
      return{
        "chat_widget": {
          "colors": res.widgetConfig.colors,
          "widgetIconAlignment": res.widgetConfig.widgetPosition.value,
          "chat_initiation": true,
          "header_content": res.widgetConfig.headerContent,
          "support_message": res.widgetConfig.supportMessageContent,
          "widget_language": "en",
          'support_executive_image': res.widgetConfig.executiveImage,
          'company_logo': res.widgetConfig.companyLogo
        },
        "website_url": res.widgetConfig.frontendHost,
        subscriber_key: res.config.ABLY_SUBSCRIBE_API_KEY
      }
    } catch (err) {
      ctx.throw(500, err);
    }
  };
  const setSettings = async (ctx) => {
    const { body } = ctx.request;
    try {
      await settingsService.setSettings(body);
      return settingsService.getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  };
  return {
    getSettings,
    setSettings,
    getWidgetSettings
  };
};

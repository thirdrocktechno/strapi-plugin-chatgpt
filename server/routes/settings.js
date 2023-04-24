module.exports = {
    // accessible only from admin UI
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/settings',
        handler: 'settings.getSettings',
        config: { policies: [] },
      },
      {
        method: 'GET',
        path: '/widget-settings',
        handler: 'settings.getWidgetSettings',
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/settings',
        handler: 'settings.setSettings',
        config: { policies: [] },
      },
    ],
  };
  
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'ember-bootstrap': {
      'bootstrapVersion': 4,
      'importBootstrapFont': false,
      'importBootstrapCSS': false,
      'whitelist': []
    },
    hyde: {
      directories: [
        'content',
        'journal',
        'ideas'
      ],
      prember: [
        { name: 'content', prefix: null, collectionPrefix: true },
        'journal',
        'ideas'
      ]
    },
    prember: {
      urls: [
        '/'
      ]
    }
  });

  return app.toTree();
};

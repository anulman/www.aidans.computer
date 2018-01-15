import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('content', { path: '/' }, function() {
    this.route('home', { path: '/', resetNamespace: true });

    this.route('collection', { path: '/collections/*collection_id' });
    this.route('item', { path: '/*item_id' });
  });
});

export default Router;

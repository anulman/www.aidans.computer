import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model({ collection_id }) {
    return this.store.findRecord('hyde/collection', `content/${collection_id}`);
  },

  setupController(controller, model) {
    controller.set('data', { collection: model });
  }
});

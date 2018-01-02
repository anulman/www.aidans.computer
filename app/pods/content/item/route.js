import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model({ item_id }) {
    return this.store.findRecord('hyde/item', `content/${item_id}`);
  },

  afterModel(model, transition) {
    if (model.get('yaml') === undefined) {
      let { item_id } = transition.params[this.routeName];

      this.replaceWith('content.collection', item_id);
    }
  },

  setupController(controller, model) {
    controller.set('data', { item: model });
  },

  serialize(model) {
    return { item_id: model.id.replace(/^content\//, '') };
  }
});

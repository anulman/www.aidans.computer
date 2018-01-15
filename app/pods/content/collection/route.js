import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  fastboot: service(),

  model({ collection_id }) {
    return this.store.findRecord('hyde/collection', `content/${collection_id}`);
  },

  afterModel(model) {
    if (this.get('fastboot.isFastBoot')) {
      return model.get('items');
    }
  },

  setupController(controller, model) {
    controller.set('data', { collection: model });
  },

  serialize(model) {
    return { collection_id: model.id.replace(/^content\//, '') };
  }
});

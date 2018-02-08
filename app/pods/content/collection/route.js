import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  hyde: service(),

  model({ collection_id }) {
    return this.store.findRecord('hyde/collection', `content/${collection_id}`)
      .catch((err) => {
        let { code, errors } = err;

        if (code === 'ENOENT' || errors.some(is404)) {
          return this.store.findRecord('hyde/collection', collection_id);
        } else {
          throw err;
        }
      });
  },

  afterModel(model) {
    if (this.get('hyde.fastboot.isFastBoot')) {
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

function is404({ status }) {
  return status === '404';
}

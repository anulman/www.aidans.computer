import Route from '@ember/routing/route';

export default Route.extend({
  model({ item_id }) {
    return this.store.findRecord('hyde/item', `content/${item_id}`)
      .catch((err) => {
        let { code, errors } = err;

        if (code === 'ENOENT' || errors.some(is404)) {
          return this.store.findRecord('hyde/item', item_id);
        } else {
          throw err;
        }
      });
  },

  afterModel(model, transition) {
    if (model.get('yaml') === undefined) {
      return tryCollection(this, transition);
    }
  },

  setupController(controller, model) {
    controller.set('data', { item: model });
  },

  serialize(model) {
    return { item_id: model.id.replace(/^content\//, '') };
  },

  actions: {
    error(error, transition) {
      tryCollection(this, transition);
    }
  }
});

function tryCollection(context, transition) {
  let { item_id } = transition.params[context.routeName];
  let itemId = item_id.replace(/^collections\//, '');

  context.replaceWith('content.collection', itemId);
}

function is404({ status }) {
  return status === '404';
}

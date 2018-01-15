import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import { all } from 'rsvp';

export default Route.extend({
  fastboot: service(),

  model() {
    return this.store.findRecord('hyde/collection', 'content');
  },

  afterModel(model) {
    if (this.get('fastboot.isFastBoot')) {
      return fetchCollectionContents(model);
    }
  },

  setupController(controller, model) {
    controller.set('data', { content: model });
  }
});

function fetchCollectionContents(collection) {
  return collection.get('collections')
    .then((collections) => {
      return all(collections.reduce((records, collection) => records
        .concat(collection.get('items'))
        .concat(collection.get('collections')), []));
    });
}

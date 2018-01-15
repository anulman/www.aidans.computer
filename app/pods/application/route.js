import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import { fetchContents } from 'ember-cli-hyde/models/hyde/collection';

export default Route.extend({
  fastboot: service(),

  model() {
    return this.store.findRecord('hyde/collection', 'content');
  },

  afterModel(model) {
    if (this.get('fastboot.isFastBoot')) {
      return fetchContents(model);
    }
  },

  setupController(controller, model) {
    controller.set('data', { content: model });
  }
});

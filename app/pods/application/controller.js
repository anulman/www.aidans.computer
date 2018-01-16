import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  thisYear: new Date().getFullYear(),

  navCollections: computed('data.content.collections.[]', function() {
    let collections = this.getWithDefault('data.content.collections', []);

    /* eslint-disable max-len */
    return [
      { name: 'Open Source', model: collections.findBy('id', 'content/open-source') },
      { name: 'Clients', model: collections.findBy('id', 'content/clients') }
    ];
    /* eslint-enable max-len */
  })
});

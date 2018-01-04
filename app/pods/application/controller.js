import Ember from 'ember';
import moment from 'moment';

const {
  Controller,
  computed
} = Ember;

export default Controller.extend({
  today: moment(),

  hyde: computed(function() {
    return this.store.findRecord('hyde/collection', 'content');
  }),

  navCollections: computed('hyde.collections.[]', function() {
    let collections = this.getWithDefault('hyde.collections', []);

    /* eslint-disable max-len */
    return [
      { name: 'Open Source', model: collections.findBy('id', 'content/open-source') },
      { name: 'Clients', model: collections.findBy('id', 'content/clients') }
    ];
    /* eslint-enable max-len */
  })
});

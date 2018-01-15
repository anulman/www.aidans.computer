import Ember from 'ember';

const {
  Controller,
  computed
} = Ember;

export default Controller.extend({
  thisYear: new Date().getFullYear(),

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

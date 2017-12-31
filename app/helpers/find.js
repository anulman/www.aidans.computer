import Ember from 'ember';

const {
  Helper,
  isArray,
  observer
} = Ember;

export function find(collection, { by, value }) {
  return collection.findBy(by, value);
}

export default Helper.extend({
  collection: null,

  compute([collection], hash) {
    this.set('collection', collection);

    if (isArray(collection)) {
      return find(collection, hash);
    }
  },

  onCollectionChange: observer('collection.[]', function() {
    this.recompute();
  })
});

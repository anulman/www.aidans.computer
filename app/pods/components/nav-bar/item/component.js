import Ember from 'ember';

const { Component } = Ember;

const ItemComponent = Component.extend({
  tagName: 'li',

  title: null,
  triggerComponent: 'nav-bar/item/trigger',
  collectionComponent: 'nav-bar/collection'
});

ItemComponent.reopenClass({
  positionalParams: ['title']
});

export default ItemComponent;

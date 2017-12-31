import Ember from 'ember';

const { Component } = Ember;
const TriggerComponent = Component.extend({
  tagName: 'a',
  attributeBindings: ['href'],

  title: null,
  onTransition: null, // is function, if set

  click(event) {
    let onTransition = this.get('onTransition');

    if (onTransition instanceof Function) {
      event.preventDefault();
      event.stopPropagation();
      onTransition();
    }
  }
});

TriggerComponent.reopenClass({
  positionalParams: ['title']
});

export default TriggerComponent;

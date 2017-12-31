import Ember from 'ember';
import moment from 'moment';
import ENV from '../../config/environment';

const {
  Controller,
  computed
} = Ember;

export default Controller.extend({
  today: moment(),
  rootURL: ENV.rootURL,

  hyde: computed(function() {
    return this.store.findRecord('hyde/collection', 'content');
  }),

  goTo(routeName, ...args) {
    this.transitionToRoute(routeName, ...args.slice(0, -1));
  }
});

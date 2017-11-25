import Ember from 'ember';
import moment from 'moment';

const { Controller } = Ember;

export default Controller.extend({
  today: moment()
});

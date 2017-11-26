import Ember from 'ember';
import moment from 'moment';
import ENV from '../../config/environment';

const { Controller } = Ember;

export default Controller.extend({
  today: moment(),
  rootURL: ENV.rootURL
});

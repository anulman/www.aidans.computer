import { computed } from '@ember/object';
import Hyde, { fastbootRoot } from 'ember-cli-hyde/services/hyde';

import ENV from '../config/environment';

export default Hyde.extend({
  defaultHost: computed(function() {
    return this.get('fastboot.isFastBoot') ?
      fastbootRoot.call(this) :
      ENV.rootURL;
  })
});

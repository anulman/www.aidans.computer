import Ember from 'ember';

const {
  Route,
  isPresent,
  run
} = Ember;

const CLIP_TEXT = '/content/';

export default Route.extend({
  actions: {
    didTransition() {
      run.next(() => {
        let state = window.history && window.history.state;

        if (isPresent(state)) {
          let qpsIndex = state.path.indexOf('?');
          let decodeablePath = qpsIndex > -1 ?
            state.path.slice(0, qpsIndex) :
            state.path.slice(0);

          state.path = decodeURIComponent(decodeablePath)
            .replace(CLIP_TEXT, '/')
            .concat(qpsIndex > -1 ? state.path.slice(qpsIndex) : '');

          window.history.replaceState(state, undefined, state.path);
        }
      });
    }
  }
});


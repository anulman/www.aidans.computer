import Ember from 'ember';

const { Helper: { helper } } = Ember;

export function pathForHyde([model]) {
  let idComponents = model.get('id').split('/');

  return idComponents
    .slice(idComponents.indexOf('content') + 1)
    .join('/');
}

export default helper(pathForHyde);

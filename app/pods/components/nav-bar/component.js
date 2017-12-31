import CollectionComponent from './collection/component';

export default CollectionComponent.extend({
  tagName: 'nav',
  layoutName: 'components/nav-bar/collection',
  classNameBindings: ['isShowing::hidden'],
});

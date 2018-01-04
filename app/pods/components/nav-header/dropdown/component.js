import Ember from 'ember';
import Dropdown from 'ember-bootstrap/components/bs-dropdown';

const { run } = Ember;

export default Dropdown.extend({
  isOpen: false,

  didInsertElement() {
    this._onHover = run.bind(this, 'set', 'isOpen', true);
    this._onUnhover = run.bind(this, 'set', 'isOpen', false);
    this._onClick = run.bind(this, 'toggleProperty', 'isOpen');

    this.element.addEventListener('mouseover', this._onHover, true);
    this.element.addEventListener('mouseout', this._onUnhover, true);
    this.element.addEventListener('click', this._onClick, true);
  },

  willDestroyElement() {
    this.element.removeEventListener('mouseover', this._onHover, true);
    this.element.removeEventListener('mouseout', this._onUnhover, true);
    this.element.removeEventListener('click', this._onClick, true); // todo: test w/ mobile

    this._onHover = null;
    this._onUnhover = null;
    this._onClick = null;
  }
});

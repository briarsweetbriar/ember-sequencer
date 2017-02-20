import Ember from 'ember';
import layout from '../templates/components/ember-sequencer-frame';

const {
  Component,
  computed,
  get,
  observer,
  set
} = Ember;

const { run: { later } } = Ember;

export default Component.extend({
  layout,

  classNames: ['ember-sequencer-frame'],
  classNameBindings: ['isPreloading:ember-sequencer-frame-preloading'],

  didInsertElement(...args) {
    this._super(...args);

    this.attrs.register(this);
  },

  animateIn() {
    set(this, 'isRendered', true);
    set(this, 'isVisible', true);
    set(this, 'isPreloading', false);

    get(this, 'animationAdapter').animate(this.element, get(this, 'animationIn')).then(() => {
      this.attrs.preloadNextFrame();

      later(() => {
        this.attrs.transitionToNextFrame();
      }, get(this, 'duration'));
    });
  },

  animateOut() {
    get(this, 'animationAdapter').animate(this.element, get(this, 'animationOut')).then(() => {
      set(this, 'isRendered', false);
    });
  },

  preload() {
    set(this, 'isRendered', true);
    set(this, 'isPreloading', true);
  }
});

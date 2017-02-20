import Ember from 'ember';
import layout from '../templates/components/ember-sequencer-frame';

const {
  Component,
  get,
  set
} = Ember;

const { run } = Ember;
const { later } = run;

export default Component.extend({
  layout,

  classNames: ['ember-sequencer-frame'],
  classNameBindings: ['isPreloading:ember-sequencer-frame-preloading'],

  didInsertElement(...args) {
    this._super(...args);

    this.attrs.register(this);
  },

  animateIn() {
    if (this.get('isDestroyed')) { return; }
    set(this, 'isRendered', true);
    set(this, 'isVisible', true);
    set(this, 'isPreloading', false);

    get(this, 'animationAdapter').animate(this.element, get(this, 'animationIn')).then(() => {
      run(() => {
        this.attrs.preloadNextFrame();

        later(() => {
          this.attrs.transitionToNextFrame();
        }, get(this, 'duration'));
      });
    });
  },

  animateOut() {
    get(this, 'animationAdapter').animate(this.element, get(this, 'animationOut')).then(() => {
      run(() => {
        if (this.get('isDestroyed')) { return; }
        set(this, 'isRendered', false);
        set(this, 'isVisible', false);
      });
    });
  },

  preload() {
    if (this.get('isDestroyed')) { return; }
    set(this, 'isRendered', true);
    set(this, 'isPreloading', true);
  }
});

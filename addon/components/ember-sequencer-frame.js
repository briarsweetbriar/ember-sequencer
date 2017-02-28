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

  isPreloading: true,
  isRendered: true,

  classNames: ['ember-sequencer-frame'],
  classNameBindings: ['isPreloading:ember-sequencer-frame-preloading'],

  didInsertElement(...args) {
    this._super(...args);

    this.attrs.register(this);
  },

  animateIn() {
    if (this.get('isDestroyed')) { return; }
    set(this, 'isVisible', true);
    set(this, 'isPreloading', false);

    get(this, 'animationAdapter').animate(this.element, get(this, 'animationIn')).then(() => {
      later(() => {
        this.attrs.transitionToNextFrame();
      }, get(this, 'duration'));
    });
  },

  animateOut() {
    get(this, 'animationAdapter').animate(this.element, get(this, 'animationOut')).then(() => {
      run(() => {
        if (this.get('isDestroyed')) { return; }
        set(this, 'isVisible', false);
        set(this, 'isRendered', false);
      });
    });
  }
});

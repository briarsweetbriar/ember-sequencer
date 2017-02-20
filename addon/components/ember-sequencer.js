import Ember from 'ember';
import layout from '../templates/components/ember-sequencer';
import config from 'ember-get-config';

const {
  Component,
  computed,
  get,
  getOwner,
  isPresent,
  set
} = Ember;

export default Component.extend({
  layout,

  index: -1,
  frames: computed(() => Ember.A()),
  animationIn: {},
  animationOut: {},
  frameDuration: 1000,

  classNames: ['ember-sequencer'],

  didInsertElement(...args) {
    this._super(...args);

    this._animateNextFrame();
  },

  resolvedAnimationAdapter: computed({
    get() {
      const adapter = get(this, 'animationAdapter') || get(config, 'ember-sequencer.animationAdapter') || 'jquery';

      return getOwner(this).lookup(`es-animation-adapter:${adapter}`);
    }
  }),

  _animateNextFrame() {
    const index = this.incrementProperty('index');
    const frames = get(this, 'frames');
    const previousFrame = frames[index - 1]
    const nextFrame = frames[index];

    if (isPresent(nextFrame)) {
      nextFrame.animateIn();

      if (isPresent(previousFrame)) {
        previousFrame.animateOut();
      }

      if (isPresent(this.attrs.onTransition)) {
        this.attrs.onTransition(index);
      }
    } else if (isPresent(this.attrs.onComplete)) {
      this.attrs.onComplete();
    }
  },

  actions: {
    preloadNextFrame() {
      const nextFrame = get(this, 'frames')[get(this, 'index') + 1];

      if (isPresent(nextFrame)) { nextFrame.preload(); }
    },

    registerFrame(frame) {
      get(this, 'frames').addObject(frame);
    },

    transitionToNextFrame() {
      this._animateNextFrame();
    }
  }
});

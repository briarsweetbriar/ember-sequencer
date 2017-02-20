import Ember from 'ember';

const { RSVP: { Promise } } = Ember;
const { run: { later } } = Ember;

export default Ember.Object.extend({
  animate(element, animation) {
    Ember.$(element).css(animation.effect);

    return new Promise((resolve) => {
      later(() => {
        resolve();
      }, animation.duration);
    });
  }
});

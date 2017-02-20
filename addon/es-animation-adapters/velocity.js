import Ember from 'ember';

export default Ember.Object.extend({
  animate(element, animation) {
    const effect = Ember.assign({}, animation.effect);
    return Ember.$.Velocity.animate(element, effect, Ember.assign({}, animation));
  }
});

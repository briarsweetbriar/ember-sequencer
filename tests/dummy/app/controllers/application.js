import Ember from 'ember';

export default Ember.Controller.extend({
  animationIn: {
    effect: {
      opacity: [1, 0]
    },
    duration: 2000
  },

  animationOut: {
    effect: {
      opacity: 0
    },
    duration: 1500
  }
})

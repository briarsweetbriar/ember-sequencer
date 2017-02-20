import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { $hook, initialize } from 'ember-hook';

moduleForComponent('ember-sequencer-frame', 'Integration | Component | ember sequencer frame', {
  integration: true,

  beforeEach() {
    initialize();
  }
});

test('it registers itself upon insert', function(assert) {
  assert.expect(1);

  this.set('register', (frame) => assert.ok(frame, 'registered'));
  this.render(hbs`
    {{#ember-sequencer-frame register=(action register)}}
      template block text
    {{/ember-sequencer-frame}}
  `);
});

test('animateIn triggers the inbound animation', function(assert) {
  assert.expect(8);

  const done = assert.async();

  let frame;
  const animationIn = { opacity: [1, 0] };

  this.set('animationIn', animationIn);
  this.set('register', (arg) => { frame = arg; });
  this.set('preloadNextFrame', () => { assert.ok(true, 'preloadNextFrame was run'); });
  this.set('transitionToNextFrame', () => { assert.ok(true, 'transitionToNextFrame was run'); });
  this.set('animationAdapter', {
    animate(element, animation) {
      assert.ok(element, 'element is provided to animate');
      assert.equal(animation, animationIn, 'passes animationIn to animate');

      return Ember.RSVP.resolve();
    }
  });
  this.render(hbs`
    {{#ember-sequencer-frame preloadNextFrame=(action preloadNextFrame) transitionToNextFrame=(action transitionToNextFrame) register=(action register) animationAdapter=animationAdapter animationIn=animationIn duration=10 hook='frame' as |frame|}}
      <div data-test={{hook "test"}}>Test</div>
      <div data-test={{hook "isVisible"}}>{{frame.isVisible}}</div>
    {{/ember-sequencer-frame}}
  `);

  assert.ok(!$hook('test').text(), 'frame not rendered initially');

  Ember.run.next(() => {
    frame.animateIn();

    Ember.run.later(() => {
      assert.equal($hook('test').text(), 'Test', 'frame rendered');
      assert.equal($hook('isVisible').text(), 'true', 'isVisible');
      assert.ok(!$hook('frame').hasClass('ember-sequencer-frame-preloading'), 'no preloading class');

      done();
    }, 100);
  });
});

test('animateOut triggers the outbound animation', function(assert) {
  assert.expect(4);

  const done = assert.async();

  let frame;
  const animationOut = { opacity: 0 };

  this.set('animationOut', animationOut);
  this.set('register', (arg) => { frame = arg; });
  this.set('animationAdapter', {
    animate(element, animation) {
      assert.ok(element, 'element is provided to animate');
      assert.equal(animation, animationOut, 'passes animationOut to animate');

      return Ember.RSVP.resolve();
    }
  });
  this.render(hbs`
    {{#ember-sequencer-frame register=(action register) animationAdapter=animationAdapter animationOut=animationOut hook='frame' isRendered=true isVisible=true as |frame|}}
      <div data-test={{hook "test"}}>Test</div>
    {{/ember-sequencer-frame}}
  `);

  assert.ok($hook('test').text(), 'frame is rendered initially because isRendered is true');

  Ember.run.next(() => {
    frame.animateOut();

    Ember.run.later(() => {
      assert.ok(!$hook('test').text(), 'frame removed');

      done();
    }, 100);
  });
});

test('preload renders the frame content and applies the hidden class', function(assert) {
  assert.expect(3);

  const done = assert.async();

  let frame;

  this.set('register', (arg) => { frame = arg; });
  this.render(hbs`
    {{#ember-sequencer-frame register=(action register) hook='frame'}}
      <div data-test={{hook "test"}}>Test</div>
    {{/ember-sequencer-frame}}
  `);

  assert.ok(!$hook('test').text(), 'frame not rendered initially');

  Ember.run.next(() => {
    frame.preload();

    Ember.run.next(() => {
      assert.equal($hook('test').text(), 'Test', 'frame rendered after preload');
      assert.ok($hook('frame').hasClass('ember-sequencer-frame-preloading'), 'has preloading class');

      done();
    });
  });
});

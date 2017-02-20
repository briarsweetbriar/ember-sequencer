import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { $hook, initialize } from 'ember-hook';

moduleForComponent('ember-sequencer', 'Integration | Component | ember sequencer', {
  integration: true,

  beforeEach() {
    initialize();
  }
});

test('it coordinates the frames', function(assert) {
  assert.expect(9);

  const done = assert.async();

  this.render(hbs`
    {{#ember-sequencer
      animationAdapter="velocity"
      animationIn=(hash duration=500 effect=(hash translateX=(array 0 '100%') opacity=(array 1 0)))
      animationOut=(hash duration=500 effect=(hash opacity=0))
    as |sequencer|}}
      {{#sequencer.frame}}
        <div data-test={{hook "test1"}}>1</div>
      {{/sequencer.frame}}
      {{#sequencer.frame}}
        <div data-test={{hook "test2"}}>2</div>
      {{/sequencer.frame}}
      {{#sequencer.frame}}
        <div data-test={{hook "test3"}}>3</div>
      {{/sequencer.frame}}
    {{/ember-sequencer}}
  `);

  Ember.run.next(() => {
    assert.equal($hook('test1').text(), '1', 'first frame rendered initially');
    assert.ok(!$hook('test2').text(), 'second frame not rendered initially');
    assert.ok(!$hook('test3').text(), 'third frame not rendered initially');
  });

  Ember.run.later(() => {
    assert.equal($hook('test1').text(), '1', 'first frame rendered during first transition');
    assert.equal($hook('test2').text(), '2', 'second frame rendered during first transition');
    assert.ok(!$hook('test3').text(), 'third frame not rendered during first transition');
  }, 1000);

  Ember.run.later(() => {
    assert.ok(!$hook('test1').text(), 'first frame not rendered after second settle');
    assert.equal($hook('test2').text(), '2', 'second frame rendered after second settle');
    assert.equal($hook('test3').text(), '3', 'third frame rendered after second settle');

    done();
  }, 2500);
});

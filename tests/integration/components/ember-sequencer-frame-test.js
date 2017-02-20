import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-sequencer-frame', 'Integration | Component | ember sequencer frame', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-sequencer-frame}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-sequencer-frame}}
      template block text
    {{/ember-sequencer-frame}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

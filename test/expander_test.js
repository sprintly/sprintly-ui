var _ = require('lodash');
var React = window.React || require('react');
var ReactTestUtils = require('react-dom/test-utils');
var sinon = require('sinon');
var Expander = require('../src/components/expander');

describe('Expander', function() {
  beforeEach(function() {
    this.stub = sinon.stub();
    this.expander = ReactTestUtils.renderIntoDocument(
      <Expander
        onExpanderClick={this.stub}
      />
    );
  });

  it('should render expander buttons element with condensed selected by default', function() {
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(this.expander, 'expander condensed'));
    assert.isFalse(this.expander.props.expanded);
  });

  it('should call onClick prop if button toggled', function() {
    var expandButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(this.expander, 'button')[0];
    ReactTestUtils.Simulate.click(expandButton);
    sinon.assert.calledOnce(this.stub);
  });
});

var _ = require('lodash');
var React = window.React || require('react/addons');
var TestUtils = React.addons.TestUtils;
var sinon = require('sinon');
var Expander = require('../src/components/expander');

var TestUtils = React.addons.TestUtils;

describe('Expander', function() {
  beforeEach(function() {
    this.stub = sinon.stub();
    this.expander = TestUtils.renderIntoDocument(
      <Expander
        onExpanderClick={this.stub}
      />
    );
  });

  it('should render expander buttons element with condensed selected by default', function() {
    assert.ok(TestUtils.findRenderedDOMComponentWithClass(this.expander, 'expander condensed'));
    assert.isFalse(this.expander.props.expanded);
  });

  it('should call onClick prop if button toggled', function() {
    var expandButton = TestUtils.scryRenderedDOMComponentsWithTag(this.expander, 'button')[0];
    TestUtils.Simulate.click(expandButton);
    sinon.assert.calledOnce(this.stub);
  });
});

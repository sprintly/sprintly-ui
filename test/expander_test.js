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
        onClick={this.stub}
      />
    );
  });
  afterEach(function() {
    React.unmountComponentAtNode(this.expander.getDOMNode().parent);
  });

  it('should render expander buttons element with condensed selected by default', function() {
    assert.ok(TestUtils.findRenderedDOMComponentWithClass(this.expander, 'expander condensed'));
    assert.equal(this.expander.props.expanded, 'condensed');
  });

  it('should call onClick prop if button toggled', function() {
    var expandButton = TestUtils.scryRenderedDOMComponentsWithTag(this.expander, 'button')[0];
    TestUtils.Simulate.click(expandButton);
    sinon.assert.calledOnce(this.stub);
  });

  it('should change element state on click if button toggled', function() {
    var expandButton = TestUtils.scryRenderedDOMComponentsWithTag(this.expander, 'button')[0];
    TestUtils.Simulate.click(expandButton);
    assert.equal(this.expander.state.expandOrCondense, 'expanded');
  });

  it('should not change state or call onClick if the same button clicked', function() {
    var spy = sinon.spy(this.expander, 'setState');
    var condenseButton = TestUtils.scryRenderedDOMComponentsWithTag(this.expander, 'button')[1];

    TestUtils.Simulate.click(condenseButton);
    sinon.assert.notCalled(spy);
    sinon.assert.notCalled(this.stub);
  });
});
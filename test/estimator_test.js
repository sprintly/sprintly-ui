var _ = require('lodash');
var React = window.React || require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-dom/test-utils');
var sinon = require('sinon');
var Estimator = require('../src/components/estimator');

/*
 * Estimator component tests.
 */

describe('Estimator', function() {
  beforeEach(function() {
    this.stub = {
      changeScore: sinon.stub()
    };

    this.estimator = ReactTestUtils.renderIntoDocument(
      <Estimator
        modelId={[1,1]}
        itemType='defect'
        score='s'
        estimateChanger={this.stub}
      />
    );
  });

  it('should render a button with the correct score', function() {
    var score = ReactDOM.findDOMNode(ReactTestUtils.findRenderedDOMComponentWithTag(this.estimator, 'button'));
    assert.equal(score.textContent, 's');
  });

  it('should not render the score selector menu by default', function() {
    assert.notOk(ReactTestUtils.scryRenderedDOMComponentsWithClass(this.estimator, 'estimator__menu').length);
  });

  it('should change menu state to "open" and render the selector menu on click', function() {
    var score = ReactTestUtils.findRenderedDOMComponentWithTag(this.estimator, 'button');
    ReactTestUtils.Simulate.click(score);
    assert.isTrue(this.estimator.state.menuOpen);
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(this.estimator, 'estimator__menu'));
  });

  it('should close the menu and reset state if clicked a second time after opening', function() {
    var score = ReactTestUtils.findRenderedDOMComponentWithTag(this.estimator, 'button');
    ReactTestUtils.Simulate.click(score);
    ReactTestUtils.Simulate.click(score);
    assert.isFalse(this.estimator.state.menuOpen);
    assert.notOk(ReactTestUtils.scryRenderedDOMComponentsWithClass(this.estimator, 'estimator-menu').length);
  });

  it('should trigger a changeScore method on estimateChanger utility with score number value', function() {
    this.estimator.setState({menuOpen:true});
    var scores = ReactTestUtils.scryRenderedDOMComponentsWithTag(this.estimator, 'button');
    var newScore = scores[scores.length - 1]; // Last score would be 'XL'

    ReactTestUtils.Simulate.click(newScore);
    sinon.assert.calledOnce(this.stub.changeScore);
    sinon.assert.calledWith(this.stub.changeScore, [1,1], parseInt(_.invert(this.estimator.ESTIMATE_HASH)['XL'], 10));
  });

  it('should not trigger the changeScore method if the same score is selected', function() {
    this.estimator.setState({menuOpen:true});
    var scores = ReactTestUtils.scryRenderedDOMComponentsWithTag(this.estimator, 'button');
    var sameScore = scores[2];
    assert.equal(ReactDOM.findDOMNode(sameScore).textContent, 'S');

    ReactTestUtils.Simulate.click(sameScore);
    sinon.assert.notCalled(this.stub.changeScore);
  });
});

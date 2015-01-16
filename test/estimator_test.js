var _ = require('lodash');
var React = window.React || require('react/addons');
var TestUtils = React.addons.TestUtils;
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

    this.estimator = TestUtils.renderIntoDocument(
      <Estimator
        modelId={[1,1]}
        itemType='defect'
        score='s'
        estimateChanger={this.stub}
      />
    );
  });

  it('should render a button with the correct score', function() {
    var score = TestUtils.findRenderedDOMComponentWithTag(this.estimator, 'button');
    assert.equal(score.getDOMNode().textContent, 's');
  });

  it('should not render the score selector menu by default', function() {
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(this.estimator, 'estimator-menu').length);
  });

  it('should change menu state to "open" and render the selector menu on click', function() {
    var score = TestUtils.findRenderedDOMComponentWithTag(this.estimator, 'button');
    TestUtils.Simulate.click(score);
    assert.isTrue(this.estimator.state.menuOpen);
    assert.ok(TestUtils.findRenderedDOMComponentWithClass(this.estimator, 'estimator-menu'));
  });

  it('should close the menu and reset state if clicked a second time after opening', function() {
    var score = TestUtils.findRenderedDOMComponentWithTag(this.estimator, 'button');
    TestUtils.Simulate.click(score);
    TestUtils.Simulate.click(score);
    assert.isFalse(this.estimator.state.menuOpen);
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(this.estimator, 'estimator-menu').length);
  });

  it('should trigger a changeScore method on estimateChanger utility with score number value', function() {
    this.estimator.setState({menuOpen:true});
    var scores = TestUtils.scryRenderedDOMComponentsWithTag(this.estimator, 'button');
    var newScore = scores[scores.length - 1]; // Last score would be 'XL'

    TestUtils.Simulate.click(newScore);
    sinon.assert.calledOnce(this.stub.changeScore);
    sinon.assert.calledWith(this.stub.changeScore, [1,1], parseInt(_.invert(this.estimator.ESTIMATE_HASH)['XL'], 10));
  });

  it('should not trigger the changeScore method if the same score is selected', function() {
    this.estimator.setState({menuOpen:true});
    var scores = TestUtils.scryRenderedDOMComponentsWithTag(this.estimator, 'button');
    var sameScore = scores[2];
    assert.equal(sameScore.getDOMNode().textContent, 'S');

    TestUtils.Simulate.click(sameScore);
    sinon.assert.notCalled(this.stub.changeScore);
  });
});
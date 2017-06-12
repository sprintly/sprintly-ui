import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import Estimator from '../src/components/estimator';

const _ = {
  invert: require('lodash/invert')
};

/*
 * Estimator component tests.
 */

describe('Estimator', () => {
  let stub = null;
  let estimator = null;

  beforeEach(() => {
    stub = {
      changeScore: sinon.stub()
    };

    estimator = ReactTestUtils.renderIntoDocument(
      <Estimator
        modelId={[1,1]}
        itemType='defect'
        score='s'
        estimateChanger={stub}
      />
    );
  });

  it('should render a button with the correct score', () => {
    const score = ReactDOM.findDOMNode(ReactTestUtils.findRenderedDOMComponentWithTag(estimator, 'button'));
    assert.equal(score.textContent, 's');
  });

  it('should not render the score selector menu by default', () => {
    assert.notOk(ReactTestUtils.scryRenderedDOMComponentsWithClass(estimator, 'estimator__menu').length);
  });

  it('should change menu state to "open" and render the selector menu on click', () => {
    const score = ReactTestUtils.findRenderedDOMComponentWithTag(estimator, 'button');
    ReactTestUtils.Simulate.click(score);
    assert.isTrue(estimator.state.menuOpen);
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(estimator, 'estimator__menu'));
  });

  it('should close the menu and reset state if clicked a second time after opening', () => {
    const score = ReactTestUtils.findRenderedDOMComponentWithTag(estimator, 'button');
    ReactTestUtils.Simulate.click(score);
    ReactTestUtils.Simulate.click(score);
    assert.isFalse(estimator.state.menuOpen);
    assert.notOk(ReactTestUtils.scryRenderedDOMComponentsWithClass(estimator, 'estimator-menu').length);
  });

  it('should trigger a changeScore method on estimateChanger utility with score number value', () => {
    estimator.setState({menuOpen:true});
    const scores = ReactTestUtils.scryRenderedDOMComponentsWithTag(estimator, 'button');
    const newScore = scores[scores.length - 1]; // Last score would be 'XL'

    ReactTestUtils.Simulate.click(newScore);
    sinon.assert.calledOnce(stub.changeScore);
    sinon.assert.calledWith(stub.changeScore, [1,1], parseInt(_.invert(estimator.ESTIMATE_HASH)['XL'], 10));
  });

  it('should not trigger the changeScore method if the same score is selected', () => {
    estimator.setState({menuOpen:true});
    const scores = ReactTestUtils.scryRenderedDOMComponentsWithTag(estimator, 'button');
    const sameScore = scores[2];
    assert.equal(ReactDOM.findDOMNode(sameScore).textContent, 'S');

    ReactTestUtils.Simulate.click(sameScore);
    sinon.assert.notCalled(stub.changeScore);
  });
});

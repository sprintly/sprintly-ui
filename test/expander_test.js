import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import Expander from '../src/components/expander';

describe('Expander', () => {
  let stub = null;
  let expander = null;

  beforeEach(() => {
    stub = sinon.stub();
    expander = ReactTestUtils.renderIntoDocument(
      <Expander
        onExpanderClick={stub}
      />
    );
  });

  it('should render expander buttons element with condensed selected by default', () => {
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(expander, 'expander condensed'));
    assert.isFalse(expander.props.expanded);
  });

  it('should call onClick prop if button toggled', () => {
    const expandButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(expander, 'button')[0];
    ReactTestUtils.Simulate.click(expandButton);
    sinon.assert.calledOnce(stub);
  });
});

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import Expander from '../src/components/expander';


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

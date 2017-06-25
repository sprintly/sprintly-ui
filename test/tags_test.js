import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import Tags from '../src/components/tags';

const _ = {
  each: require('lodash/each'),
  map: require('lodash/map')
};

/*
 * Tags element tests.
 */

describe('Tags', () => {
  it('should render an empty wrapper div if there are no tags', () => {
    const tags = ReactTestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={[]}
      />
    );
    assert.notOk(ReactDOM.findDOMNode(tags).children.length);
  });

  it('should render a the tag name if a single tag passed in as prop', () => {
    const tags = ReactTestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={["test"]}
      />
    );
    const node = ReactDOM.findDOMNode(tags);

    assert.equal(node.children.length, 1);
    assert.equal(node.textContent, 'test');
  });

  it('should not be in condensed mode by default', () => {
    const tags = ReactTestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={[]}
      />
    );
    assert.isFalse(tags.props.condensed);
  });

  it('should render a list of tag names if more than one tag and not condensed', () => {
    const itemTags = ["test", "test2", "test3", "4/4/15"];
    const tags = ReactTestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={itemTags}
      />
    );
    const renderedItemTags = ReactTestUtils.scryRenderedDOMComponentsWithTag(tags, 'button');

    assert.equal(renderedItemTags.length, 4);
    _.each(renderedItemTags, (tag, i) => {
      assert.equal(ReactDOM.findDOMNode(tag).textContent, itemTags[i]);
    });
  });

  it('should render that list of tag names with appropriately placed commas', () => {
    const itemTags = ["test", "test2", "test3", "4/4/15"];
    const tags = ReactTestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={itemTags}
      />
    );
    const haveTrailingComma = _.map(ReactTestUtils.scryRenderedDOMComponentsWithTag(tags, 'li'), (li, i) => {
      return ReactDOM.findDOMNode(li).textContent.match(',') ? true : false;
    });

    assert.deepEqual(haveTrailingComma, [true, true, true, false]);
  });

  it('should render tags count as "_#_ tags" if more than one tag and condensed', () => {
    const tags = ReactTestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={["test", "test2", "test3", "4/4/15"]}
        condensed={true}
      />
    );
    assert.equal(ReactTestUtils.scryRenderedDOMComponentsWithTag(tags, 'button').length, 1);
    assert.equal(ReactDOM.findDOMNode(tags).textContent, '4 tags');
  });

  it('should trigger a navigation event on tag click if navigator utility prop provided', () => {
    const stub = {
      setTagFilterAndRoute: sinon.stub()
    };
    const tags = ReactTestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={["test"]}
        navigatorUtility={stub}
      />
    );

    ReactTestUtils.Simulate.click(ReactTestUtils.scryRenderedDOMComponentsWithTag(tags, 'button')[0]);
    sinon.assert.calledOnce(stub.setTagFilterAndRoute);
    sinon.assert.calledWith(stub.setTagFilterAndRoute, 'test');
  });

  it('should call alternative callback if provided instead of a navigator', () => {
    const stub = sinon.stub();
    const tags = ReactTestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={["test"]}
        altOnTagClick={stub}
      />
    );

    ReactTestUtils.Simulate.click(ReactTestUtils.scryRenderedDOMComponentsWithTag(tags, 'button')[0]);
    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test');
  });
});

import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import Tags from '../src/components/tags';

/*
 * Tags element tests.
 */

describe('Tags', function() {
  it('should render an empty wrapper div if there are no tags', function() {
    let tags = TestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={[]}
      />
    );
    assert.notOk(ReactDOM.findDOMNode(tags).children.length);
  });

  it('should render a the tag name if a single tag passed in as prop', function() {
    let tags = TestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={["test"]}
      />
    );
    let node = ReactDOM.findDOMNode(tags);

    assert.equal(node.children.length, 1);
    assert.equal(node.textContent, 'test');
  });

  it('should not be in condensed mode by default', function() {
    let tags = TestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={[]}
      />
    );
    assert.isFalse(tags.props.condensed);
  });

  it('should render a list of tag names if more than one tag and not condensed', function() {
    let itemTags = ["test", "test2", "test3", "4/4/15"];
    let tags = TestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={itemTags}
      />
    );
    let renderedItemTags = TestUtils.scryRenderedDOMComponentsWithTag(tags, 'button');

    assert.equal(renderedItemTags.length, 4);
    renderedItemTags.forEach((tag, i) => {
      assert.equal(ReactDOM.findDOMNode(tag).textContent, itemTags[i]);
    });
  });

  it('should render that list of tag names with appropriately placed commas', function() {
    let itemTags = ["test", "test2", "test3", "4/4/15"];
    let tags = TestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={itemTags}
      />
    );

    let haveTrailingComma = TestUtils.scryRenderedDOMComponentsWithTag(tags, 'li').map((li, i) => {
      return ReactDOM.findDOMNode(li).textContent.match(',') ? true : false;
    });

    assert.deepEqual(haveTrailingComma, [true, true, true, false]);
  });

  it('should render tags count as "_#_ tags" if more than one tag and condensed', function() {
    let tags = TestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={["test", "test2", "test3", "4/4/15"]}
        condensed={true}
      />
    );
    assert.equal(TestUtils.scryRenderedDOMComponentsWithTag(tags, 'button').length, 1);
    assert.equal(ReactDOM.findDOMNode(tags).textContent, '4 tags');
  });

  it('should trigger a navigation event on tag click if navigator utility prop provided', function() {
    let stub = {
      setTagFilterAndRoute: sinon.stub()
    };

    let tags = TestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={["test"]}
        navigatorUtility={stub}
      />
    );

    TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(tags, 'button')[0]);
    sinon.assert.calledOnce(stub.setTagFilterAndRoute);
    sinon.assert.calledWith(stub.setTagFilterAndRoute, 'test');
  });

  it('should call alternative callback if provided instead of a navigator', function() {
    let stub = sinon.stub();
    let tags = TestUtils.renderIntoDocument(
      <Tags
        modelId={[1,1]}
        tags={["test"]}
        altOnTagClick={stub}
      />
    );

    TestUtils.Simulate.click(TestUtils.scryRenderedDOMComponentsWithTag(tags, 'button')[0]);
    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test');
  });
});
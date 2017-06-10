var _ = require('lodash');
var React = window.React || require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-dom/test-utils');
var sinon = require('sinon');
var TagEditor = require('../src/components/tag_editor');

/*
 * TagEditor element tests.
 */

describe('TagEditor', function() {
  it('should always render a tag edit icon', function() {
    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'i'));
  });

  it('should also render "Add a tag." if the item has no tags', function() {
    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );
    var button = ReactDOM.findDOMNode(ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button'));
    assert.equal(button.textContent, 'Add a tag.');
  });

  it('should not render the edit menu by default', function() {
    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={{}}
      />
    );

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(ReactTestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag_editor__menu').length);
  });

  it('should render the edit menu containing an input if "Add a tag." clicked', function() {
    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );
    var button = ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    ReactTestUtils.Simulate.click(button);

    assert.ok(ReactTestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag_editor__menu').length);
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'input'));
  });

  it('should trigger an add event on tag change utility if a new tag is added', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };

    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={stub}
      />
    );
    var form;
    var button = ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    ReactTestUtils.Simulate.click(button);

    form = ReactDOM.findDOMNode(ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'form'));
    form.children[0].value = 'new tag';
    ReactTestUtils.Simulate.change(form.children[0]);
    ReactTestUtils.Simulate.submit(form);

    sinon.assert.calledOnce(stub.addOrRemove);
    sinon.assert.calledWith(stub.addOrRemove, [1,1], [], 'new tag', 'add');
  });

  it('should close the edit menu if adding the first tag on an item', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };

    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={stub}
      />
    );
    var form;
    var button = ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    ReactTestUtils.Simulate.click(button);

    form = ReactDOM.findDOMNode(ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'form'));
    form.children[0].value = 'new tag';
    ReactTestUtils.Simulate.change(form.children[0]);
    ReactTestUtils.Simulate.submit(form);

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(ReactTestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor__menu').length);
  });

  it('should render the current item tags in the edit menu if item has tags', function() {
    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={{}}
      />
    );
    var button = ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    ReactTestUtils.Simulate.click(button);

    assert.equal(ReactTestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'li').length, 2);
  });

  it('should trigger a remove event on tag changer utility if tag is deleted from menu', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };
    var currentTags = ["test", "test2"];

    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={currentTags}
        tagChanger={stub}
      />
    );
    var deleteButton;
    var button = ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    ReactTestUtils.Simulate.click(button);

    deleteButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'i')[1];
    ReactTestUtils.Simulate.click(deleteButton);

    sinon.assert.calledOnce(stub.addOrRemove);
    sinon.assert.calledWith(stub.addOrRemove, [1,1], currentTags, 'test', 'remove');
  });

  it('should close the edit menu automatically if the last item tag is deleted', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };

    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test"]}
        tagChanger={stub}
      />
    );
    var deleteButton;
    var button = ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    ReactTestUtils.Simulate.click(button);

    deleteButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'i')[1];
    ReactTestUtils.Simulate.click(deleteButton);

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(ReactTestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
  });

  it('should not close the menu if there are still item tags left', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };

    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={stub}
      />
    );
    var deleteButton;
    var button = ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    ReactTestUtils.Simulate.click(button);

    deleteButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'i')[1];
    ReactTestUtils.Simulate.click(deleteButton);

    assert.isTrue(tagEditor.state.showMenu);
    assert.ok(ReactTestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag_editor__menu').length);
  });

  it('should close the menu if the tag edit button is clicked a second time', function() {
    var tagEditor = ReactTestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );
    var button = ReactTestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    ReactTestUtils.Simulate.click(button);
    ReactTestUtils.Simulate.click(button);

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(ReactTestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
  });
});

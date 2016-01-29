import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import TagEditor from '../src/components/tag_editor';

/*
 * TagEditor element tests.
 */

describe('TagEditor', function() {
  it('should always render a tag edit icon', function() {
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );
    assert.ok(TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'i'));
  });

  it('should also render "Add a tag." if the item has no tags', function() {
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );

    let button = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button'));
    assert.equal(button.textContent, 'Add a tag.');
  });

  it('should not render the edit menu by default', function() {
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={{}}
      />
    );

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag_editor__menu').length);
  });

  it('should render the edit menu containing an input if "Add a tag." clicked', function() {
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );

    let button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    assert.ok(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag_editor__menu').length);
    assert.ok(TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'input'));
  });

  it('should trigger an add event on tag change utility if a new tag is added', function() {
    let stub = { addOrRemove: sinon.stub() };
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={stub}
      />
    );

    let button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    let form = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'form'));
    form.children[0].value = 'new tag';
    TestUtils.Simulate.change(form.children[0]);
    TestUtils.Simulate.submit(form);

    sinon.assert.calledOnce(stub.addOrRemove);
    sinon.assert.calledWith(stub.addOrRemove, [1,1], [], 'new tag', 'add');
  });

  it('should close the edit menu if adding the first tag on an item', function() {
    let stub = { addOrRemove: sinon.stub() };
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={stub}
      />
    );

    let button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    let form = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'form'));
    form.children[0].value = 'new tag';
    TestUtils.Simulate.change(form.children[0]);
    TestUtils.Simulate.submit(form);

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor__menu').length);
  });

  it('should render the current item tags in the edit menu if item has tags', function() {
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={{}}
      />
    );

    let button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    assert.equal(TestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'li').length, 2);
  });

  it('should trigger a remove event on tag changer utility if tag is deleted from menu', function() {
    let stub = { addOrRemove: sinon.stub() };
    let currentTags = ["test", "test2"];

    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={currentTags}
        tagChanger={stub}
      />
    );
    let button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    let deleteButton = TestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'i')[1];
    TestUtils.Simulate.click(deleteButton);

    sinon.assert.calledOnce(stub.addOrRemove);
    sinon.assert.calledWith(stub.addOrRemove, [1,1], currentTags, 'test', 'remove');
  });

  it('should close the edit menu automatically if the last item tag is deleted', function() {
    let stub = { addOrRemove: sinon.stub() };
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test"]}
        tagChanger={stub}
      />
    );

    let button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    let deleteButton = TestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'i')[1];
    TestUtils.Simulate.click(deleteButton);

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
  });

  it('should not close the menu if there are still item tags left', function() {
    let stub = { addOrRemove: sinon.stub() };
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={stub}
      />
    );

    let button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    let deleteButton = TestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'i')[1];
    TestUtils.Simulate.click(deleteButton);

    assert.isTrue(tagEditor.state.showMenu);
    assert.ok(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag_editor__menu').length);
  });

  it('should close the menu if the tag edit button is clicked a second time', function() {
    let tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );

    let button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);
    TestUtils.Simulate.click(button);

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
  });
});
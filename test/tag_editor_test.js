var _ = require('lodash');
var React = window.React || require('react/addons');
var TestUtils = React.addons.TestUtils;
var assert = require('chai').assert;
var sinon = require('sinon');
var TagEditor = require('../src/components/tag_editor');

/*
 * TagEditor element tests.
 */

describe('TagEditor', function() {
  it('should always render a tag edit icon', function() {
    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );
    assert.ok(TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'i'));
  });

  it('should also render "Add a tag." if the item has no tags', function() {
    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );
    var button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    assert.equal(button.getDOMNode().textContent, 'Add a tag.');
  });

  it('should not render the edit menu by default', function() {
    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={{}}
      />
    );

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
  });

  it('should render the edit menu containing an input if "Add a tag." clicked', function() {
    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );
    var button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    assert.ok(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
    assert.ok(TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'input'));
  });

  it('should trigger an add event on tag change utility if a new tag is added', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };

    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={stub}
      />
    );
    var form;
    var button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    form = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'form').getDOMNode();
    form.children[0].value = 'new tag';
    TestUtils.Simulate.submit(form);

    sinon.assert.calledOnce(stub.addOrRemove);
    sinon.assert.calledWith(stub.addOrRemove, [1,1], 'new tag', 'add');
  });

  it('should close the edit menu if adding the first tag on an item', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };

    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={stub}
      />
    );
    var form;
    var button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    form = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'form').getDOMNode();
    form.children[0].value = 'new tag';
    TestUtils.Simulate.submit(form);

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
  });

  it('should render the current item tags in the edit menu if item has tags', function() {
    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={{}}
      />
    );
    var button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    assert.equal(TestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'li').length, 2);
  });

  it('should trigger a remove event on tag changer utility if tag is deleted from menu', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };

    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={stub}
      />
    );
    var deleteButton;
    var button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    deleteButton = TestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'i')[1];
    TestUtils.Simulate.click(deleteButton);

    sinon.assert.calledOnce(stub.addOrRemove);
    sinon.assert.calledWith(stub.addOrRemove, [1,1], 'test', 'remove');
  });

  it('should close the edit menu automatically if the last item tag is deleted', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };

    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test"]}
        tagChanger={stub}
      />
    );
    var deleteButton;
    var button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    deleteButton = TestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'i')[1];
    TestUtils.Simulate.click(deleteButton);

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
  });

  it('should not close the menu if there are still item tags left', function() {
    var stub = {
      addOrRemove: sinon.stub()
    };

    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={["test", "test2"]}
        tagChanger={stub}
      />
    );
    var deleteButton;
    var button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);

    deleteButton = TestUtils.scryRenderedDOMComponentsWithTag(tagEditor, 'i')[1];
    TestUtils.Simulate.click(deleteButton);

    assert.isTrue(tagEditor.state.showMenu);
    assert.ok(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
  });

  it('should close the menu if the tag edit button is clicked a second time', function() {
    var tagEditor = TestUtils.renderIntoDocument(
      <TagEditor
        modelId= {[1,1]}
        tags={[]}
        tagChanger={{}}
      />
    );
    var button = TestUtils.findRenderedDOMComponentWithTag(tagEditor, 'button');
    TestUtils.Simulate.click(button);
    TestUtils.Simulate.click(button);

    assert.isFalse(tagEditor.state.showMenu);
    assert.notOk(TestUtils.scryRenderedDOMComponentsWithClass(tagEditor, 'tag-editor-menu').length);
  });

  it('should close the menu if users clicks outside element', function() {
    var style = {padding: '20px'};
    var withOutside = React.render(
      <div className="outside" style={style}>
        <TagEditor
          modelId= {[1,1]}
          tags={[]}
          tagChanger={{}}
        />
      </div>, $('#testing').get(0)
    );
    $('button').click();
    assert.ok($('.tag-editor-menu').length);

    $('#testing').click();
    assert.notOk($('.tag-editor-menu').length);
    React.unmountComponentAtNode(withOutside.getDOMNode().parentNode);
  });
});
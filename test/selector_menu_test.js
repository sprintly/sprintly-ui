import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import SelectorMenu from '../src/components/selector_menu/index';
import Label from '../src/components/selector_menu/label';
import List from '../src/components/selector_menu/list';
import Search from '../src/components/selector_menu/search';


describe("SelectorMenu", function() {
  beforeEach(function() {
    this.optionsList = [
      {title: "Option 1"},
      {title: "Option 2"}
    ];

    this.selector = TestUtils.renderIntoDocument(
      <SelectorMenu
        optionsList={this.optionsList}
        defaultSelection="All"
        onSelectionChange={sinon.spy()}
      />
    );

    this.node = ReactDOM.findDOMNode(this.selector);
    this.documentNode = ReactDOM.findDOMNode(this.selector).parentNode;
  });

  describe("rendering", function() {
    it("should render a label that displays current state", function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.selector, Label));
    });
    it("should render default label on first render", function() {
      let label = ReactDOM.findDOMNode(TestUtils.findRenderedComponentWithType(this.selector, Label));
      assert.strictEqual(label.textContent, "All");
    });
    it("should render a search input", function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.selector, Search));
    });
    it("should render a list of options", function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.selector, List));
    });
    it("should show all options plus default", function() {
      let optionsList = TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "option");
      assert.equal(optionsList.length, 3);
    });
  });

  describe("toggling menu open/close", function() {
    beforeEach(function() {
      this.optionLabel = TestUtils.findRenderedDOMComponentWithClass(this.selector, "selector__label");
      TestUtils.Simulate.click(this.optionLabel);
    });
    it("should open on click if closed", function() {
      let dropdown = TestUtils.findRenderedDOMComponentWithClass(this.selector, "inner-wrapper expanded");
      assert.isTrue(this.selector.state.expanded);
    });
    it("should close on click if open", function() {
      let dropdown = TestUtils.findRenderedDOMComponentWithClass(this.selector, "inner-wrapper expanded");
      TestUtils.Simulate.click(this.optionLabel);

      assert.isFalse(this.selector.state.expanded);
      assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "inner-wrapper expanded").length, 0);
    });
  });

  describe("search and selection", function() {
    beforeEach(function() {
      let label = TestUtils.findRenderedDOMComponentWithClass(this.selector, "selector__label");
      TestUtils.Simulate.click(label);
    });
    it("should render a list of options (including default)", function() {
      let optionsList = TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "option");
      assert.equal(optionsList.length, 3);
    });
    it("should only show options relevant to user search, if search input entered", function() {
      let input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      ReactDOM.findDOMNode(input).value = "option 1";
      TestUtils.Simulate.change(input);
      assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "option").length, 1);
    });
    it("should trigger callback on ENTER pressed any valid option entered in search bar", function() {
      let input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      ReactDOM.findDOMNode(input).value = "Option 1";
      TestUtils.Simulate.change(input);
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledWith(this.selector.props.onSelectionChange, "Option 1");
    });
    it("should be able to handle case insensitive input from user", function() {
      let spy = sinon.spy(this.selector, 'selectOption');
      let input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      ReactDOM.findDOMNode(input).value = "option 1"; // lowercased
      TestUtils.Simulate.change(input);
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledWith(spy, "Option 1");
    });
    it("should be able to handle partial option input from user", function() {
      let spy = sinon.spy(this.selector, "selectOption");
      let input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      ReactDOM.findDOMNode(input).value = "2"; // partial
      TestUtils.Simulate.change(input);
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledWith(spy, "Option 2");
    });
    it("should close menu and clear input on submit", function() {
      let spy = sinon.spy(this.selector, "onLabelClicked");
      let input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      ReactDOM.findDOMNode(input).value = "option 1";
      TestUtils.Simulate.change(input);
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledOnce(spy);
      assert.equal(ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithTag(this.selector, "input")).value, "");
    });
  });

  describe('controlled component with selection', function() {
    beforeEach(function() {
      this.options = [
        {title: 'Sam B.'},
        {title: 'Flora W.'},
        {title: 'Justin A.'},
        {title: 'Nick S.'}
      ];
    });
    it('renders the label correctly', function() {
      let selector = (
        <SelectorMenu
          selection='Sam B.'
          optionsList={this.options}
          defaultSelection="All"
          onSelectionChange={sinon.spy()}
        />
      );
      ReactDOM.render(selector, this.documentNode);

      let label = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(selector, 'selector__label'));
      assert.equal('Sam B.', label.textContent);
    });
    it('renders the list correctly', function() {
      let selector = (
        <SelectorMenu
          selection='Sam B.'
          optionsList={this.options}
          defaultSelection="All"
          onSelectionChange={sinon.spy()}
        />
      );
      ReactDOM.render(selector, this.documentNode);

      let list = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(selector, 'selector__options'));
      assert.lengthOf(list.children, 4);
    });
    it('adds an unexpected value to the rendered options list', function() {
      let selector = (
        <SelectorMenu
          selection='Unassigned'
          optionsList={this.options}
          defaultSelection="All"
          onSelectionChange={sinon.spy()}
        />
      );
      ReactDOM.render(selector, this.documentNode);

      let list = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(selector, 'selector__options'));
      assert.lengthOf(list.children, 5);
    });
    it('renders the default label when selection is empty', function() {
      let selector = (
        <SelectorMenu
          selection=''
          optionsList={this.options}
          defaultSelection='Foo'
          onSelectionChange={sinon.spy()}
        />
      );
      ReactDOM.render(selector, this.documentNode);

      let label = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(selector, 'selector__label'));
      assert.equal('Foo', label.textContent);
    });
    it('overrides selection when new options are passed in', function() {
      let buildSelector = (opts) => {
        return (
          <SelectorMenu
            selection={opts.selection}
            optionsList={opts.options}
            defaultSelection='Foo'
            onSelectionChange={sinon.spy()}
          />
        );
      };

      let selector = buildSelector({selection: '', options: this.options});
      ReactDOM.render(selector, this.documentNode);

      // Mock the internal state as if the input changed
      selector.selectOption('Flora W.');
      let label = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(selector, 'selector__label'));
      assert.equal('Flora W.', label.textContent, 'renders when state set');

      // Update the optionsList, which should clear out previous state
      let newOpts = [
        {title: 'Foo B.'}
      ];
      selector = buildSelector({options: newOpts});
      ReactDOM.render(selector, this.documentNode);

      label = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(selector, 'selector__label'));
      assert.equal('All', label.textContent, 'renders the default label');

      let list = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(selector, 'selector__options'));
      assert.lengthOf(list.children, 2, 'renders the new options list');
    });
  });
});

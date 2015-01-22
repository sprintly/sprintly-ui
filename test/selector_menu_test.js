var React = window.React || require('react/addons');
var _ = require('lodash');
var SelectorMenu = require('../src/js/selector_menu/index');
var Label = require('../src/js/selector_menu/label');
var List = require('../src/js/selector_menu/list');
var Search = require('../src/js/selector_menu/search');
var TestUtils = React.addons.TestUtils;
var assert = require('chai').assert;
var sinon = require('sinon');


describe("SelectorMenu", function() {
  beforeEach(function() {
    this.optionsJSON = [
      {title: "Option 1"},
      {title: "Option 2"}
    ];

    this.selector = TestUtils.renderIntoDocument(
      <SelectorMenu
        optionsList={this.optionsJSON}
        defaultSelection="All"
        onSelectionChange={function() {}}
      />
    );

    this.node = this.selector.getDOMNode();
  });

  describe("rendering", function() {
    it("should render a label that displays current state", function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.selector, Label));
    });
    it("should render default label on first render", function() {
      var label = TestUtils.findRenderedComponentWithType(this.selector, Label);
      assert.strictEqual(label.getDOMNode().textContent, "All");
    });
    it("should render a search input", function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.selector, Search));
    });
    it("should render a list of options", function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.selector, List));
    });
    it("should show all options plus default", function() {
      var optionsList = TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "option");
      assert.equal(optionsList.length, 3);
    });
  });
  describe("toggling menu open/close", function() {
    beforeEach(function() {
      this.optionLabel = TestUtils.findRenderedDOMComponentWithClass(this.selector, "label");
      TestUtils.Simulate.click(this.optionLabel);
    });
    it("should open on click if closed", function() {
      assert.isTrue(_.contains(this.node.classList, "expanded"));
    });
    it("should close on click if open", function() {
      TestUtils.Simulate.click(this.optionLabel);
      assert.isFalse(_.contains(this.node.classList, "expanded"));
    });
  });
  describe("search and selection", function() {
    beforeEach(function() {
      var label = TestUtils.findRenderedDOMComponentWithClass(this.selector, "label");
      TestUtils.Simulate.click(label);
    });
    it("should render a list of options (including default)", function() {
      var optionsList = TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "option");
      assert.equal(optionsList.length, 3);
    });
    it("should only show options relevant to user search, if search input entered", function() {
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      input.getDOMNode().value = "option 1";
      TestUtils.Simulate.change(input);
      assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "option").length, 1);
    });
    it("should trigger callback on ENTER pressed any valid option entered in search bar", function() {
      var spy = sinon.spy(this.selector.props, "onSelectionChange");
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      input.getDOMNode().value = "Option 1";
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledWith(spy, "Option 1");
    });
    it("should be able to handle case insensitive input from user", function() {
      var spy = sinon.spy(this.selector, 'selectOption');
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      input.getDOMNode().value = "option 1"; // lowercased
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledWith(spy, "Option 1");
    });
    it("should be able to handle partial option input from user", function() {
      var spy = sinon.spy(this.selector, "selectOption");
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      input.getDOMNode().value = "2"; // partial
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledWith(spy, "Option 2");
    });
    it("should close menu and clear input on submit", function() {
      var spies = [
        sinon.spy(this.selector, "onLabelClicked"),
        sinon.spy(this.selector, "cleanSearchState")
      ];
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      input.getDOMNode().value = "option 1";
      TestUtils.Simulate.keyDown(input, {which: 13});

      _.each(spies, function(spy) {
        sinon.assert.calledOnce(spy);
      });
    });
  });
});
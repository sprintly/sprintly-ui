var React = window.React || require('react/addons');
var _ = require('lodash');
var TestUtils = React.addons.TestUtils;
var sinon = require('sinon');

var SelectorMenu = require('../src/components/selector_menu/index');
var Label = require('../src/components/selector_menu/label');
var List = require('../src/components/selector_menu/list');
var Search = require('../src/components/selector_menu/search');


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

    this.node = React.findDOMNode(this.selector);
  });

  describe("rendering", function() {
    it("should render a label that displays current state", function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.selector, Label));
    });
    it("should render default label on first render", function() {
      var label = React.findDOMNode(TestUtils.findRenderedComponentWithType(this.selector, Label));
      assert.strictEqual(label.textContent, "All");
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
      this.optionLabel = TestUtils.findRenderedDOMComponentWithClass(this.selector, "selector__label");
      TestUtils.Simulate.click(this.optionLabel);
    });
    it("should open on click if closed", function() {
      var dropdown = TestUtils.findRenderedDOMComponentWithClass(this.selector, "inner-wrapper expanded");
      assert.isTrue(this.selector.state.expanded);
    });
    it("should close on click if open", function() {
      var dropdown = TestUtils.findRenderedDOMComponentWithClass(this.selector, "inner-wrapper expanded");
      TestUtils.Simulate.click(this.optionLabel);

      assert.isFalse(this.selector.state.expanded);
      assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "inner-wrapper expanded").length, 0);
    });
  });
  describe("search and selection", function() {
    beforeEach(function() {
      var label = TestUtils.findRenderedDOMComponentWithClass(this.selector, "selector__label");
      TestUtils.Simulate.click(label);
    });
    it("should render a list of options (including default)", function() {
      var optionsList = TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "option");
      assert.equal(optionsList.length, 3);
    });
    it("should only show options relevant to user search, if search input entered", function() {
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      React.findDOMNode(input).value = "option 1";
      TestUtils.Simulate.change(input);
      assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(this.selector, "option").length, 1);
    });
    it("should trigger callback on ENTER pressed any valid option entered in search bar", function() {
      var spy = sinon.spy(this.selector.props, "onSelectionChange");
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      React.findDOMNode(input).value = "Option 1";
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledWith(spy, "Option 1");
    });
    it("should be able to handle case insensitive input from user", function() {
      var spy = sinon.spy(this.selector, 'selectOption');
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      React.findDOMNode(input).value = "option 1"; // lowercased
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledWith(spy, "Option 1");
    });
    it("should be able to handle partial option input from user", function() {
      var spy = sinon.spy(this.selector, "selectOption");
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      React.findDOMNode(input).value = "2"; // partial
      TestUtils.Simulate.keyDown(input, {which: 13});

      sinon.assert.calledWith(spy, "Option 2");
    });
    it("should close menu and clear input on submit", function() {
      var spies = [
        sinon.spy(this.selector, "onLabelClicked"),
        sinon.spy(this.selector, "cleanSearchState")
      ];
      var input = TestUtils.findRenderedDOMComponentWithTag(this.selector, "input");

      React.findDOMNode(input).value = "option 1";
      TestUtils.Simulate.keyDown(input, {which: 13});

      _.each(spies, function(spy) {
        sinon.assert.calledOnce(spy);
      });
    });
  });

  describe('controlled component with selection', function() {
    beforeEach(function() {
      this.selector.setProps({
        selection: 'Sam B.',
        optionsList: [{ title: 'Sam B.' }, { title: 'Flora W.' }, { title: 'Justin A.' }, { title: 'Nick S.' }]
      });
    });
    it('renders the label correctly', function() {
      var label = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(this.selector, 'selector__label'));
      assert.equal('Sam B.', label.textContent);
    });
    it('renders the list correctly', function() {
      var list = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(this.selector, 'selector__options'));
      assert.lengthOf(list.children, 4);
    });
    it('adds an unexpected value to the rendered options list', function() {
      this.selector.setProps({ selection: 'Unassigned' })
      var list = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(this.selector, 'selector__options'));
      assert.lengthOf(list.children, 5);
    });
    it('renders the default label when selection is empty', function() {
      this.selector.setProps({ selection: '', defaultSelection: 'Foo' });
      var label = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(this.selector, 'selector__label'));
      assert.equal('Foo', label.textContent);
    });
    it('overrides selection when new options are passed in', function() {
      this.selector.setProps({ selection: '' });

      // Mock the internal state as if the input changed
      this.selector.setState({ selected: 'Flora W.' });
      var label = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(this.selector, 'selector__label'));
      assert.equal('Flora W.', label.textContent, 'renders when state set');

      // Update the optionsList, which should clear out previous state
      this.selector.setProps({ optionsList: [{ title: 'Foo B.' }] });
      label = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(this.selector, 'selector__label'));
      assert.equal('All', label.textContent, 'renders the default label');

      var list = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(this.selector, 'selector__options'));
      assert.lengthOf(list.children, 2, 'renders the new options list');
    });
  });
});

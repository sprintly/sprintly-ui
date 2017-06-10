var React = window.React || require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var mount = require('enzyme').mount;
var ReactTestUtils = require('react-dom/test-utils');
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

    this.selector = mount(
      <SelectorMenu
        optionsList={this.optionsJSON}
        defaultSelection="All"
        onSelectionChange={sinon.spy()}
      />
    );
  });

  describe("rendering", function() {
    it("should render a label that displays current state", function() {
      assert.ok(this.selector.find(Label).exists());
    });

    it("should render default label on first render", function() {
      assert.equal(this.selector.first(Label).first().find('.inner').first().text(), "All");
    });

    it("should render a search input", function() {
      assert.ok(this.selector.find(Search).exists());
    });

    it("should render a list of options", function() {
      assert.ok(this.selector.find(List).exists());
    });

    it("should show all options plus default", function() {
      var optionsList = this.selector.find(".option");
      assert.equal(optionsList.length, 3);
    });
  });

  describe("toggling menu open/close", function() {
    beforeEach(function() {
      this.optionLabel = this.selector.find(".selector__label").first();
      this.optionLabel.simulate('click');
    });

    it("should open on click if closed", function() {
      var dropdown = this.selector.find(".inner-wrapper.expanded")
      assert.isTrue(this.selector.state('expanded'));
    });

    it("should close on click if open", function() {
      var dropdown = this.selector.find(".inner-wrapper.expanded");
      this.optionLabel.simulate('click');

      assert.isFalse(this.selector.state('expanded'));
      assert.equal(this.selector.find(".inner-wrapper.expanded").length, 0);
    });
  });

  describe("search and selection", function() {
    beforeEach(function() {
      var label = this.selector.find(".selector__label");
      label.simulate('click');
    });

    it("should render a list of options (including default)", function() {
      var optionsList = this.selector.find(".option");
      assert.equal(optionsList.length, 3);
    });

    it("should only show options relevant to user search, if search input entered", function() {
      var input = this.selector.find("input").first();

      input.getDOMNode().value = "option 1";
      input.simulate('change');
      assert.equal(this.selector.find(".option").length, 1);
    });

    it("should trigger callback on ENTER pressed any valid option entered in search bar", function() {
      var input = this.selector.find("input").first();

      input.getDOMNode().value = "Option 1";
      input.simulate('change');
      input.simulate('keyDown', {which: 13});

      sinon.assert.calledWith(this.selector.prop('onSelectionChange'), "Option 1");
    });

    it("should be able to handle case insensitive input from user", function() {
      var spy = sinon.spy(this.selector.getNode(), 'selectOption');
      var input = this.selector.find("input").first();

      input.getDOMNode().value = "option 1";
      input.simulate('change');
      input.simulate('keyDown', {which: 13});

      sinon.assert.calledWith(spy, "Option 1");
    });

    it("should be able to handle partial option input from user", function() {
      var spy = sinon.spy(this.selector.getNode(), 'selectOption');
      var input = this.selector.find("input").first();

      input.getDOMNode().value = "2";
      input.simulate('change');
      input.simulate('keyDown', {which: 13});

      sinon.assert.calledWith(spy, "Option 2");
    });

    it("should close menu and clear input on submit", function() {
      var spy = sinon.spy(this.selector.getNode(), "onLabelClicked");
      var input = this.selector.find("input").first();

      input.getDOMNode().value = "option 1";
      input.simulate('change');
      input.simulate('keyDown', {which: 13});

      sinon.assert.calledOnce(spy);
      assert.equal(this.selector.find("input").first().getDOMNode().value, "");
    });
  });

  describe('controlled component with selection', function() {
    beforeEach(function() {
      this.selector.setProps({
        selection: 'Sam B.',
        optionsList: [
          { title: 'Sam B.' },
          { title: 'Flora W.' },
          { title: 'Justin A.' },
          { title: 'Nick S.' }
        ]
      });
    });

    it('renders the label correctly', function() {
      var label = this.selector.find('.selector__label').first();
      assert.equal('Sam B.', label.text());
    });

    it('renders the list correctly', function() {
      var list = this.selector.find('.selector__options').first();
      assert.lengthOf(list.children(), 4);
    });

    it('adds an unexpected value to the rendered options list', function() {
      this.selector.setProps({ selection: 'Unassigned' })

      var list = this.selector.find('.selector__options').first();
      assert.lengthOf(list.children(), 5);
    });

    it('renders the default label when selection is empty', function() {
      this.selector.setProps({ selection: '', defaultSelection: 'Foo' });

      var label = this.selector.find('.selector__label').first();
      assert.equal('Foo', label.text());
    });

    it('overrides selection when new options are passed in', function() {
      this.selector.setProps({ selection: '' });

      // Mock the internal state as if the input changed
      this.selector.setState({ selected: 'Flora W.' });
      var label = this.selector.find('.selector__label').first();
      assert.equal('Flora W.', label.text(), 'renders when state set');

      // Update the optionsList, which should clear out previous state
      this.selector.setProps({ optionsList: [{ title: 'Foo B.' }] });
      label = this.selector.find('.selector__label').first();
      assert.equal('All', label.text(), 'renders the default label');

      var list = this.selector.find('.selector__options');
      assert.lengthOf(list.children(), 2, 'renders the new options list');
    });
  });
});

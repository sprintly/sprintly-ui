import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import ReactTestUtils from 'react-addons-test-utils';
import sinon from 'sinon';

import SelectorMenu from '../src/components/selector_menu/index';
import Label from '../src/components/selector_menu/label';
import List from '../src/components/selector_menu/list';
import Search from '../src/components/selector_menu/search';

describe("SelectorMenu", () => {
  let optionsJSON = null;
  let selector = null;

  beforeEach(() => {
    optionsJSON = [
      {title: "Option 1"},
      {title: "Option 2"}
    ];

    selector = mount(
      <SelectorMenu
        optionsList={optionsJSON}
        defaultSelection="All"
        onSelectionChange={sinon.spy()}
      />
    );
  });

  describe("rendering", () => {
    it("should render a label that displays current state", () => {
      assert.ok(selector.find(Label).exists());
    });

    it("should render default label on first render", () => {
      assert.equal(selector.first(Label).first().find('.inner').first().text(), "All");
    });

    it("should render a search input", () => {
      assert.ok(selector.find(Search).exists());
    });

    it("should render a list of options", () => {
      assert.ok(selector.find(List).exists());
    });

    it("should show all options plus default", () => {
      const optionsList = selector.find(".option");
      assert.equal(optionsList.length, 3);
    });
  });

  describe("toggling menu open/close", () => {
    let optionLabel = null;

    beforeEach(() => {
      optionLabel = selector.find(".selector__label").first();
      optionLabel.simulate('click');
    });

    it("should open on click if closed", () => {
      const dropdown = selector.find(".inner-wrapper.expanded")
      assert.isTrue(selector.state('expanded'));
    });

    it("should close on click if open", () => {
      const dropdown = selector.find(".inner-wrapper.expanded");
      optionLabel.simulate('click');

      assert.isFalse(selector.state('expanded'));
      assert.equal(selector.find(".inner-wrapper.expanded").length, 0);
    });
  });

  describe("search and selection", () => {
    let label = null;

    beforeEach(() => {
      label = selector.find(".selector__label");
      label.simulate('click');
    });

    it("should render a list of options (including default)", () => {
      const optionsList = selector.find(".option");
      assert.equal(optionsList.length, 3);
    });

    it("should only show options relevant to user search, if search input entered", () => {
      const input = selector.find("input").first();

      input.getDOMNode().value = "option 1";
      input.simulate('change');
      assert.equal(selector.find(".option").length, 1);
    });

    it("should trigger callback on ENTER pressed any valid option entered in search bar", () => {
      const input = selector.find("input").first();

      input.getDOMNode().value = "Option 1";
      input.simulate('change');
      input.simulate('keyDown', {which: 13});

      sinon.assert.calledWith(selector.prop('onSelectionChange'), "Option 1");
    });

    it("should be able to handle case insensitive input from user", () => {
      const spy = sinon.spy(selector.getNode(), 'selectOption');
      const input = selector.find("input").first();

      input.getDOMNode().value = "option 1";
      input.simulate('change');
      input.simulate('keyDown', {which: 13});

      sinon.assert.calledWith(spy, "Option 1");
    });

    it("should be able to handle partial option input from user", () => {
      const spy = sinon.spy(selector.getNode(), 'selectOption');
      const input = selector.find("input").first();

      input.getDOMNode().value = "2";
      input.simulate('change');
      input.simulate('keyDown', {which: 13});

      sinon.assert.calledWith(spy, "Option 2");
    });

    it("should close menu and clear input on submit", () => {
      const spy = sinon.spy(selector.getNode(), "onLabelClicked");
      const input = selector.find("input").first();

      input.getDOMNode().value = "option 1";
      input.simulate('change');
      input.simulate('keyDown', {which: 13});

      sinon.assert.calledOnce(spy);
      assert.equal(selector.find("input").first().getDOMNode().value, "");
    });
  });

  describe('controlled component with selection', () => {
    beforeEach(() => {
      selector.setProps({
        selection: 'Sam B.',
        optionsList: [
          { title: 'Sam B.' },
          { title: 'Flora W.' },
          { title: 'Justin A.' },
          { title: 'Nick S.' }
        ]
      });
    });

    it('renders the label correctly', () => {
      const label = selector.find('.selector__label').first();
      assert.equal('Sam B.', label.text());
    });

    it('renders the list correctly', () => {
      const list = selector.find('.selector__options').first();
      assert.lengthOf(list.children(), 4);
    });

    it('adds an unexpected value to the rendered options list', () => {
      selector.setProps({ selection: 'Unassigned' })

      const list = selector.find('.selector__options').first();
      assert.lengthOf(list.children(), 5);
    });

    it('renders the default label when selection is empty', () => {
      selector.setProps({ selection: '', defaultSelection: 'Foo' });

      const label = selector.find('.selector__label').first();
      assert.equal('Foo', label.text());
    });

    it('overrides selection when new options are passed in', () => {
      selector.setProps({ selection: '' });

      // Mock the internal state as if the input changed
      selector.setState({ selected: 'Flora W.' });
      let label = selector.find('.selector__label').first();
      assert.equal('Flora W.', label.text(), 'renders when state set');

      // Update the optionsList, which should clear out previous state
      selector.setProps({ optionsList: [{ title: 'Foo B.' }] });
      label = selector.find('.selector__label').first();
      assert.equal('All', label.text(), 'renders the default label');

      const list = selector.find('.selector__options');
      assert.lengthOf(list.children(), 2, 'renders the new options list');
    });
  });
});

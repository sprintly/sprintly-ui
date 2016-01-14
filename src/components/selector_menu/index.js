import React from 'react';
import pluck from 'lodash.pluck';
import fuzzy from 'fuzzy';
import Label from './label';
import List from './list';
import Search from './search';
import clickOutside from '@sprintly/react-onclickoutside';

/*
 * Renders dropdown showing currently selected options,
 * list of items, and fuzzy-search input.
 *
 * Takes a list of options (for example, collection.toJSON());
 * an optional default selection (or don't pass anything for default 'All');
 * and an 'onSelectionChange' callback to trigger some action based on user selection.
 *
 * NOTE:
 * Options in optionsList must have either a 'title' or a 'name' property.
 *
 */

const SelectorMenu = React.createClass({

  propTypes: {
    defaultSelection: React.PropTypes.string,
    optionsList: React.PropTypes.array,
    onSelectionChange: React.PropTypes.func.isRequired
  },

  mixins: [
    clickOutside
  ],

  getDefaultProps() {
    return {
      defaultSelection: 'All',
      optionsList: []
    };
  },

  getInitialState() {
    return {
      visible: [],
      expanded: false,
      clearInput: false
    };
  },

  componentWillReceiveProps(nextProps) {
    let currentOptions = this.props.optionsList;
    let diff = [];

    nextProps.optionsList.forEach((option, idx) => {
      let attr = option.title ? 'title' : 'name';
      if (option[attr] !== currentOptions[idx][attr]) {
        diff.push(option);
      }
    });

    if (diff.length) {
      this.setState({
        visible: [],
        selected: ''
      });
    }
  },

  /*
   * Returns a list of option names, plus the default value.
   */
  getOptionNames() {
    let options = [this.props.selection || this.state.selected || this.props.defaultSelection];

    this.props.optionsList.forEach((option) => {
      let attr = option.title ? 'title' : 'name';
      if (!options.includes(option[attr])) {
        options.push(option[attr]);
      }
    });

    return options;
  },

  handleClickOutside(event) {
    event.stopPropagation();

    this.setState({
      expanded: false
    });
  },

  onLabelClicked() {
    let expanded = this.state.expanded ? false : true;

    this.setState({
      expanded: expanded,
      clearInput: true
    });
  },

  selectOption(option) {
    this.onLabelClicked();

    this.setState({
      selected: option,
      visible: []
    });

    this.props.onSelectionChange(option);
  },

  /*
   * Matches partials against an alphabetically sorted list.
   */
  processSearchInput(val) {
    let sortedNames = this.getOptionNames().sort();

    let selection = sortedNames.find((name) => {
      return name.toLowerCase().indexOf(val) > -1;
    });

    if (!selection || selection === this.props.defaultSelection) {
      selection = this.props.defaultSelection;
    }

    this.selectOption(selection);
  },

  /*
   * Returns a fuzzy-search-delimited list of options if there's user input.
   * Returns all options otherwise.
   */
  filterList(filterBy) {
    if (!filterBy) {
      this.setState({
        visible: this.getOptionNames()
      });

      return;
    }

    let visible = pluck(fuzzy.filter(filterBy, this.getOptionNames()), 'string');
    this.setState({
      visible: visible,
      clearInput: false
    });
  },

  render() {
    let wrapperClass = this.state.expanded ? 'selector__wrapper expanded' : 'selector__wrapper';
    let innerClass = this.state.expanded ? 'inner-wrapper expanded' : 'inner-wrapper';

    let visible = this.state.visible.length > 0 ? this.state.visible : this.getOptionNames();
    let selected = this.props.selection || this.state.selected || this.props.defaultSelection;

    return (
      <div className={wrapperClass}>
        <Label
          selected={selected}
          onLabelClick={this.onLabelClicked}
        />
        <div className={innerClass}>
          <Search
            ref='searchInput'
            filterList={this.filterList}
            clearInput={this.state.clearInput}
            processSearchInput={this.processSearchInput}
          />
          <List
            defaultSelection={selected}
            optionNames={visible}
            onOptionSelect={this.selectOption}
          />
        </div>
      </div>
    );
  }
});

export default SelectorMenu;

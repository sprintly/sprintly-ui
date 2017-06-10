var React = window.React || require('react');
var PropTypes = require('prop-types');
var _ = require('lodash');
var Label = require('./label');
var List = require('./list');
var Search = require('./search');
var fuzzy = require('fuzzy');
var onClickOutside = require('@sprintly/react-onclickoutside');
var createReactClass = require('create-react-class');

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

var SelectorMenu = createReactClass({

  propTypes: {
    defaultSelection: PropTypes.string,
    optionsList: PropTypes.array,
    onSelectionChange: PropTypes.func.isRequired
  },

  mixins: [
    onClickOutside
  ],

  getDefaultProps: function() {
    return {
      defaultSelection: 'All',
      optionsList: []
    };
  },

  getInitialState: function() {
    return {
      visible: [],
      expanded: false,
      clearInput: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var nextOptions = _.compact(
      _.map(nextProps.optionsList, 'title').concat(_.map(nextProps.optionsList, 'name'))
    );

    var currentOptions = _.compact(
      _.map(this.props.optionsList, 'title').concat(_.map(this.props.optionsList, 'name'))
    );

    if (_.difference(nextOptions, currentOptions).length > 0) {
      this.setState({
        visible: [],
        selected: ''
      });
    }
  },

  getOptionNames: function() {
    // Returns a list of option names, plus the default value.
    var options = [this.props.selection || this.state.selected || this.props.defaultSelection];

    _.each(this.props.optionsList, function(option) {
      return option.title ? options.push(option.title) : options.push(option.name);
    });

    return _.uniq(options);
  },

  handleClickOutside: function(ev) {
    ev.stopPropagation();
    this.setState({
      expanded: false
    });
  },

  onLabelClicked: function() {
    var expanded = this.state.expanded ? false : true;
    this.setState({
      expanded: expanded,
      clearInput: true
    });
  },

  selectOption: function(optionName) {
    this.onLabelClicked();

    this.setState({
      selected: optionName,
      visible: []
    });

    this.props.onSelectionChange(optionName);
  },

  processSearchInput: function(val) {
    // Matches partials against an alphabetically sorted list.
    var sortedNames = this.getOptionNames().sort();

    var selection = _.find(sortedNames, function(name) {
      return name.toLowerCase().indexOf(val) > -1;
    });

    if (!selection || selection === this.props.defaultSelection) {
      selection = this.props.defaultSelection;
    }

    this.selectOption(selection);
  },

  filterList: function(filterBy) {
    // If user input, returns fuzzy search-delimited list of options;
    // else, shows all options.
    if (!filterBy) {
      this.setState({
        visible: this.getOptionNames()
      });
      return;
    }

    var visible = _.map(fuzzy.filter(filterBy, this.getOptionNames()), 'string');

    this.setState({
      visible: visible,
      clearInput: false
    });
  },

  render: function() {
    var wrapperClass = this.state.expanded ? 'selector__wrapper expanded' : 'selector__wrapper';
    var innerClass = this.state.expanded ? 'inner-wrapper expanded' : 'inner-wrapper';
    var visible = this.state.visible.length > 0 ? this.state.visible : this.getOptionNames();
    var selected = this.props.selection || this.state.selected || this.props.defaultSelection;

    return (
      <div className={wrapperClass}>
        <Label
          selected={selected}
          onClick={this.onLabelClicked}
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

module.exports = SelectorMenu;

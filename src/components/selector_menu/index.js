var React = window.React || require('react/addons');
var _ = require('lodash');
var Label = require('./label');
var List = require('./list');
var Search = require('./search');
var ClickOff = require('react-onclickoutside');
var fuzzy = require('fuzzy');

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

var SelectorMenu = React.createClass({

  propTypes: {
    defaultSelection: React.PropTypes.string,
    optionsList: React.PropTypes.array,
    onSelectionChange: React.PropTypes.func.isRequired
  },

  mixins: [ClickOff],

  getDefaultProps: function() {
    return {
      defaultSelection: 'All',
      optionsList: []
    };
  },

  getInitialState: function() {
    return {
      selected: this.props.defaultSelection,
      visible: this.getOptionNames(),
      expanded: false
    };
  },

  getOptionNames: function() {
    // Returns a list of option names, plus the default value.
    var options = [this.props.defaultSelection];

    _.each(this.props.optionsList, function(option) {
      return option.title ? options.push(option.title) : options.push(option.name);
    });

    return _.unique(options);
  },

  handleClickOutside: function(ev) {
    ev.stopPropagation();
    this.setState({
      expanded: false
    });
  },

  onLabelClicked: function() {
    var expandOrContract = this.state.expanded ? false : true;
    this.setState({
      expanded: expandOrContract
    });

    this.refs.searchInput.getDOMNode().focus();
  },

  cleanSearchState: function() {
    this.refs.searchInput.getDOMNode().value = '';

    this.setState({
      visible: this.getOptionNames()
    });
  },

  selectOption: function(optionName) {
    this.cleanSearchState();
    this.onLabelClicked();

    this.setState({
      selected: optionName
    });

    this.props.onSelectionChange(optionName);
  },

  normalizeInputValue: function(val) {
    // Normalizes casing to option casing from user input.
    // Matches partials against an alphabetically sorted list.
    val = val.toLowerCase();
    var sortedNames = this.getOptionNames().sort();

    var selection = _.find(sortedNames, function(name) {
      return name.toLowerCase().indexOf(val) > -1;
    });

    if (!selection || selection === this.props.defaultSelection) {
      selection = this.props.defaultSelection;
    }

    return selection;
  },

  checkIfSubmit: function(ev) {
    // If user presses ENTER in input box, submit choice.
    var value = ev.target.value;
    var option = '';

    if (ev.which === 13 && value) {
      option = this.normalizeInputValue(value);
      this.selectOption(option);
    }
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

    var visible = _.map(fuzzy.filter(filterBy, this.state.visible), function(result) {
      return result.string;
    });

    this.setState({
      visible: visible
    });
  },

  render: function() {
    var wrapperClass = this.state.expanded ? 'selector__wrapper expanded' : 'selector__wrapper';
    var innerClass = this.state.expanded ? 'inner expanded' : 'inner';

    return (
      <div className={wrapperClass}>
        <Label
          selected={this.state.selected}
          onClick={this.onLabelClicked}
        />
        <div className={innerClass}>
          <Search
            ref='searchInput'
            onKeyDown={this.checkIfSubmit}
            filterList={this.filterList}
          />
          <List
            defaultSelection={this.props.defaultSelection}
            optionNames={this.state.visible}
            onOptionSelect={this.selectOption}
          />
        </div>
      </div>
    );
  }
});

module.exports = SelectorMenu;
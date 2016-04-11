'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _arrayFind = require('array-find');

var _arrayFind2 = _interopRequireDefault(_arrayFind);

var _lodash = require('lodash.pluck');

var _lodash2 = _interopRequireDefault(_lodash);

var _fuzzy = require('fuzzy');

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _label = require('./label');

var _label2 = _interopRequireDefault(_label);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _search = require('./search');

var _search2 = _interopRequireDefault(_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 * @TODO: this needs to be restructured. It's ultimately really difficult to
 * work with (and test) a component that has to juggle props and state to
 * accommodate external input for selection value.
 */

var SelectorMenu = _react2.default.createClass({
  displayName: 'SelectorMenu',


  propTypes: {
    defaultSelection: _react2.default.PropTypes.string,
    optionsList: _react2.default.PropTypes.array,
    onSelectionChange: _react2.default.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      defaultSelection: 'All',
      optionsList: []
    };
  },
  getInitialState: function getInitialState() {
    return {
      visible: [],
      expanded: false,
      clearInput: false
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var currentOptions = this.props.optionsList;
    var diff = [];

    nextProps.optionsList.forEach(function (option, idx) {
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
  onClickOff: function onClickOff(event) {
    if (event.target.className === "option") {
      return;
    }

    this.setState({
      expanded: false
    });
  },


  /*
   * Returns a list of option names, plus the default value.
   */
  getOptionNames: function getOptionNames() {
    var options = [this.props.selection || this.state.selected || this.props.defaultSelection];

    this.props.optionsList.forEach(function (option) {
      var attr = option.title ? 'title' : 'name';
      if (options.indexOf(option[attr]) === -1) {
        options.push(option[attr]);
      }
    });

    return options;
  },
  onLabelClicked: function onLabelClicked() {
    var expanded = this.state.expanded ? false : true;

    this.setState({
      expanded: expanded,
      clearInput: true
    });
  },
  selectOption: function selectOption(option) {
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
  processSearchInput: function processSearchInput(val) {
    var sortedNames = this.getOptionNames().sort();

    var selection = (0, _arrayFind2.default)(sortedNames, function (name) {
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
  filterList: function filterList(filterBy) {
    if (!filterBy) {
      this.setState({
        visible: this.getOptionNames()
      });

      return;
    }

    var visible = (0, _lodash2.default)(_fuzzy2.default.filter(filterBy, this.getOptionNames()), 'string');
    this.setState({
      visible: visible,
      clearInput: false
    });
  },
  render: function render() {
    var _this = this;

    var wrapperClass = this.state.expanded ? 'selector__wrapper expanded' : 'selector__wrapper';
    var innerClass = this.state.expanded ? 'inner-wrapper expanded' : 'inner-wrapper';

    var visible = this.state.visible.length > 0 ? this.state.visible : this.getOptionNames();
    var selected = this.props.selection || this.state.selected || this.props.defaultSelection;

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        { className: wrapperClass },
        _react2.default.createElement(_label2.default, {
          selected: selected,
          onLabelClick: this.onLabelClicked
        }),
        _react2.default.createElement(
          'div',
          { className: innerClass },
          _react2.default.createElement(_search2.default, {
            ref: 'searchInput',
            filterList: this.filterList,
            clearInput: this.state.clearInput,
            processSearchInput: this.processSearchInput
          }),
          _react2.default.createElement(_list2.default, {
            defaultSelection: selected,
            optionNames: visible,
            onOptionSelect: this.selectOption
          })
        )
      ),
      this.state.expanded ? _react2.default.createElement('div', { className: 'layer__click-off', onClick: function onClick(event) {
          return _this.onClickOff(event);
        } }) : null
    );
  }
});

exports.default = SelectorMenu;
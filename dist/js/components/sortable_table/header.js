'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _expander = require('../expander');

var _expander2 = _interopRequireDefault(_expander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Renders header bar where cells are clickable elements that trigger a
 * sort on that column. Also responsible for proxying Expander events.
 * Property 'tableType' describes the data described by the table: ie,
 * might be 'backlog', if the table shows just backlog items. This property
 * is passed back through the label click callback so that you may take
 * action on that table's data alone (if rendering multiple tables in a view.)
 */

var TableHeader = _react2.default.createClass({
  displayName: 'TableHeader',


  propTypes: {
    tableType: _react2.default.PropTypes.string,
    columns: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string).isRequired,
    expanded: _react2.default.PropTypes.bool,
    isBulkEditable: _react2.default.PropTypes.bool,
    onExpanderClick: _react2.default.PropTypes.func,
    onLabelClick: _react2.default.PropTypes.func
  },

  /*
   * Keeps track of sort direction on each column.
   */
  getInitialState: function getInitialState() {
    var directionHash = {};
    this.props.columns.forEach(function (column) {
      directionHash[column] = 'ascending';
    });

    return {
      directionHash: directionHash
    };
  },


  /*
   * Grabs table type and sort option and passes to sort callback.
   * Flips direction in direction hash.
   */
  onLabelClick: function onLabelClick(event, columnName) {
    var direction = this.state.directionHash[columnName] === 'ascending' ? 'descending' : 'ascending';
    var updatedHash = (0, _objectAssign2.default)({}, this.state.directionHash, _defineProperty({}, columnName, direction));

    this.props.onLabelClick(this.props.tableType, columnName, direction);
    this.setState({
      directionHash: updatedHash
    });
  },


  /*
   * Render column labels and optionally render an expander element that proxies click events
   * to table (Note: we'll only render this if we have a control column to render it into).
   */
  render: function render() {
    var _this = this;

    var props = this.props;
    var control = props.isBulkEditable ? _react2.default.createElement('th', { key: 'control', className: 'sortable__label control' }) : null;

    var expander = props.columns.indexOf('product') >= 0 ? _react2.default.createElement(
      'th',
      { key: 'expander', className: 'sortable__label' },
      _react2.default.createElement(_expander2.default, {
        expanded: props.expanded,
        onExpanderClick: props.onExpanderClick
      })
    ) : null;

    var labels = [];
    props.columns.forEach(function (column) {
      // We don't want to render a label for the control column (ie, 'products')
      if (column !== 'product') {
        labels.push(_react2.default.createElement(
          'th',
          { key: column, title: 'click to sort', className: 'sortable__label' },
          _react2.default.createElement(
            'button',
            {
              className: 'sortable__button ' + column.replace(' ', '-'),
              key: column,
              onClick: function onClick(event) {
                return _this.onLabelClick(event, column.toLowerCase());
              } },
            column
          )
        ));
      }
    });

    return _react2.default.createElement(
      'tr',
      { className: 'sortable__row' },
      control,
      expander,
      labels
    );
  }
});

exports.default = TableHeader;
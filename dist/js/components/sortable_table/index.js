'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _header = require('./header');

var _header2 = _interopRequireDefault(_header);

var _row = require('./row');

var _row2 = _interopRequireDefault(_row);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Takes an array of json objects (for example, a Backbone.Collection.toJSON())
 * and an array of attributes to serve as column header labels and creates a sortable table from the data.
 * Column header labels are clickable and will call an external sort method, passing
 * 'ascending' or 'descending' based on which option is currently active.
 *
 * Responsible for managing the expanded/condensed state of rows and for proxying sort
 * events up to parent view for processing.
 */

var SortableTable = _react2.default.createClass({
  displayName: 'SortableTable',


  propTypes: {
    tableType: _react2.default.PropTypes.string,
    label: _react2.default.PropTypes.string,
    collection: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object).isRequired,
    columnNames: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string).isRequired,
    baseUrl: _react2.default.PropTypes.string,
    onSortCollection: _react2.default.PropTypes.func,
    isBulkEditable: _react2.default.PropTypes.bool,
    onBulkSelect: _react2.default.PropTypes.func,
    modelChangerUtilities: _react2.default.PropTypes.object,
    navigatorUtility: _react2.default.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      baseUrl: '',
      isBulkEditable: false,
      onBulkSelect: function onBulkSelect() {},
      modelChangerUtilities: {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      expanded: false,
      sortBy: 'number'
    };
  },
  onExpandClicked: function onExpandClicked(event, expanded) {
    if (expanded !== this.state.expanded) {
      this.setState({
        expanded: expanded
      });
    }
  },
  render: function render() {
    var _this = this;

    var props = this.props;
    var rows = [];

    props.collection.forEach(function (model) {
      var modelId = [model.product.id, model.number];
      var rowProps = {
        key: modelId,
        model: model,
        columns: props.columnNames,
        expanded: _this.state.expanded,
        baseUrl: props.baseUrl,
        modelChangerUtilities: props.modelChangerUtilities,
        navigatorUtility: props.navigatorUtility,
        isBulkEditable: props.isBulkEditable,
        onBulkSelect: props.onBulkSelect
      };

      if (model.isMatched && !model.parent) {
        // Add a spacer row above matched parents.
        rows.push(_react2.default.createElement('tr', { key: modelId + ':spacer', className: 'sortable__row spacer' }));
      }

      rows.push(_react2.default.createElement(_row2.default, rowProps));
    });

    var headerProps = {
      tableType: props.tableType,
      columns: props.columnNames,
      sortedBy: this.state.sortBy,
      expanded: this.state.expanded,
      isBulkEditable: props.isBulkEditable,
      onExpanderClick: this.onExpandClicked,
      onLabelClick: props.onSortCollection
    };

    return _react2.default.createElement(
      'div',
      { className: 'sortable__wrapper ' + props.label },
      _react2.default.createElement(
        'h2',
        { className: 'sortable__title' },
        props.label
      ),
      _react2.default.createElement(
        'table',
        { className: 'sortable__table' },
        _react2.default.createElement(
          'thead',
          { className: 'head' },
          _react2.default.createElement(_header2.default, headerProps)
        ),
        _react2.default.createElement(
          'tbody',
          null,
          rows
        )
      )
    );
  }
});

exports.default = SortableTable;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _estimator = require('../estimator');

var _estimator2 = _interopRequireDefault(_estimator);

var _status = require('../status');

var _status2 = _interopRequireDefault(_status);

var _tags = require('../tags');

var _tags2 = _interopRequireDefault(_tags);

var _tag_editor = require('../tag_editor');

var _tag_editor2 = _interopRequireDefault(_tag_editor);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Renders a single table row for displaying item data.
 * Row accepts expanded prop for controlling whether the row appears
 * condensed (default) or optionally expanded (if using row with the sortable TableHeader.
 * Toggling between the two states happens via the Expander element in TableHeader.)
 * @TODO: reorg styles so don't have to calculate here.
 */

function abbreviateUsername(user) {
  return user.last_name ? user.first_name + ' ' + user.last_name[0] + '.' : user.first_name;
}

var TableRow = _react2.default.createClass({
  displayName: 'TableRow',


  propTypes: {
    model: _react2.default.PropTypes.object.isRequired,
    columns: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string).isRequired,
    expanded: _react2.default.PropTypes.bool,
    baseUrl: _react2.default.PropTypes.string,
    modelChangerUtilities: _react2.default.PropTypes.object,
    navigatorUtility: _react2.default.PropTypes.object,
    isBulkEditable: _react2.default.PropTypes.bool,
    onBulkSelect: _react2.default.PropTypes.func
  },

  getCellBuilder: function getCellBuilder(column, className, id) {
    var methodMap = {
      product: this.buildProductCell,
      number: this.buildNumberCell,
      size: this.buildEstimateCell,
      status: this.buildStatusCell,
      title: this.buildTitleCell,
      tags: this.buildTagsCell,
      'created by': this.buildCreatedByCell,
      'assigned to': this.buildAssigneeCell,
      created: this.buildCreatedAtCell
    };

    return methodMap[column](className, id);
  },
  render: function render() {
    var _this = this;

    var p = this.props;
    var modelId = [p.model.product.id, p.model.number];

    var wrapperClass = 'wrapper ' + (p.expanded ? 'expanded' : 'condensed');
    var rowClass = 'sortable__row ' + p.model.type;

    if (p.expanded) {
      rowClass += ' expanded';
    }

    // "matched": item is grouped with parent/subitems.
    // "nonMatching": item doesn't fit collection filters, but is included to match w/subitems that do.
    if (p.model.isMatched) {
      rowClass += p.model.isNonMatching ? ' matched non-matching' : ' matched';
    }

    var cells = [];
    if (p.isBulkEditable) {
      cells.push(_react2.default.createElement(
        'td',
        { key: 'control' + ':' + modelId, className: 'sortable__cell' },
        this.buildControlCell(wrapperClass)
      ));
    }

    p.columns.forEach(function (column) {
      cells.push(_react2.default.createElement(
        'td',
        { key: column + ':' + modelId, className: 'sortable__cell' },
        _this.getCellBuilder(column, wrapperClass, modelId)
      ));
    });

    return _react2.default.createElement(
      'tr',
      { className: rowClass },
      cells
    );
  },
  buildControlCell: function buildControlCell(classes) {
    // Left border on matched rows causes padding weirdness in checkboxes,
    // so we add corrective styles on matched rows.
    var p = this.props;
    classes += p.model.isMatched ? ' narrow matched' : ' narrow';
    return _react2.default.createElement(
      'div',
      { className: classes },
      _react2.default.createElement('input', { type: 'checkbox', onClick: function onClick() {
          return p.onBulkSelect(p.model);
        } })
    );
  },
  buildProductCell: function buildProductCell(classes) {
    var p = this.props;
    var linkProps = {
      href: p.baseUrl + '/product/' + p.model.product.id,
      className: 'js-item-link link product-cell'
    };

    var subitemClass = p.expanded ? 'subitem expanded' : 'subitem';
    var subitemArrow = p.model.parent ? _react2.default.createElement('i', { className: subitemClass }) : '';

    return _react2.default.createElement(
      'div',
      { className: classes + ' wider' },
      subitemArrow,
      _react2.default.createElement(
        'a',
        linkProps,
        p.model.product.name
      )
    );
  },
  buildNumberCell: function buildNumberCell(classes) {
    var p = this.props;
    var numberProps = {
      href: p.baseUrl + '/product/' + p.model.product.id + '/item/' + p.model.number,
      className: 'js-item-link link number-cell',
      'data-item-number': p.model.number
    };

    return _react2.default.createElement(
      'div',
      { className: classes },
      _react2.default.createElement(
        'a',
        numberProps,
        '#',
        p.model.number
      )
    );
  },
  buildEstimateCell: function buildEstimateCell(classes, mId) {
    var p = this.props;
    var estimateProps = {
      modelId: mId,
      readOnly: !!p.model.isNonMatching,
      itemType: p.model.type,
      score: p.model.score,
      estimateChanger: p.modelChangerUtilities.estimateChanger
    };

    return _react2.default.createElement(
      'div',
      { className: classes + ' narrow' },
      _react2.default.createElement(_estimator2.default, estimateProps)
    );
  },
  buildStatusCell: function buildStatusCell(classes, mId) {
    var p = this.props;
    var statusProps = {
      modelId: mId,
      readOnly: !!p.model.isNonMatching,
      status: p.model.status,
      statusChanger: p.modelChangerUtilities.statusChanger
    };

    return _react2.default.createElement(
      'div',
      { className: classes + ' narrow' },
      _react2.default.createElement(_status2.default, statusProps)
    );
  },
  buildCreatedByCell: function buildCreatedByCell(classes) {
    return _react2.default.createElement(
      'div',
      { className: classes },
      abbreviateUsername(this.props.model.created_by)
    );
  },
  buildAssigneeCell: function buildAssigneeCell(classes, mId) {
    // @TODO
    return _react2.default.createElement('div', null);
  },
  buildTitleCell: function buildTitleCell(classes) {
    var p = this.props;
    var titleProps = {
      href: p.baseUrl + '/product/' + p.model.product.id + '/item/' + p.model.number,
      className: 'js-item-link link title-cell',
      'data-item-number': p.model.number
    };

    return _react2.default.createElement(
      'div',
      { className: classes + ' widest' },
      _react2.default.createElement(
        'a',
        titleProps,
        p.model.title
      )
    );
  },
  buildTagsCell: function buildTagsCell(classes, mId) {
    var p = this.props;
    var editorProps = {
      modelId: mId,
      readOnly: !!p.model.isNonMatching,
      tags: p.model.tags,
      tagChanger: p.modelChangerUtilities.tagChanger
    };

    var tagsProps = {
      tags: p.model.tags,
      condensed: !p.expanded,
      navigatorUtility: p.navigatorUtility
    };

    return _react2.default.createElement(
      'div',
      { className: classes + ' wider' },
      _react2.default.createElement(_tag_editor2.default, editorProps),
      _react2.default.createElement(_tags2.default, tagsProps)
    );
  },
  buildCreatedAtCell: function buildCreatedAtCell(classes) {
    return _react2.default.createElement(
      'div',
      { className: classes + ' wide' },
      (0, _moment2.default)(this.props.model.created_at).format('MM/DD/YY')
    );
  }
});

exports.default = TableRow;
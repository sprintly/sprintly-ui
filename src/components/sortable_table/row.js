var React = window.React || require('react/addons');
var _ = require('lodash');
var Estimator = require('../estimator');
var Status = require('../status');
var Tags = require('../tags');
var TagEditor = require('../tag_editor');
var moment = require('moment');

/*
 * Renders a single table row for displaying item data.
 * Row accepts expanded prop for controlling whether the row appears
 * condensed (default) or optionally expanded (if using row with the sortable TableHeader.
 * Toggling between the two states happens via the Expander element in TableHeader.)
 * TODO(fw): reorg styles so don't have to calculate here.
 */

var abbreviateUsername = function (user) {
  return user.last_name ? user.first_name + ' ' + user.last_name[0] + '.' :
    user.first_name;
};

var TableRow = React.createClass({
  propTypes: {
    model: React.PropTypes.object.isRequired,
    columns: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    expanded: React.PropTypes.string,
    baseUrl: React.PropTypes.string,
    modelChangerUtilities: React.PropTypes.object,
    navigatorUtility: React.PropTypes.object,
    isBulkEditable: React.PropTypes.bool,
    onBulkSelect: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      expanded: 'condensed',
      baseUrl: '',
      modelChangerUtilities: {},
      onBulkSelect: _.noop()
    };
  },

  bulkSelectClicked: function(ev) {
    // WIP: This will likely change.
    ev.stopPropagation();
    this.props.onBulkSelect(this.props.model);
  },

  render: function() {
    var modelId = [this.props.model.product.id, this.props.model.number];
    var condensed = this.props.expanded === 'condensed' ? true : false;

    var wrapperClass = condensed ? 'wrapper condensed' : 'wrapper expanded';
    var rowClass = 'sortable__row ' + this.props.model.type;
    if (!condensed) {
      rowClass += ' expanded';
    }

    // "matched": item is grouped with parent/subitems.
    // "nonMatching": item doesn't fit collection filters, but is included to match w/subitems that do.
    if (this.props.model.isMatched) {
      rowClass += this.props.model.isNonMatching ? ' matched non-matching' : 'matched';
    }

    var columnMap = {
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

    var cells = [];

    if (this.props.isBulkEditable) {
      cells.push(
        <td key={'control' + ':' + modelId} className='sortable__cell'>
          {this.buildControlCell(wrapperClass)}
        </td>
      );
    }

    _.each(this.props.columns, function(column) {
      cells.push(
        <td key={column + ':' + modelId} className='sortable__cell'>
          {columnMap[column](wrapperClass, modelId)}
        </td>
      );
    }, this);

    return (
      <tr className={rowClass}>
        {cells}
      </tr>
    );
  },

  buildControlCell: function(classes) {
    // Left border on matched rows causes padding weirdness in checkboxes,
    // so we add corrective styles on matched rows.
    classes += this.props.model.isMatched ? ' narrow matched' : ' narrow';

    return (
      <div className={classes}>
        <input type='checkbox' onClick={this.bulkSelectClicked} />
      </div>
    );
  },

  buildProductCell: function(classes) {
    var linkProps = {
      href: this.props.baseUrl + '/product/' + this.props.model.product.id,
      className: 'js-item-link link product-cell',
    };
    var subitemArrow = null;

    var subitemClass = this.props.expanded === 'expanded' ? 'subitem expanded' : 'subitem';

    if (this.props.model.parent) {
      subitemArrow = (
        <i className="subitem-arrow" className={subitemClass}></i>
      );
    }

    return (
      <div className={classes + ' wider'}>
        {subitemArrow}
        <a {...linkProps}>{this.props.model.product.name}</a>
      </div>
    );
  },

  buildNumberCell: function(classes) {
    var props = {
      href: this.props.baseUrl + '/product/' + this.props.model.product.id + '/item/' + this.props.model.number,
      className: 'js-item-link link number-cell',
      'data-item-number': this.props.model.number
    };
    return (
      <div className={classes}>
        <a {...props}>#{this.props.model.number}</a>
      </div>
    );
  },

  buildEstimateCell: function(classes, mId) {
    var props = {
      modelId: mId,
      readOnly: !!this.props.model.isNonMatching,
      itemType: this.props.model.type,
      score: this.props.model.score,
      estimateChanger: this.props.modelChangerUtilities.estimateChanger
    };

    return (
      <div className={classes + ' narrow'}>
        <Estimator {...props} />
      </div>
    );
  },

  buildStatusCell: function(classes, mId) {
    var props = {
      modelId: mId,
      readOnly: !!this.props.model.isNonMatching,
      status: this.props.model.status,
      statusChanger: this.props.modelChangerUtilities.statusChanger
    };

    return (
      <div className={classes + ' narrow'}>
        <Status {...props} />
      </div>
    );
  },

  buildAssigneeCell: function(classes, mId) {
    // TODO(fw): implement
    return (<div></div>);
  },

  buildCreatedByCell: function(classes) {
    return (
      <div className={classes}>
        {abbreviateUsername(this.props.model.created_by)}
      </div>
    );
  },

  buildTitleCell: function(classes) {
    var props = {
      href: this.props.baseUrl + '/product/' + this.props.model.product.id + '/item/' + this.props.model.number,
      className: 'js-item-link link title-cell',
      'data-item-number': this.props.model.number
    };

    return (
      <div className={classes + ' widest'}>
        <a {...props}>
          {this.props.model.title}
        </a>
      </div>
    );
  },

  buildTagsCell: function(classes, mId) {
    var editorProps = {
      modelId: mId,
      readOnly: !!this.props.model.isNonMatching,
      tags: this.props.model.tags,
      tagChanger: this.props.modelChangerUtilities.tagChanger
    };

    var tagsProps = {
      tags: this.props.model.tags,
      condensed: this.props.expanded === 'condensed' ? true : false,
      navigatorUtility: this.props.navigatorUtility
    };

    return (
      <div className={classes + ' wider'}>
        <TagEditor {...editorProps} />
        <Tags {...tagsProps} />
      </div>
    );
  },

  buildCreatedAtCell: function(classes) {
    return (
      <div className={classes + ' wide'}>
        {moment(this.props.model.created_at).format('MM/DD/YY')}
      </div>
    );
  }
});

module.exports = TableRow;

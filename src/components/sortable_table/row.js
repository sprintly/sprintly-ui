var React = window.React || require('react/addons');
var _ = require('lodash');
var Estimator = require('../estimator');
var Status = require('../status');
var Tags = require('../tags');
var TagEditor = require('../tag_editor');
var SortableStyles = require('../../styles/sortable_table');
var moment = require('moment');

/*
 * Renders a single table row for displaying item data.
 * Row accepts expanded prop for controlling whether the row appears
 * condensed (default) or optionally expanded (if using row with the sortable TableHeader.
 * Toggling between the two states happens via the Expander element in TableHeader.)
 */

var abbreviateUsername = function (user) {
  var name = user.first_name;
  if (user.last_name) {
    name += " " + user.last_name[0] + ".";
  }
  return name;
};

var TableRow = React.createClass({
  propTypes: {
    model: React.PropTypes.object.isRequired,
    columns: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    expanded: React.PropTypes.string,
    modelChangerUtilities: React.PropTypes.object,
    navigatorUtility: React.PropTypes.object,
    isBulkEditable: React.PropTypes.bool,
    onBulkSelect: React.PropTypes.func
  },

  mixins: [SortableStyles],

  getDefaultProps: function() {
    return {
      expanded: 'condensed',
      modelChangerUtilities: {},
      onBulkSelect: _.noop()
    };
  },

  getInitialState: function() {
    return {
      hover: false
    };
  },

  bulkSelectClicked: function(ev) {
    // WIP(fw) This will likely change.
    ev.stopPropagation();
    this.props.onBulkSelect(this.props.model);
  },

  render: function() {
    /*
     * This is so gross. Can we find a way around this column checking?
     * Do all columns need to be optional?
     */
    var modelId = [this.props.model.product.id, this.props.model.number];
    var condensed = this.props.expanded === 'condensed' ? true : false;
    var itemType = this.props.model.type;

    var rowClass = "table-row " + this.props.expanded;
    var rowStyles = _.extend({}, SortableStyles.row[itemType],
      !condensed ? SortableStyles.row.expanded : null);

    // "matched": item is grouped with parent/subitems.
    // "nonMatching": item doesn't fit collection filters, but is included to match w/subitems that do.
    if (this.props.model.isMatched) {
      rowStyles = _.extend({}, rowStyles, SortableStyles.row.matched,
        this.props.model.isNonMatching ? SortableStyles.row.nonMatching : null);
    }

    var wrapperStyles = condensed ? SortableStyles.cell.condensed : SortableStyles.cell.expanded;

    // Lookup hash for easy column-type inclusion checking.
    // TODO(fw): find a better way to do this.
    var columns = _.object(this.props.columns, this.props.columns);
    var possibleCells = {
      control: this.props.isBulkEditable ? this.buildControlCell(wrapperStyles) : null,
      product: columns.product ? this.buildProductCell(wrapperStyles) : null,
      number: columns.number ? this.buildNumberCell(wrapperStyles) : null,
      estimate: columns.size ? this.buildEstimateCell(modelId, itemType, wrapperStyles) : null,
      status: columns.status ? this.buildStatusCell(modelId, wrapperStyles) : null,
      title: columns.title ? this.buildTitleCell(condensed, wrapperStyles) : null,
      tags: columns.tags ? this.buildTagsCell(modelId, condensed, wrapperStyles) : null,
      createdBy: columns['created by'] ? this.buildCreatedByCell(wrapperStyles) : null,
      assignedTo: columns['assigned to'] ? this.buildAssigneeCell(modelId, wrapperStyles) : null,
      createdAt: columns.created ? this.buildCreatedAtCell(wrapperStyles) : null
    };

    var cells = _.compact(_.map(possibleCells, function(cell, k) {
      return cell ? (
        <td key={k + ':' + modelId} style={SortableStyles.cell.base}>{cell}</td>
        ) : null;
    }, this));

    return (
      <tr className={rowClass} style={rowStyles}>
        {cells}
      </tr>
    );
  },

  buildControlCell: function(styles) {
    // Left border on matched rows causes padding weirdness in checkboxes,
    // so we add corrective styles on matched rows.
    var controlStyles = this.props.model.isMatched ?
      _.extend({}, styles, SortableStyles.cell.narrow, SortableStyles.cell.borderCorrection) :
      _.extend({}, styles, SortableStyles.cell.narrow);

    return (
      <div style={controlStyles}>
        <input type="checkbox" onClick={this.bulkSelectClicked} />
      </div>
    );
  },

  buildProductCell: function(styles) {
    var subitemArrow = null;
    var subitemArrowStyles = this.props.expanded === 'expanded' ?
      _.extend({}, SortableStyles.cell.subitemArrow, SortableStyles.cell.subitemArrowExpanded) :
      SortableStyles.cell.subitemArrow;

    if (this.props.model.parent) {
      subitemArrow = (
        <i className="subitem-arrow" style={subitemArrowStyles}></i>
      );
    }

    return (
      <div style={_.extend({}, styles, SortableStyles.cell.wider)}>
        {subitemArrow}
        {this.props.model.product.name}
      </div>
    );
  },

  buildNumberCell: function(styles) {
    return (
      <div style={styles}>
        #{this.props.model.number}
      </div>
    );
  },

  buildEstimateCell: function(mId, type, styles) {
    return (
      <div style={_.extend({}, styles, SortableStyles.cell.narrow)}>
        <Estimator
          modelId={mId}
          readOnly={!!this.props.model.isNonMatching}
          itemType={type}
          score={this.props.model.score}
          estimateChanger={this.props.modelChangerUtilities.estimateChanger}
        />
      </div>
    );
  },

  buildStatusCell: function(mId, styles) {
    return (
      <div style={_.extend({}, styles, SortableStyles.cell.narrow)}>
        <Status
          modelId={mId}
          readOnly={!!this.props.model.isNonMatching}
          status={this.props.model.status}
          statusChanger={this.props.modelChangerUtilities.statusChanger}
        />
      </div>
    );
  },

  buildAssigneeCell: function(mId, styles) {
    return (<div></div>);
  },

  buildCreatedByCell: function(styles) {
    return (
      <div style={styles}>
        {abbreviateUsername(this.props.model.created_by)}
      </div>
    );
  },

  buildTitleCell: function(condense, styles) {
    var href = '/product/' + this.props.model.product.id + '/item/' + this.props.model.number;
    var linkStyle = this.state.hover ? SortableStyles.cell.linkHover :
      SortableStyles.cell.link;

    return (
      <div style={_.extend({}, styles, SortableStyles.cell.widest)}>
        <a href={href}
          className="js-item-link"
          data-item-number={this.props.model.number}
          style={linkStyle}
          onMouseOver={this.onTitleLinkHover}
          onMouseOut={this.onTitleLinkOut}>
          {this.props.model.title}
        </a>
      </div>
    );
  },

  buildTagsCell: function(mId, condense, styles) {
    return (
      <div style={_.extend({}, styles, SortableStyles.cell.wider)}>
        <TagEditor
          modelId={mId}
          readOnly={!!this.props.model.isNonMatching}
          tags={this.props.model.tags}
          tagChanger={this.props.modelChangerUtilities.tagChanger}
        />
        <Tags
          tags={this.props.model.tags}
          condensed={condense}
          tagChanger={this.props.modelChangerUtilities.tagChanger}
          navigatorUtility={this.props.navigatorUtility}
        />
      </div>
    );
  },

  buildCreatedAtCell: function(styles) {
    return (
      <div style={_.extend({}, styles, SortableStyles.cell.wide)}>
        {moment(this.props.model.created_at).format('MM/DD/YY')}
      </div>
    );
  },

  onTitleLinkHover: function() {
    this.setState({
      hover: true
    });
  },

  onTitleLinkOut: function() {
    this.setState({
      hover: false
    });
  }
});

module.exports = TableRow;
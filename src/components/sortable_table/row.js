var React = window.React || require('react/addons');
var _ = require('lodash');
var Estimator = require('../estimator');
var Status = require('../status');
var Tags = require('../tags');
var TagEditor = require('../tag_editor');
var Styles = require('../../styles/sortable_table');
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

  mixins: [Styles],

  getDefaultProps: function() {
    return {
      expanded: 'condensed',
      baseUrl: '',
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
    // WIP: This will likely change.
    ev.stopPropagation();
    this.props.onBulkSelect(this.props.model);
  },

  render: function() {
    var modelId = [this.props.model.product.id, this.props.model.number];

    var condensed = this.props.expanded === 'condensed' ? true : false;
    var wrapperStyles = condensed ? Styles.cell.condensed : Styles.cell.expanded;

    // "matched": item is grouped with parent/subitems.
    // "nonMatching": item doesn't fit collection filters, but is included to match w/subitems that do.
    var rowStyles = _.extend({}, Styles.row[this.props.model.type],
      !condensed ? Styles.row.expanded : null);
    if (this.props.model.isMatched) {
      rowStyles = _.extend({}, rowStyles, Styles.row.matched,
        this.props.model.isNonMatching ? Styles.row.nonMatching : null);
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
        <td key={'control' + ':' + modelId} style={Styles.cell.base}>
          {this.buildControlCell(wrapperStyles)}
        </td>
      );
    }

    _.each(this.props.columns, function(column) {
      cells.push(
        <td key={column + ':' + modelId} style={Styles.cell.base}>
          {columnMap[column](wrapperStyles, modelId)}
        </td>
      );
    }, this);

    return (
      <tr className={'table-row' + this.props.expanded} style={rowStyles}>
        {cells}
      </tr>
    );
  },

  buildControlCell: function(styles) {
    // Left border on matched rows causes padding weirdness in checkboxes,
    // so we add corrective styles on matched rows.
    var controlStyles = this.props.model.isMatched ?
      _.extend({}, styles, Styles.cell.narrow, Styles.cell.borderCorrection) :
      _.extend({}, styles, Styles.cell.narrow);

    return (
      <div style={controlStyles}>
        <input type="checkbox" onClick={this.bulkSelectClicked} />
      </div>
    );
  },

  buildProductCell: function(styles) {
    var subitemArrow = null;
    var subitemArrowStyles = this.props.expanded === 'expanded' ?
      _.extend({}, Styles.cell.subitemArrow, Styles.cell.subitemArrowExpanded) :
      Styles.cell.subitemArrow;

    if (this.props.model.parent) {
      subitemArrow = (
        <i className="subitem-arrow" style={subitemArrowStyles}></i>
      );
    }

    return (
      <div style={_.extend({}, styles, Styles.cell.wider)}>
        {subitemArrow}
        {this.props.model.product.name}
      </div>
    );
  },

  buildNumberCell: function(styles) {
    var props = {
      href: this.props.baseUrl + '/product/' + this.props.model.product.id + '/item/' + this.props.model.number,
      className: 'js-item-link title-cell',
      'data-item-number': this.props.model.number,
      style: this.state.hover ? Styles.cell.linkHover : Styles.cell.link,
      onMouseOver: this.onTitleLinkHover,
      onMouseOut: this.onTitleLinkOut
    };
    return (
      <div style={styles}>
        <a {...props}>#{this.props.model.number}</a>
      </div>
    );
  },

  buildEstimateCell: function(styles, mId) {
    var props = {
      modelId: mId,
      readOnly: !!this.props.model.isNonMatching,
      itemType: this.props.model.type,
      score: this.props.model.score,
      estimateChanger: this.props.modelChangerUtilities.estimateChanger
    };

    return (
      <div style={_.extend({}, styles, Styles.cell.narrow)}>
        <Estimator {...props} />
      </div>
    );
  },

  buildStatusCell: function(styles, mId) {
    var props = {
      modelId: mId,
      readOnly: !!this.props.model.isNonMatching,
      status: this.props.model.status,
      statusChanger: this.props.modelChangerUtilities.statusChanger
    };

    return (
      <div style={_.extend({}, styles, Styles.cell.narrow)}>
        <Status {...props} />
      </div>
    );
  },

  buildAssigneeCell: function(styles, mId) {
    // TODO(fw): implement
    return (<div></div>);
  },

  buildCreatedByCell: function(styles) {
    return (
      <div style={styles}>
        {abbreviateUsername(this.props.model.created_by)}
      </div>
    );
  },

  buildTitleCell: function(styles) {
    var props = {
      href: this.props.baseUrl + '/product/' + this.props.model.product.id + '/item/' + this.props.model.number,
      className: 'js-item-link title-cell',
      'data-item-number': this.props.model.number,
      style: this.state.hover ? Styles.cell.linkHover : Styles.cell.link,
      onMouseOver: this.onTitleLinkHover,
      onMouseOut: this.onTitleLinkOut
    };

    return (
      <div style={_.extend({}, styles, Styles.cell.widest)}>
        <a {...props}>
          {this.props.model.title}
        </a>
      </div>
    );
  },

  buildTagsCell: function(styles, mId) {
    var editorProps = {
      modelId: mId,
      readOnly: !!this.props.model.isNonMatching,
      tags: this.props.model.tags,
      tagChanger: this.props.modelChangerUtilities.tagChanger
    };

    var tagsProps = {
      tags: this.props.model.tags,
      condensed: this.props.expanded === "condensed" ? true : false,
      navigatorUtility: this.props.navigatorUtility
    };

    return (
      <div style={_.extend({}, styles, Styles.cell.wider)}>
        <TagEditor {...editorProps} />
        <Tags {...tagsProps} />
      </div>
    );
  },

  buildCreatedAtCell: function(styles) {
    return (
      <div style={_.extend({}, styles, Styles.cell.wide)}>
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

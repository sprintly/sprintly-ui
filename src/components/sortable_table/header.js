import React from 'react/addons';
import _ from 'lodash';
import Expander from '../expander';
import Styles from '../../styles/sortable_table';

/*
 * Renders header bar where cells are clickable elements that trigger a
 * sort on that column. Also responsible for proxying Expander events.
 * Property 'tableType' describes the data described by the table: ie,
 * might be 'backlog', if the table shows just backlog items. This property
 * is passed back through the label click callback so that you may take
 * action on that table's data alone (if rendering multiple tables in a view.)
 */


var TableHeader = React.createClass({

  propTypes: {
    tableType: React.PropTypes.string,
    columns: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    expanded: React.PropTypes.string,
    isBulkEditable: React.PropTypes.bool,
    onExpanderClick: React.PropTypes.func,
    onLabelClick: React.PropTypes.func.isRequired
  },

  mixins: [Styles],

  getDefaultProps: function() {
    return {
      expanded: 'condensed'
    };
  },

  getInitialState: function() {
    /*
     * Keeps track of sort direction on each column.
     */
    var directionHash = _.zipObject(this.props.columns,
      _.times(this.props.columns.length, function() { return 'ascending'; }));

    return {
      directionHash: directionHash
    };
  },

  onLabelClick: function(ev) {
    /*
     * Grabs table type and sort option and passes to sort callback.
     * Flips direction in direction hash.
     */
    var column = ev.target.textContent.toLowerCase();
    var direction = this.state.directionHash[column] === 'ascending' ? 'descending' : 'ascending';
    var hashCopy = _.cloneDeep(this.state.directionHash);

    this.props.onLabelClick(this.props.tableType, column, direction);
    hashCopy[column] = direction;

    this.setState({
      directionHash: hashCopy
    });
  },

  render: function() {
    /*
     * Render column labels and optionally render an expander element that proxies click events
     * to table (Note: we'll only render this if we have a control column to render it into).
     */
    var hasProductColumn = _.contains(this.props.columns, 'product');

    var control = this.props.isBulkEditable ?
      (
        <th key="control" className="control" style={Styles.head.label}></th>
      ) : null;

    var expander = null;
    var expander = hasProductColumn ?
      (
        <th key="expander" style={Styles.head.label}>
          <Expander
            expanded={this.props.expanded}
            onClick={this.props.onExpanderClick}
          />
        </th>
      ) : null;

    return (
      <tr style={Styles.head.row}>
        {control}
        {expander}
        {this.buildColumnLabels()}
      </tr>
    );
  },

  buildColumnLabels: function() {
    // We don't want to render a label for the 'Control' column, so pop it off the list.
    var columns = _.without(this.props.columns, 'product');

    return _.map(columns, function(column) {
      return (
        <th key={column} title="click to sort" style={Styles.head.label}>
          <button className={column.replace(' ', '-')} style={Styles.head.button} key={column}
            onClick={this.onLabelClick}>
            {column}
          </button>
        </th>
      );
    }, this);
  }
});

export default TableHeader;
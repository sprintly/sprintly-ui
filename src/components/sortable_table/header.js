var React = window.React || require('react/addons');
var _ = require('lodash');
var Expander = require('../expander');

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
    onLabelClick: React.PropTypes.func
  },

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
        <th key='control' className='sortable__label control'></th>
      ) : null;

    var expander = null;
    var expander = hasProductColumn ?
      (
        <th key='expander' className='sortable__label'>
          <Expander
            expanded={this.props.expanded}
            onClick={this.props.onExpanderClick}
          />
        </th>
      ) : null;

    return (
      <tr className='sortable__row'>
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
        <th key={column} title='click to sort' className='sortable__label'>
          <button className={'sortable__button ' + column.replace(' ', '-')} key={column}
            onClick={this.onLabelClick}>
            {column}
          </button>
        </th>
      );
    }, this);
  }
});

module.exports = TableHeader;
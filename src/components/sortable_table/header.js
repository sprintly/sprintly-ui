import React from 'react';
import assign from 'object-assign';
import Expander from '../expander';

/*
 * Renders header bar where cells are clickable elements that trigger a
 * sort on that column. Also responsible for proxying Expander events.
 * Property 'tableType' describes the data described by the table: ie,
 * might be 'backlog', if the table shows just backlog items. This property
 * is passed back through the label click callback so that you may take
 * action on that table's data alone (if rendering multiple tables in a view.)
 */

const TableHeader = React.createClass({

  propTypes: {
    tableType: React.PropTypes.string,
    columns: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    expanded: React.PropTypes.bool,
    isBulkEditable: React.PropTypes.bool,
    onExpanderClick: React.PropTypes.func,
    onLabelClick: React.PropTypes.func
  },

  /*
   * Keeps track of sort direction on each column.
   */
  getInitialState() {
    let directionHash = {};
    this.props.columns.forEach((column) => {
      directionHash[column] = 'ascending';
    });

    return {
      directionHash
    };
  },

  /*
   * Grabs table type and sort option and passes to sort callback.
   * Flips direction in direction hash.
   */
  onLabelClick(columnName, event) {
    let direction = this.state.directionHash[columnName] === 'ascending' ? 'descending' : 'ascending';
    let updatedHash = assign({}, this.state.directionHash, {
      [columnName]: direction
    });

    this.props.onLabelClick(this.props.tableType, columnName, direction);
    this.setState({
      directionHash: updatedHash
    });
  },

  /*
   * Render column labels and optionally render an expander element that proxies click events
   * to table (Note: we'll only render this if we have a control column to render it into).
   */
  render() {
    let props = this.props;
    let control = props.isBulkEditable ?
        <th key='control' className='sortable__label control' /> : '';

    let expander = props.columns.indexOf('product') >= 0 ?
      (
        <th key='expander' className='sortable__label'>
          <Expander
            expanded={props.expanded}
            onExpanderClick={props.onExpanderClick}
          />
        </th>
      ) : '';

    let labels = props.columns.map((column) => {
      // We don't want to render a label for the control column (ie, 'products')
      return column !== 'product' ? (
        <th key={column} title='click to sort' className='sortable__label'>
          <button
            className={'sortable__button ' + column.replace(' ', '-')}
            key={column}
            onClick={() => { return this.onLabelClick(column.toLowerCase()); }}>
            {column}
          </button>
        </th>
      ) : '';
    });

    return (
      <tr className='sortable__row'>
        {control}
        {expander}
        {labels}
      </tr>
    );
  }
});

export default TableHeader;

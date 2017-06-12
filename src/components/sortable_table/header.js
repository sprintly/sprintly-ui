import React from 'react';
import PropTypes from 'prop-types';
import Expander from '../expander';
import createReactClass from 'create-react-class';

const _ = {
  zipObject: require('lodash/zipObject'),
  times: require('lodash/times'),
  cloneDeep: require('lodash/cloneDeep'),
  includes: require('lodash/includes'),
  without: require('lodash/without'),
  map: require('lodash/map'),
  bind: require('lodash/bind'),
  partial: require('lodash/partial')
};

/*
 * Renders header bar where cells are clickable elements that trigger a
 * sort on that column. Also responsible for proxying Expander events.
 * Property 'tableType' describes the data described by the table: ie,
 * might be 'backlog', if the table shows just backlog items. This property
 * is passed back through the label click callback so that you may take
 * action on that table's data alone (if rendering multiple tables in a view.)
 */

const TableHeader = createReactClass({

  propTypes: {
    tableType: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    expanded: PropTypes.bool,
    isBulkEditable: PropTypes.bool,
    onExpanderClick: PropTypes.func,
    onLabelClick: PropTypes.func
  },

  getInitialState: function() {
    /*
     * Keeps track of sort direction on each column.
     */
    const directionHash = _.zipObject(this.props.columns,
      _.times(this.props.columns.length, function() { return 'ascending'; }));

    return {
      directionHash: directionHash
    };
  },

  onLabelClick: function(columnName, ev) {
    /*
     * Grabs table type and sort option and passes to sort callback.
     * Flips direction in direction hash.
     */
    const direction = this.state.directionHash[columnName] === 'ascending' ? 'descending' : 'ascending';
    let hashCopy = _.cloneDeep(this.state.directionHash);

    this.props.onLabelClick(this.props.tableType, columnName, direction);
    hashCopy[columnName] = direction;

    this.setState({
      directionHash: hashCopy
    });
  },

  render: function() {
    /*
     * Render column labels and optionally render an expander element that proxies click events
     * to table (Note: we'll only render this if we have a control column to render it into).
     */
    const hasProductColumn = _.includes(this.props.columns, 'product');

    const control = this.props.isBulkEditable ?
        <th key='control' className='sortable__label control' /> : null;

    const expander = hasProductColumn ?
      (
        <th key='expander' className='sortable__label'>
          <Expander
            expanded={this.props.expanded}
            onExpanderClick={this.props.onExpanderClick}
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
    const columns = _.without(this.props.columns, 'product');

    return _.map(columns, _.bind(function(column) {
      return (
        <th key={column} title='click to sort' className='sortable__label'>
          <button className={'sortable__button ' + column.replace(' ', '-')} key={column}
            onClick={_.partial(this.onLabelClick, column.toLowerCase())}>
            {column}
          </button>
        </th>
      );
    }, this));
  }
});

export default TableHeader;

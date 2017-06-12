import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './header';
import TableRow from './row';
import createReactClass from 'create-react-class';

const _ = {
  noop: require('lodash/noop'),
  each: require('lodash/each'),
  bind: require('lodash/bind')
};

/*
 * Takes an array of json objects (for example, a Backbone.Collection.toJSON())
 * and an array of attributes to serve as column header labels and creates a sortable table from the data.
 * Column header labels are clickable and will call an external sort method, passing
 * 'ascending' or 'descending' based on which option is currently active.
 *
 * Responsible for managing the expanded/condensed state of rows and for proxying sort
 * events up to parent view for processing.
 */


const SortableTable = createReactClass({

  propTypes: {
    tableType: PropTypes.string,
    label: PropTypes.string,
    collection: PropTypes.arrayOf(PropTypes.object).isRequired,
    columnNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    baseUrl: PropTypes.string,
    onSortCollection: PropTypes.func,
    isBulkEditable: PropTypes.bool,
    onBulkSelect: PropTypes.func,
    modelChangerUtilities: PropTypes.object,
    navigatorUtility: PropTypes.object
  },

  getDefaultProps: function() {
    return {
      baseUrl: '',
      isBulkEditable: false,
      onBulkSelect: _.noop(),
      modelChangerUtilities: {}
    };
  },

  getInitialState: function() {
    return {
      expanded: false,
      sortBy: 'number'
    };
  },

  onExpandClicked: function(expanded) {
    if (expanded !== this.state.expanded) {
      this.setState({
        expanded: expanded
      });
    }
  },

  render: function() {
    let rows = [];

    _.each(this.props.collection, _.bind(function(model) {
      const modelId = [model.product.id, model.number];
      const rowProps = {
        key: modelId,
        model: model,
        columns: this.props.columnNames,
        expanded: this.state.expanded,
        baseUrl: this.props.baseUrl,
        modelChangerUtilities: this.props.modelChangerUtilities,
        navigatorUtility: this.props.navigatorUtility,
        isBulkEditable: this.props.isBulkEditable,
        onBulkSelect: this.props.onBulkSelect
      };

      if (model.isMatched && !model.parent) {
        // Add a spacer row above matched parents.
        rows.push(
          <tr key={modelId + ':spacer'} className='sortable__row spacer' />
        );
      }
      rows.push(
        <TableRow {...rowProps} />
      );
    }, this));

    const headerProps = {
      tableType: this.props.tableType,
      columns: this.props.columnNames,
      sortedBy: this.state.sortBy,
      expanded: this.state.expanded,
      isBulkEditable: this.props.isBulkEditable,
      onExpanderClick: this.onExpandClicked,
      onLabelClick: this.props.onSortCollection
    };

    return (
      <div className={'sortable__wrapper ' + this.props.label}>
        <h2 className='sortable__title'>{this.props.label}</h2>
        <table className='sortable__table'>
          <thead className='head'>
            <TableHeader {...headerProps} />
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});

export default SortableTable;

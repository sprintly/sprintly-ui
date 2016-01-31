import React from 'react';
import TableHeader from './header';
import TableRow from './row';

/*
 * Takes an array of json objects (for example, a Backbone.Collection.toJSON())
 * and an array of attributes to serve as column header labels and creates a sortable table from the data.
 * Column header labels are clickable and will call an external sort method, passing
 * 'ascending' or 'descending' based on which option is currently active.
 *
 * Responsible for managing the expanded/condensed state of rows and for proxying sort
 * events up to parent view for processing.
 */

const SortableTable = React.createClass({

  propTypes: {
    tableType: React.PropTypes.string,
    label: React.PropTypes.string,
    collection: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    columnNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    baseUrl: React.PropTypes.string,
    onSortCollection: React.PropTypes.func,
    isBulkEditable: React.PropTypes.bool,
    onBulkSelect: React.PropTypes.func,
    modelChangerUtilities: React.PropTypes.object,
    navigatorUtility: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      baseUrl: '',
      isBulkEditable: false,
      onBulkSelect: function() {},
      modelChangerUtilities: {}
    };
  },

  getInitialState() {
    return {
      expanded: false,
      sortBy: 'number'
    };
  },

  onExpandClicked(event, expanded) {
    if (expanded !== this.state.expanded) {
      this.setState({
        expanded: expanded
      });
    }
  },

  render() {
    let props = this.props;
    let rows = [];

    props.collection.forEach((model) => {
      let modelId = [model.product.id, model.number];
      let rowProps = {
        key: modelId,
        model: model,
        columns: props.columnNames,
        expanded: this.state.expanded,
        baseUrl: props.baseUrl,
        modelChangerUtilities: props.modelChangerUtilities,
        navigatorUtility: props.navigatorUtility,
        isBulkEditable: props.isBulkEditable,
        onBulkSelect: props.onBulkSelect
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
    });

    let headerProps = {
      tableType: props.tableType,
      columns: props.columnNames,
      sortedBy: this.state.sortBy,
      expanded: this.state.expanded,
      isBulkEditable: props.isBulkEditable,
      onExpanderClick: this.onExpandClicked,
      onLabelClick: props.onSortCollection
    };

    return (
      <div className={'sortable__wrapper ' + props.label}>
        <h2 className='sortable__title'>{props.label}</h2>
        <table className='sortable__table'>
          <thead className='head'>
            <TableHeader {...headerProps} />
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
});

export default SortableTable;
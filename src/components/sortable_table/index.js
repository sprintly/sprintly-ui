import React from 'react/addons';
import _ from 'lodash';
import TableHeader from './header';
import TableRow from './row';
import Styles from '../../styles/sortable_table';


/*
 * Takes an array of json objects (for example, a Backbone.Collection.toJSON())
 * and an array of attributes to serve as column header labels and creates a sortable table from the data.
 * Column header labels are clickable and will trigger sort either in
 * ascending or descending order based on which option is currently active.
 *
 * Responsible for managing the expanded/condensed state of rows and for proxying sort
 * events up to parent view for processing.
 */


var SortableTable = React.createClass({

  propTypes: {
    tableType: React.PropTypes.string,
    label: React.PropTypes.string,
    collection: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    columnNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onSortCollection: React.PropTypes.func.isRequired,
    isBulkEditable: React.PropTypes.bool,
    onBulkSelect: React.PropTypes.func,
    modelChangerUtilities: React.PropTypes.object,
    navigatorUtility: React.PropTypes.object
  },

  mixins: [Styles],

  getDefaultProps: function() {
    return {
      isBulkEditable: false,
      onBulkSelect: _.noop(),
      modelChangerUtilities: {}
    };
  },

  getInitialState: function() {
    return {
      expanded: 'condensed',
      sortBy: 'number'
    };
  },

  onExpandClicked: function(expandOrCondense) {
    this.setState({
      expanded: expandOrCondense
    });
  },

  render: function() {
    var tableName = this.props.label.charAt(0).toUpperCase() + this.props.label.slice(1);
    var tableClass = "sortable-table " + this.props.label;
    var rows = [];

    _.each(this.props.collection, function(model) {
      var modelId = [model.product.id, model.number];
      var rowProps = {
        key: modelId,
        model: model,
        columns: this.props.columnNames,
        expanded: this.state.expanded,
        modelChangerUtilities: this.props.modelChangerUtilities,
        navigatorUtility: this.props.navigatorUtility,
        isBulkEditable: this.props.isBulkEditable,
        onBulkSelect: this.props.onBulkSelect
      };

      if (model.isMatched && !model.parent) {
        // Add a spacer row above matched parents.
        rows.push(
          <tr key={modelId+':spacer'} className="spacer" style={Styles.row.spacer} />
        );
      }
      rows.push(
        <TableRow {...rowProps} />
      );
    }, this);

    var headerProps = {
      tableType: this.props.tableType,
      columns: this.props.columnNames,
      sortedBy: this.state.sortBy,
      expanded: this.state.expanded,
      isBulkEditable: this.props.isBulkEditable,
      onExpanderClick: this.onExpandClicked,
      onLabelClick: this.props.onSortCollection
    };

    return (
      <div className={tableClass} style={Styles.table.wrapper}>
        <h2 className="sortable-title" style={Styles.table.title}>{tableName}</h2>
        <table style={Styles.table.table}>
          <thead style={Styles.table.thead}>
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
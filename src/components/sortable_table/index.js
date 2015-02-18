var React = window.React || require('react/addons');
var _ = require('lodash');
var TableHeader = require('./header');
var TableRow = require('./row');
var Styles = require('../../styles/sortable_table');


/*
 * Takes an array of json objects (for example, a Backbone.Collection.toJSON())
 * and an array of attributes to serve as column header labels and creates a sortable table from the data.
 * Column header labels are clickable and will call an external sort method, passing
 * 'ascending' or 'descending' based on which option is currently active.
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
    baseUrl: React.PropTypes.string,
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
    var tableClass = "sortable-table " + this.props.label;
    var rows = [];

    _.each(this.props.collection, function(model) {
      var modelId = [model.product.id, model.number];
      var rowProps = {
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
          <tr key={modelId + ':spacer'} className="spacer" style={Styles.row.spacer} />
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
        <h2 className="sortable-title" style={Styles.table.title}>{this.props.label}</h2>
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

module.exports = SortableTable;
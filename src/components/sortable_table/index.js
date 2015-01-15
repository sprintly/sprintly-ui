var React = window.React || require('react/addons');
var _ = require('lodash');
var TableHeader = require('./header');
var TableRow = require('./row');
var SortableStyles = require('../../styles/sortable_table');

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

  mixins: [SortableStyles],

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
      if (model.isMatched && !model.parent) {
        // Add a spacer row above matched parents.
        rows.push(
          <tr key={modelId+':spacer'} className="spacer" style={SortableStyles.row.spacer} />
        );
      }
      rows.push(
        <TableRow
          key={modelId}
          model={model}
          columns={this.props.columnNames}
          expanded={this.state.expanded}
          modelChangerUtilities={this.props.modelChangerUtilities}
          navigatorUtility={this.props.navigatorUtility}
          isBulkEditable={this.props.isBulkEditable}
          onBulkSelect={this.props.onBulkSelect}
        />
      );
    }, this);

    return (
      <div className={tableClass} style={SortableStyles.table.wrapper}>
        <h2 className="sortable-title" style={SortableStyles.table.title}>{tableName}</h2>
        <table style={SortableStyles.table.table}>
          <thead style={SortableStyles.table.thead}>
            <TableHeader
              tableType={this.props.tableType}
              columns={this.props.columnNames}
              sortedBy={this.state.sortBy}
              expanded={this.state.expanded}
              isBulkEditable={this.props.isBulkEditable}
              onExpanderClick={this.onExpandClicked}
              onLabelClick={this.props.onSortCollection}
            />
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
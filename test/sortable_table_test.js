var _ = require('lodash');
var React = window.React || require('react/addons');
var TestUtils = React.addons.TestUtils;
var sinon = require('sinon');

var SortableTable = require('../src/components/sortable_table/index');
var Header = require('../src/components/sortable_table/header');
var Row = require('../src/components/sortable_table/row');
var Expander = require('../src/components/expander');
var Estimator = require('../src/components/estimator');
var Status = require('../src/components/status');
var Tags = require('../src/components/tags');
var TagEditor = require('../src/components/tag_editor');


var genItem = function(num, productNum, userName, parentNum) {
  return {
    number: num,
    product: {id: productNum},
    type: 'defect',
    title: "Test item",
    status: 'backlog',
    score: 's',
    assigned_to: {first_name: userName},
    created_by: {first_name: userName},
    tags: [],
    parent: {number: parentNum}
  };
};

describe('SortableTable', function() {
  describe('rendering', function() {
    beforeEach(function() {
      this.sortable = TestUtils.renderIntoDocument(
        <SortableTable
          tableType="backlog"
          label="backlog"
          collection={[genItem(1,1,'amy',5), genItem(2,2,'bob',5), genItem(5,2,'amy')]}
          columnNames={['product','number','size','title','assigned to','created by','tags','created']}
          onSortCollection={_.noop()}
        />
      );

      this.node = this.sortable.getDOMNode();
    });
    afterEach(function() {
      React.unmountComponentAtNode(this.sortable.getDOMNode().parent);
    });

    it('should render a table header', function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.sortable, Header));
    });

    it('should render a column for each in columnNames array prop', function() {
      // testing against number of <th> and <td>s in a single row.
      var headerCols = TestUtils.scryRenderedDOMComponentsWithTag(this.sortable, 'th');
      var row = TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0];
      var rowCols = TestUtils.scryRenderedDOMComponentsWithTag(row, 'td');

      _.each([this.sortable.props.columnNames, headerCols, rowCols], function(cols) {
        assert.equal(cols.length, 8);
      });
    });

    it('should render a table row for each collection item', function() {
      var collectionLength = this.sortable.props.collection.length;
      var rows = TestUtils.scryRenderedComponentsWithType(this.sortable, Row);
      assert.equal(collectionLength, 3);
      assert.equal(rows.length, collectionLength);
    });

    it('should render an expander element for toggling row height per content', function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.sortable, Expander));
    });

    it('should render condensed rows by default', function() {
      assert.equal(TestUtils.findRenderedComponentWithType(this.sortable, Expander).props.expanded, 'condensed');
      assert.equal(TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0].props.expanded, 'condensed');
    });

    it('should update expander state and render an expanded row on expand button click', function() {
      var expandButton = TestUtils.findRenderedDOMComponentWithClass(this.sortable, 'expanded');
      TestUtils.Simulate.click(expandButton);
      assert.equal(TestUtils.findRenderedComponentWithType(this.sortable, Expander).props.expanded, 'expanded');
      assert.equal(TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0].props.expanded, 'expanded');
    });

    it('should render an item component element for each applicable property in each row', function() {
      // incl. Estimator, Status, Tags, TagEditor item component elements
      var estimators = TestUtils.scryRenderedComponentsWithType(this.sortable, Estimator);
      var tags = TestUtils.scryRenderedComponentsWithType(this.sortable, Tags);
      var tagEditors = TestUtils.scryRenderedComponentsWithType(this.sortable, TagEditor);

      _.each([estimators, tags, tagEditors], function(comps) {
        assert.equal(comps.length, 3);
      });
    });

    it('shouldn\'t render an item component element for any property that there isn\'t a column for', function() {
      var statuses = TestUtils.scryRenderedComponentsWithType(this.sortable, Status);
      assert.equal(statuses.length, 0);
    });

    it('should not be bulk editable by default', function() {
      assert.isFalse(this.sortable.props.isBulkEditable);
    });
  });

  describe('bulk edit mode', function() {
    beforeEach(function() {
      this.stub = sinon.stub();
      this.sortable = TestUtils.renderIntoDocument(
        <SortableTable
          tableType="backlog"
          label="backlog"
          collection={[genItem(1,1,'amy',5)]}
          columnNames={['product','number','title','assigned to', 'created by']}
          onSortCollection={_.noop()}
          isBulkEditable={true}
          onBulkSelect={this.stub}
        />
      );
    });
    afterEach(function() {
      React.unmountComponentAtNode(this.sortable.getDOMNode().parent);
    });

    it('should enable bulk edit mode on children if isBulkEditable prop set to true', function() {
      var header = TestUtils.findRenderedComponentWithType(this.sortable, Header);
      var row = TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0];
      assert.isTrue(header.props.isBulkEditable);
      assert.isTrue(row.props.isBulkEditable);
    });

    it('should add a "control" column as first member of columns array', function() {
      var columnsLength = this.sortable.props.columnNames.length;
      var columns = TestUtils.scryRenderedDOMComponentsWithTag(this.sortable, 'th');

      assert.equal(columns.length, columnsLength + 1);
      assert.equal(columns[0].getDOMNode().className, 'control');
    });

    it('should trigger the onBulkSelect callback on edit checkbox select', function() {
      var checkboxInput = TestUtils.findRenderedDOMComponentWithTag(this.sortable, 'input');
      TestUtils.Simulate.click(checkboxInput);
      sinon.assert.calledOnce(this.stub);
    });
  });

  describe('table sorting', function() {
    beforeEach(function() {
      this.stub = sinon.stub();
      this.sortable = TestUtils.renderIntoDocument(
        <SortableTable
          tableType="someday"
          label="someday"
          collection={[genItem(1,1,'amy',5)]}
          columnNames={['product','number','title','assigned to', 'created by']}
          onSortCollection={this.stub}
        />
      );
    });
    afterEach(function() {
      React.unmountComponentAtNode(this.sortable.getDOMNode().parent);
    });

    it('should trigger the onSortCollection callback on column label click', function() {
      var numberLabel = TestUtils.scryRenderedDOMComponentsWithClass(this.sortable, 'number')[0];
      TestUtils.Simulate.click(numberLabel);
      sinon.assert.calledOnce(this.stub);
    });

    it('should pass table type, column type, and direction to callback', function() {
      var createdByLabel = TestUtils.scryRenderedDOMComponentsWithClass(this.sortable, 'created-by')[0];
      TestUtils.Simulate.click(createdByLabel);
      sinon.assert.calledWith(this.stub, 'someday', 'created by', 'descending');
    });

    it('should alternate passing descending and ascending as direction argument', function() {
      var titleLabel = TestUtils.scryRenderedDOMComponentsWithClass(this.sortable, 'title')[0];

      TestUtils.Simulate.click(titleLabel);
      sinon.assert.calledWith(this.stub, 'someday', 'title', 'descending');
      TestUtils.Simulate.click(titleLabel);
      sinon.assert.calledWith(this.stub, 'someday', 'title', 'ascending');
    });
  });
});
var _ = require('lodash');
var mount = require('enzyme').mount;
var React = window.React || require('react');
var ReactDOM = require('react-dom');
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
    product: {id: productNum, name: 'foo'},
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
      this.items = [
        genItem(1,1,'amy',5),
        genItem(2,2,'bob',5),
        genItem(5,2,'amy')
      ];
      this.sortable = mount(
        <SortableTable
          tableType="backlog"
          label="backlog"
          collection={this.items}
          columnNames={['product','number','size','title','assigned to','created by','tags','created']}
          onSortCollection={_.noop()}
        />
      );
    });

    it('should render a table header', function() {
      assert.isOk(this.sortable.find(Header).exists());
    });

    it('should render a column for each in columnNames array prop', function() {
      // testing against number of <th> and <td>s in a single row.
      var headerCols = this.sortable.find('th');
      var rowCols = this.sortable.find(Row).first().find('td');

      _.each([this.sortable.prop('columnNames'), headerCols, rowCols], function(cols) {
        assert.equal(cols.length, 8);
      });
    });

    it('should render the product name as a permalink', function() {
      var anchors = this.sortable.find(Row).first().find('td').find('a')
      var item = this.items[0];
      var node = anchors.first();

      assert.equal(node.text(), item.product.name);
      assert.include(node.getDOMNode().href, item.product.id);
    });

    it('should render the item number be a permalink', function() {
      var anchors = this.sortable.find(Row).find('td').find('a');
      var item = this.items[0];
      var node = anchors.get(1);

      assert.equal(node.text, '#' + item.number);
      assert.include(node.href, item.product.id + '/item/' + item.number);
    });

    it('should render a table row for each collection item', function() {
      var collectionLength = this.sortable.prop('collection').length;
      var rows = this.sortable.find(Row);
      assert.equal(collectionLength, 3);
      assert.equal(rows.length, collectionLength);
    });

    it('should render an expander element for toggling row height per content', function() {
      assert.ok(this.sortable.find(Expander).exists());
    });

    it('should render condensed rows by default', function() {
      assert.isFalse(this.sortable.find(Expander).first().prop('expanded'));
      assert.isFalse(this.sortable.find(Row).first().prop('expanded'));
    });

    it('should update expander state and render an expanded row on expand button click', function() {
      var expandButton = this.sortable.find('.expander__button.expand');
      expandButton.simulate('click');
      assert.isTrue(this.sortable.find(Expander).first().prop('expanded'));
      assert.isTrue(this.sortable.find(Row).first().prop('expanded'));
    });

    it('should render an item component element for each applicable property in each row', function() {
      // incl. Estimator, Status, Tags, TagEditor item component elements
      var estimators = this.sortable.find(Estimator);
      var tags = this.sortable.find(Tags);
      var tagEditors = this.sortable.find(TagEditor);

      _.each([estimators, tags, tagEditors], function(comps) {
        assert.equal(comps.length, 3);
      });
    });

    it("shouldn't render an item component element for any property that there isn't a column for", function() {
      assert.equal(this.sortable.find(Status).length, 0);
    });

    it('should not be bulk editable by default', function() {
      assert.isFalse(this.sortable.prop('isBulkEditable'));
    });
  });

  describe('bulk edit mode', function() {
    beforeEach(function() {
      this.stub = sinon.stub();
      this.sortable = mount(
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

    it('should enable bulk edit mode on children if isBulkEditable prop set to true', function() {
      var header = this.sortable.find(Header).first();
      var row = this.sortable.find(Row).first();
      assert.isTrue(header.prop('isBulkEditable'));
      assert.isTrue(row.prop('isBulkEditable'));
    });

    it('should add a "control" column as first member of columns array', function() {
      var columnsLength = this.sortable.first().prop('columnNames').length;
      var columns = this.sortable.find('th');

      assert.equal(columns.length, columnsLength + 1);
      assert.isTrue(columns.first().hasClass('sortable__label'));
      assert.isTrue(columns.first().hasClass('control'));
    });

    it('should trigger the onBulkSelect callback on edit checkbox select', function() {
      var checkboxInput = this.sortable.find('input').first();
      checkboxInput.simulate('click');
      sinon.assert.calledOnce(this.stub);
    });
  });

  describe('table sorting', function() {
    beforeEach(function() {
      this.stub = sinon.stub();
      this.sortable = mount(
        <SortableTable
          tableType="someday"
          label="someday"
          collection={[genItem(1,1,'amy',5)]}
          columnNames={['product','number','title','assigned to', 'created by']}
          onSortCollection={this.stub}
        />
      );
    });

    it('should trigger the onSortCollection callback on column label click', function() {
      var numberLabel = this.sortable.find('.number').first();
      numberLabel.simulate('click');
      sinon.assert.calledOnce(this.stub);
    });

    it('should pass table type, column type, and direction to callback', function() {
      var createdByLabel = this.sortable.find('.created-by').first();
      createdByLabel.simulate('click');
      sinon.assert.calledWith(this.stub, 'someday', 'created by', 'descending');
    });

    it('should alternate passing descending and ascending as direction argument', function() {
      var titleLabel = this.sortable.find('.title').first();

      titleLabel.simulate('click');
      sinon.assert.calledWith(this.stub, 'someday', 'title', 'descending');

      titleLabel.simulate('click');
      sinon.assert.calledWith(this.stub, 'someday', 'title', 'ascending');
    });
  });
});

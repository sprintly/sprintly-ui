import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import SortableTable from '../src/components/sortable_table/index';
import Header from '../src/components/sortable_table/header';
import Row from '../src/components/sortable_table/row';
import Expander from '../src/components/expander';
import Estimator from '../src/components/estimator';
import Tags from '../src/components/tags';
import TagEditor from '../src/components/tag_editor';


function genItem(num, productNum, userName, parentNum) {
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
}


describe('SortableTable', function() {
  describe('rendering', function() {
    beforeEach(function() {
      this.items = [
        genItem(1,1,'amy',5),
        genItem(2,2,'bob',5),
        genItem(5,2,'amy')
      ];

      this.sortable = TestUtils.renderIntoDocument(
        <SortableTable
          tableType="backlog"
          label="backlog"
          collection={this.items}
          columnNames={['product','number','size','title','assigned to','created by','tags','created']}
          onSortCollection={sinon.stub()}
        />
      );

      this.node = ReactDOM.findDOMNode(this.sortable);
    });

    it('should render a table header', function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.sortable, Header));
    });

    it('should render a column for each in columnNames array prop', function() {
      // testing against number of <th> and <td>s in a single row.
      let headerCols = TestUtils.scryRenderedDOMComponentsWithTag(this.sortable, 'th');
      let row = TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0];
      let rowCols = TestUtils.scryRenderedDOMComponentsWithTag(row, 'td');

      [this.sortable.props.columnNames, headerCols, rowCols].forEach((cols) => {
        assert.equal(cols.length, 8);
      });
    });

    it('should render the product name as a permalink', function() {
      let row = TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0];
      let rowCols = TestUtils.scryRenderedDOMComponentsWithTag(row, 'td');
      let anchors = TestUtils.scryRenderedDOMComponentsWithTag(rowCols[0], 'a');

      let item = this.items[0];
      let node = ReactDOM.findDOMNode(anchors[0]);

      assert.equal(node.text, item.product.name);
      assert.include(node.href, item.product.id);
    });

    it('should render the item number be a permalink', function() {
      let row = TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0];
      let rowCols = TestUtils.scryRenderedDOMComponentsWithTag(row, 'td');
      let anchors = TestUtils.scryRenderedDOMComponentsWithTag(rowCols[1], 'a');

      let item = this.items[0];
      let node = ReactDOM.findDOMNode(anchors[0]);

      assert.equal(node.text, '#' + item.number);
      assert.include(node.href, item.product.id + '/item/' + item.number);
    });

    it('should render a table row for each collection item', function() {
      let collectionLength = this.sortable.props.collection.length;
      let rows = TestUtils.scryRenderedComponentsWithType(this.sortable, Row);
      assert.equal(collectionLength, 3);
      assert.equal(rows.length, collectionLength);
    });

    it('should render an expander element for toggling row height per content', function() {
      assert.ok(TestUtils.findRenderedComponentWithType(this.sortable, Expander));
    });

    it('should render condensed rows by default', function() {
      assert.isFalse(TestUtils.findRenderedComponentWithType(this.sortable, Expander).props.expanded);
      assert.isFalse(TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0].props.expanded);
    });

    it('should update expander state and render an expanded row on expand button click', function() {
      let expandButton = TestUtils.findRenderedDOMComponentWithClass(this.sortable, 'expander__button expand');
      TestUtils.Simulate.click(expandButton);
      assert.isTrue(TestUtils.findRenderedComponentWithType(this.sortable, Expander).props.expanded);
      assert.isTrue(TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0].props.expanded);
    });

    it('should render an item component element for each applicable property in each row', function() {
      // incl. Estimator, Tags, TagEditor item component elements
      let estimators = TestUtils.scryRenderedComponentsWithType(this.sortable, Estimator);
      let tags = TestUtils.scryRenderedComponentsWithType(this.sortable, Tags);
      let tagEditors = TestUtils.scryRenderedComponentsWithType(this.sortable, TagEditor);

      [estimators, tags, tagEditors].forEach((comps) => {
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
          onSortCollection={sinon.stub()}
          isBulkEditable={true}
          onBulkSelect={this.stub}
        />
      );
    });

    it('should enable bulk edit mode on children if isBulkEditable prop set to true', function() {
      let header = TestUtils.findRenderedComponentWithType(this.sortable, Header);
      let row = TestUtils.scryRenderedComponentsWithType(this.sortable, Row)[0];
      assert.isTrue(header.props.isBulkEditable);
      assert.isTrue(row.props.isBulkEditable);
    });

    it('should add a "control" column as first member of columns array', function() {
      let columnsLength = this.sortable.props.columnNames.length;
      let columns = TestUtils.scryRenderedDOMComponentsWithTag(this.sortable, 'th');

      assert.equal(columns.length, columnsLength + 1);
      assert.equal(ReactDOM.findDOMNode(columns[0]).className, 'sortable__label control');
    });

    it('should trigger the onBulkSelect callback on edit checkbox select', function() {
      let checkboxInput = TestUtils.findRenderedDOMComponentWithTag(this.sortable, 'input');
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

    it('should trigger the onSortCollection callback on column label click', function() {
      let numberLabel = TestUtils.scryRenderedDOMComponentsWithClass(this.sortable, 'number')[0];
      TestUtils.Simulate.click(numberLabel);
      sinon.assert.calledOnce(this.stub);
    });

    it('should pass table type, column type, and direction to callback', function() {
      let createdByLabel = TestUtils.scryRenderedDOMComponentsWithClass(this.sortable, 'created-by')[0];
      TestUtils.Simulate.click(createdByLabel);
      sinon.assert.calledWith(this.stub, 'someday', 'created by', 'descending');
    });

    it('should alternate passing descending and ascending as direction argument', function() {
      let titleLabel = TestUtils.scryRenderedDOMComponentsWithClass(this.sortable, 'title')[0];

      TestUtils.Simulate.click(titleLabel);
      sinon.assert.calledWith(this.stub, 'someday', 'title', 'descending');
      TestUtils.Simulate.click(titleLabel);
      sinon.assert.calledWith(this.stub, 'someday', 'title', 'ascending');
    });
  });
});

import { mount } from 'enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';

import SortableTable from '../src/components/sortable_table/index';
import Header from '../src/components/sortable_table/header';
import Row from '../src/components/sortable_table/row';
import Expander from '../src/components/expander';
import Estimator from '../src/components/estimator';
import Status from '../src/components/status';
import Tags from '../src/components/tags';
import TagEditor from '../src/components/tag_editor';

const _ = {
  each: require('lodash/each'),
  noop: require('lodash/noop')
};
  

const genItem = (num, productNum, userName, parentNum) => {
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

describe('SortableTable', () => {
  describe('rendering', () => {
    let sortable = null;
    let items = null;

    beforeEach(() => {
      items = [
        genItem(1,1,'amy',5),
        genItem(2,2,'bob',5),
        genItem(5,2,'amy')
      ];

      sortable = mount(
        <SortableTable
          tableType="backlog"
          label="backlog"
          collection={items}
          columnNames={['product','number','size','title','assigned to','created by','tags','created']}
          onSortCollection={_.noop()}
        />
      );
    });

    it('should render a table header', () => {
      assert.isOk(sortable.find(Header).exists());
    });

    it('should render a column for each in columnNames array prop', () => {
      // testing against number of <th> and <td>s in a single row.
      var headerCols = sortable.find('th');
      var rowCols = sortable.find(Row).first().find('td');

      _.each([sortable.prop('columnNames'), headerCols, rowCols], (cols) => {
        assert.equal(cols.length, 8);
      });
    });

    it('should render the product name as a permalink', () => {
      var anchors = sortable.find(Row).first().find('td').find('a')
      var item = items[0];
      var node = anchors.first();

      assert.equal(node.text(), item.product.name);
      assert.include(node.getDOMNode().href, item.product.id);
    });

    it('should render the item number be a permalink', () => {
      var anchors = sortable.find(Row).find('td').find('a');
      var item = items[0];
      var node = anchors.get(1);

      assert.equal(node.text, '#' + item.number);
      assert.include(node.href, item.product.id + '/item/' + item.number);
    });

    it('should render a table row for each collection item', () => {
      var collectionLength = sortable.prop('collection').length;
      var rows = sortable.find(Row);
      assert.equal(collectionLength, 3);
      assert.equal(rows.length, collectionLength);
    });

    it('should render an expander element for toggling row height per content', () => {
      assert.ok(sortable.find(Expander).exists());
    });

    it('should render condensed rows by default', () => {
      assert.isFalse(sortable.find(Expander).first().prop('expanded'));
      assert.isFalse(sortable.find(Row).first().prop('expanded'));
    });

    it('should update expander state and render an expanded row on expand button click', () => {
      const expandButton = sortable.find('.expander__button.expand');
      expandButton.simulate('click');
      assert.isTrue(sortable.find(Expander).first().prop('expanded'));
      assert.isTrue(sortable.find(Row).first().prop('expanded'));
    });

    it('should render an item component element for each applicable property in each row', () => {
      // incl. Estimator, Status, Tags, TagEditor item component elements
      var estimators = sortable.find(Estimator);
      var tags = sortable.find(Tags);
      var tagEditors = sortable.find(TagEditor);

      _.each([estimators, tags, tagEditors], (comps) => {
        assert.equal(comps.length, 3);
      });
    });

    it("shouldn't render an item component element for any property that there isn't a column for", () => {
      assert.equal(sortable.find(Status).length, 0);
    });

    it('should not be bulk editable by default', () => {
      assert.isFalse(sortable.prop('isBulkEditable'));
    });
  });

  describe('bulk edit mode', () => {
    let stub = null;
    let sortable = null;

    beforeEach(() => {
      stub = sinon.stub();
      sortable = mount(
        <SortableTable
          tableType="backlog"
          label="backlog"
          collection={[genItem(1,1,'amy',5)]}
          columnNames={['product','number','title','assigned to', 'created by']}
          onSortCollection={_.noop()}
          isBulkEditable={true}
          onBulkSelect={stub}
        />
      );
    });

    it('should enable bulk edit mode on children if isBulkEditable prop set to true', () => {
      const header = sortable.find(Header).first();
      const row = sortable.find(Row).first();
      assert.isTrue(header.prop('isBulkEditable'));
      assert.isTrue(row.prop('isBulkEditable'));
    });

    it('should add a "control" column as first member of columns array', () => {
      const columnsLength = sortable.first().prop('columnNames').length;
      const columns = sortable.find('th');

      assert.equal(columns.length, columnsLength + 1);
      assert.isTrue(columns.first().hasClass('sortable__label'));
      assert.isTrue(columns.first().hasClass('control'));
    });

    it('should trigger the onBulkSelect callback on edit checkbox select', () => {
      var checkboxInput = sortable.find('input').first();
      checkboxInput.simulate('click');
      sinon.assert.calledOnce(stub);
    });
  });

  describe('table sorting', () => {
    let stub = null;
    let sortable = null;
    beforeEach(() => {
      stub = sinon.stub();
      sortable = mount(
        <SortableTable
          tableType="someday"
          label="someday"
          collection={[genItem(1,1,'amy',5)]}
          columnNames={['product','number','title','assigned to', 'created by']}
          onSortCollection={stub}
        />
      );
    });

    it('should trigger the onSortCollection callback on column label click', () => {
      var numberLabel = sortable.find('.number').first();
      numberLabel.simulate('click');
      sinon.assert.calledOnce(stub);
    });

    it('should pass table type, column type, and direction to callback', () => {
      var createdByLabel = sortable.find('.created-by').first();
      createdByLabel.simulate('click');
      sinon.assert.calledWith(stub, 'someday', 'created by', 'descending');
    });

    it('should alternate passing descending and ascending as direction argument', () => {
      var titleLabel = sortable.find('.title').first();

      titleLabel.simulate('click');
      sinon.assert.calledWith(stub, 'someday', 'title', 'descending');

      titleLabel.simulate('click');
      sinon.assert.calledWith(stub, 'someday', 'title', 'ascending');
    });
  });
});

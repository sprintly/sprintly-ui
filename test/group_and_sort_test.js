import GroupSort from '../src/utils/group_and_sort';
import pluck from 'lodash.pluck';
import assign from 'object-assign';
import sinon from 'sinon';


const productMap = ['sprintly', 'mystery wagon', 'star wars', 'blues clues'];

function genItem(num, product, parent, user, isParent) {
  let z = {
    number: num,
    product: {
      id: product,
      name: productMap[product-1]
    },
    created_by: {
      first_name: user
    }
  };

  if (parent) {
    z.parent = genItem(parent, product);
  } else if (isParent) {
    z.children = ['child']; // fake
  }
  return z;
}


describe("GroupSort", function() {

  describe('preparing items for sort', function() {
    it('should create a hash of parents with their subitems', function() {
      let items = [genItem(2,1,1), genItem(3,1,1, null, true), genItem(3,2,4), genItem(4,2, null, null, true)];
      let result = GroupSort.createParentLookups(items);

      // Note: hash keys are 'productId:parentNumber'
      assert.deepEqual(result.parents, {'2:4':true});
      assert.deepEqual(result.matched, {'1:1':true, '2:4':true});
    });

    it('should pull all subitem parents into top-level of array', function() {
      let items = [genItem(2,1,6), genItem(4,3,8)];
      let lookups = GroupSort.createParentLookups(items);
      let result = pluck(GroupSort.prepareArrayForSort(items, lookups.parents, lookups.matched), 'number');

      assert.isTrue(result.indexOf(6) >= 0);
      assert.isTrue(result.indexOf(8) >= 0);
    });

    it('should not add nonMatching parents from previous', function() {
      let items = [genItem(2,1,6), genItem(6,1)];
      items[1].isNonMatching = true;
      items[1].testing = true;

      let memberParents = {};
      let matchingParents = {'1:6':true};
      let result = GroupSort.prepareArrayForSort(items, memberParents, matchingParents);

      assert.deepEqual(pluck(result, 'number'), [6,2]);
      assert.equal(result.filter((r) => {return r.testing}).length, 0);
    });
  });

  describe('sorting', function() {
    it("should return top-level items in descending order by number by default", function() {
      let items = [genItem(2,1), genItem(1,2)];
      let actual = GroupSort.groupSort(items);
      assert.deepEqual(pluck(actual, 'number'), [2,1]);
    });

    it("should pull the parent of the subitem and add to array if the parent is not already member", function() {
      let items = [genItem(4,1), genItem(2,1), genItem(3,1,1)];
      let actual = GroupSort.groupSort(items);
      assert.equal(items.length, 3);
      assert.equal(actual.length, 4);
    });

    it("should use the parents' sort order as the basis for sort", function() {
      let items = [genItem(4,1), genItem(2,1), genItem(3,1,1)];
      let actual = GroupSort.groupSort(items); // default is descending by number
      assert.deepEqual(pluck(actual, 'number'), [4, 2, 1, 3]);
    });

    it("should handle change in sort direction appropriately", function() {
      let items = [genItem(3,2), genItem(1,2), genItem(1,1), genItem(2,1)];
      let actual = GroupSort.groupSort(items, 'number', 'ascending');
      assert.deepEqual(pluck(actual, 'number'), [1, 1, 2, 3]);
    });

    it('should sort by properties other than default "number"', function () {
      let items = [genItem(1,1), genItem(2,2), genItem(1,4), genItem(4,1)];
      let actual = GroupSort.groupSort(items, 'product', 'ascending');
      let expected = ['blues clues', 'mystery wagon', 'sprintly', 'sprintly'];

      actual.forEach((obj, idx) => {
        assert.equal(obj.product.name, expected[idx]);
      });
    });

    it('should handle sort on properties that are nested models', function() {
      let items = [genItem(1,1,null,'jennifer'), genItem(2,1,null,'amy'), genItem(3,2,null,'bill')];
      let actual = GroupSort.groupSort(items, 'created by', 'descending');
      let expected = ['jennifer', 'bill', 'amy'];

      actual.forEach((obj, idx) => {
        assert.equal(obj.created_by.first_name, expected[idx]);
      });
    });

    it('should sort children after parent if ascending', function() {
      let items = [genItem(5,1,1), genItem(3,1,2), genItem(4,1,1)];
      let actual = GroupSort.groupSort(items, 'number', 'ascending');
      let expected = [1,4,5,2,3];

      assert.deepEqual(pluck(actual, 'number'), expected);
    });

    it('should also sort children after parent if decending', function() {
      let items = [genItem(5,1,11), genItem(6,1,11), genItem(8,1,11)];
      let actual = GroupSort.groupSort(items, 'number', 'descending');
      let expected = [11,5,6,8];

      assert.deepEqual(pluck(actual, 'number'), expected);
    });

    it('should respect product number when sorting and grouping subitems w/their parents', function() {
      let items = [genItem(1,15,5), genItem(1,14,5), genItem(2,15,5), genItem(2,14,5)];
      let actual = GroupSort.groupSort(items, 'number', 'ascending');
      let expected = [14,14,14,15,15,15]; // one each for parent and subitem

      actual.forEach((obj, idx) => {
        assert.equal(obj.product.id, expected[idx]);
      });
    });

    it('should order by number (ascending) within parent-sorted sets', function() {
      let items = [genItem(1,15,5), genItem(1,14,5), genItem(3,14,5), genItem(2,15,5)];
      let actual = GroupSort.groupSort(items, 'number', 'descending');
      let expected = [[5,15], [1,15], [2,15], [5,14], [1,14], [3,14]]; // one each for parent and subitem

      actual.forEach((obj, idx) => {
        assert.deepEqual([obj.number,obj.product.id], [expected[idx][0], expected[idx][1]]);
      });
    });
  });
});
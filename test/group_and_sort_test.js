var GroupSort = require('../src/utils/group_and_sort');
var sinon = require('sinon');

var productMap = ['sprintly', 'mystery wagon', 'star wars', 'blues clues'];

var genItem = function (num, product, parent, user, isParent) {
  var z = {
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
      var items = [genItem(2,1,1), genItem(3,1,1, null, true), genItem(3,2,4), genItem(4,2, null, null, true)];
      var result = GroupSort.createParentLookups(items);

      // Note: hash keys are 'productId:parentNumber'
      assert.deepEqual(result.parents, {'2:4':true});
      assert.deepEqual(result.matched, {'1:1':true, '2:4':true});
    });

    it('should pull all subitem parents into top-level of array', function() {
      var items = [genItem(2,1,6), genItem(4,3,8)];
      var lookups = GroupSort.createParentLookups(items);
      var result = _.pluck(GroupSort.prepareArrayForSort(items, lookups.parents, lookups.matched), 'number');

      assert.isTrue(_.contains(result, 6));
      assert.isTrue(_.contains(result, 8));
    });

    it('should not add nonMatching parents from previous', function() {
      var items = [genItem(2,1,6), genItem(6,1)];
      items[1].isNonMatching = true;
      items[1].testing = true;

      var memberParents = {};
      var matchingParents = {'1:6':true};
      var result = GroupSort.prepareArrayForSort(items, memberParents, matchingParents);

      assert.deepEqual(_.pluck(result, 'number'), [6,2]);
      assert.isTrue(_.compact(_.pluck(result, 'testing')).length === 0);
    });

    it('should convert passed-in properties to the correct item property lookup', function() {
      var actual = [];
      var stub = sinon.stub(GroupSort, 'sort', function(arr, prop, dir) {
        actual.push(prop);
        return;
      });
      var items = [genItem(1,2)];
      var expected = ['product.name', 'assigned_to.first_name',
        'assigned_to.first_name', 'created_by.first_name', 'created_by.first_name',
        'created_at', 'created_at'];

      GroupSort.groupSort(items, 'product', 'ascending');
      GroupSort.groupSort(items, 'assigned to', 'ascending');
      GroupSort.groupSort(items, 'assigned_to', 'ascending');
      GroupSort.groupSort(items, 'created by', 'ascending');
      GroupSort.groupSort(items, 'created_by', 'ascending');
      GroupSort.groupSort(items, 'created', 'ascending');
      GroupSort.groupSort(items, 'created_at', 'ascending');


      assert.deepEqual(actual, expected);
      stub.restore();
    });
  });

  describe('sorting', function() {

    it("should return top-level items in descending order by number by default", function() {
      var items = [genItem(2,1), genItem(1,2)];
      var actual = GroupSort.groupSort(items);
      assert.deepEqual(_.pluck(actual, 'number'), [2,1]);
    });

    it("should pull the parent of the subitem and add to array if the parent is not already member", function() {
      var items = [genItem(4,1), genItem(2,1), genItem(3,1,1)];
      var actual = GroupSort.groupSort(items);
      assert.equal(items.length, 3);
      assert.equal(actual.length, 4);
    });

    it("should use the parents' sort order as the basis for sort", function() {
      var items = [genItem(4,1), genItem(2,1), genItem(3,1,1)];
      var actual = GroupSort.groupSort(items); // default is descending by number
      assert.deepEqual(_.pluck(actual, 'number'), [4, 2, 1, 3]);
    });

    it("should handle change in sort direction appropriately", function() {
      var items = [genItem(3,2), genItem(1,2), genItem(1,1), genItem(2,1)];
      var actual = GroupSort.groupSort(items, 'number', 'ascending');
      assert.deepEqual(_.pluck(actual, 'number'), [1, 1, 2, 3]);
    });

    it('should sort by properties other than default "number"', function () {
      var items = [genItem(1,1), genItem(2,2), genItem(1,4), genItem(4,1)];
      var actual = GroupSort.groupSort(items, 'product', 'ascending');
      var expected = ['blues clues', 'mystery wagon', 'sprintly', 'sprintly'];

      _.each(actual, function (obj, i) {
        assert.equal(obj.product.name, expected[i]);
      });
    });

    it('should handle sort on properties that are nested models', function() {
      var items = [genItem(1,1,null,'jennifer'), genItem(2,1,null,'amy'), genItem(3,2,null,'bill')];
      var actual = GroupSort.groupSort(items, 'created by', 'descending');
      var expected = ['jennifer', 'bill', 'amy'];
      _.each(actual, function(obj, i) {
        assert.equal(obj.created_by.first_name, expected[i]);
      });
    });

    it('should sort children after parent if ascending', function() {
      var items = [genItem(5,1,1), genItem(3,1,2), genItem(4,1,1)];
      var actual = GroupSort.groupSort(items, 'number', 'ascending');
      var expected = [1,4,5,2,3];

      assert.deepEqual(_.pluck(actual, 'number'), expected);
    });

    it('should also sort children after parent if decending', function() {
      var items = [genItem(5,1,11), genItem(6,1,11), genItem(8,1,11)];
      var actual = GroupSort.groupSort(items, 'number', 'descending');
      var expected = [11,5,6,8];

      assert.deepEqual(_.pluck(actual, 'number'), expected);
    });

    it('should respect product number when sorting and grouping subitems w/their parents', function() {
      var items = [genItem(1,15,5), genItem(1,14,5), genItem(2,15,5), genItem(2,14,5)];
      var actual = GroupSort.groupSort(items, 'number', 'ascending');
      var expected = [14,14,14,15,15,15]; // one each for parent and subitem

      _.each(actual, function(obj, i) {
        assert.equal(obj.product.id, expected[i]);
      });
    });

    it('should order by number (ascending) within parent-sorted sets', function() {
      var items = [genItem(1,15,5), genItem(1,14,5), genItem(3,14,5), genItem(2,15,5)];
      var actual = GroupSort.groupSort(items, 'number', 'descending');
      var expected = [[5,15], [1,15], [2,15], [5,14], [1,14], [3,14]]; // one each for parent and subitem

      _.each(actual, function(obj, i) {
        assert.deepEqual([obj.number,obj.product.id], [expected[i][0], expected[i][1]]);
      });
    });
  });
});
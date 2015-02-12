import _ from 'lodash';
import lookup from 'object-path';

/*
 * Takes a array of items json data (such as a sprintly-data or sprintly-search-backed
 * Items collection.toJSON()) and sorts those items, weighting unmatched (top-level)
 * items and parent items against subitems, which are sorted based on parent and
 * grouped under that parent. If the parent is not a member of the passed in jsonArray,
 * the nested parent is exposed and added as a member of the array.
 *
 * It's possible to differentiate between matching and non-matching (added) member
 * parents b/c matching parents will come in with a nested "children" property.
 */

var propertyConversion = {
  /*
   * Normalizes property names, handling plain english as well as underscored names,
   * and converts for deep property lookups on nested models.
   */
  'product': 'product.name',
  'number': 'number',
  'size': 'score',
  'assigned to': 'assigned_to.first_name',
  'assigned_to': 'assigned_to.first_name',
  'title': 'title',
  'tags': 'tags',
  'created by': 'created_by.first_name',
  'created_by': 'created_by.first_name',
  'created': 'created_at',
  'created_at': 'created_at'
};

var scoreConversion = {
  /*
   * Normalizes score strings to numerical values for sort comparison
   */
  '~' : 0,
  's' : 1,
  'm' : 3,
  'l' : 5,
  'xl': 8
};

var GroupSort = {};

GroupSort.groupSort = function(jsonArray, property, direction) {
  /*
   * Generally the method you want to call from external views.
   */
  property = propertyConversion[property] || 'number';
  direction = direction || 'descending';

  var lookups = GroupSort.createParentLookups(jsonArray);
  var parents = lookups.parents;
  var matched = lookups.matched;

  var preparedItems = GroupSort.prepareArrayForSort(jsonArray, parents, matched);

  return direction === 'ascending' ?
    this.sort(preparedItems, property) :
    this.reverseSort(this.sort(preparedItems, property));
};


GroupSort.createParentLookups = function(arr) {
  /*
   * Makes a hash of unique parent ids ("productId:parentNumber") for each:
   * first, all the array's subitems' parents - whether the parent is a member of
   * the array or not; second, the parents that are members of the array.
   * We need this for inclusion checking below, and are making hashes for
   * inexpensive lookups.
   */
  var parents = {};
  var matched = {};

  _.each(arr, function(item) {
    var parentId;
    if (item.parent) {
      parentId = item.product.id + ':' + item.parent.number;
      matched[parentId] = true;
    } else if (item.children) {
      parentId = item.product.id + ':' + item.number;
      parents[parentId] = true;
    }
  });

  return {parents: parents, matched: matched};
};


GroupSort.prepareArrayForSort = function(arr, memberParents, matchingParents) {
  /*
   * Preprocesses items, adding any parents that aren't members to the array.
   * Also adds convenience attributes for styling.
   * Uses matchingParents to keep track of parent-subitem relationships.
   * Uses nonMatching to keep track of parents that may have been
   * added to the array already via other subitems.
   */
  var preprocessed = [];
  var nonMatching = {};

  _.each(arr, function(item) {
    var parentId = item.parent ? item.product.id + ':' + item.parent.number : null;

    // Check if item is parent of subitems in our array.
    if (item.children && matchingParents[item.product.id + ':' + item.number]) {
      item.isMatched = true;
    }

    // Check if item is a subitem. If its parent is not yet a member of our array,
    // add the parent. All subitems are matched here if not already.
    if (item.parent) {
      item.isMatched = true;

      if (!memberParents[parentId] && !nonMatching[parentId]) {
        preprocessed.push(_.extend({}, item.parent, {
          isMatched: true,
          isNonMatching: true
        }));
        nonMatching[parentId] = true;
      }
    }

    // Don't push any nonmatching parents in that are hanging around from previous sorts
    if (!item.isNonMatching) {
      preprocessed.push(item);
    }
  });

  return preprocessed;
};


GroupSort.parentPreferred = function (item, prop) {
  return lookup.get(item.parent ? item.parent : item, prop);
};


GroupSort.sort = function(processedJson, property) {
  /*
   * Ensure that subitems are grouped to parent, while respecting product id.
   * True sorts later than false in this array-based sort,
   * so the fourth value causes subitems to show later in the list.
   */

  return _.sortBy(processedJson, function(item) {
    var itemProperty = this.parentPreferred(item, property);

    if (typeof itemProperty === 'string') {
      itemProperty = property === 'score' ?
        scoreConversion[itemProperty.toLowerCase()] : itemProperty.toLowerCase();
    }

    return [
      itemProperty,
      this.parentPreferred(item, 'number'),
      item.product.id,
      !!item.parent,
      item.number
    ];
  }, this);
};


GroupSort.reverseSort = function(sortedArray) {
  /*
   * When reversing, we want to preserve the order of parent followed
   * by children, so we push parents and subitems into a temporary intermediate array
   * while reversing to maintain sorted chunks. The chunks are parent/child groupings.
  */
  var reverseSorted = [];
  var temp = [];

  for (var i = sortedArray.length - 1; i >= 0; i--) {
    // if the current item's value isn't the same as the temp,
    // push the full temp onto the resorted list; otherwise, add it to temp.
    var item = sortedArray[i];

    if (!temp.length) {
      temp = [item];
      continue;
    }

    if (
      (item.parent && temp[0].parent && temp[0].parent.number === item.parent.number)
      || (temp[0].parent && item.number === temp[0].parent.number)
    ) { // add to head of array to maintain original sort order
      temp.unshift(item);
    } else {
      reverseSorted = _.union(reverseSorted, temp);
      temp = [item];
    }
  }
  return temp.length ? _.union(reverseSorted, temp) : reverseSorted;
}

export default GroupSort;
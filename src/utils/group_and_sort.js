import lookup from 'object-path';
import assign from 'object-assign';
import union from 'lodash.union';
import sortBy from 'lodash.sortby';

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

/*
 * Normalizes property names, handling plain english as well as underscored names,
 * and converts for deep property lookups on nested models.
 */
const propertyConversion = {
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

/*
 * Normalizes score strings to numerical values for sort comparison
 */
const scoreConversion = {
  '~' : 0,
  's' : 1,
  'm' : 3,
  'l' : 5,
  'xl': 8
};

/*
 * Generally the method you want to call from external views.
 */
export function groupSort(jsonArray, property, direction) {
  property = propertyConversion[property] || 'number';
  direction = direction || 'descending';

  let lookups = createParentLookups(jsonArray);
  let parents = lookups.parents;
  let matched = lookups.matched;

  let preparedItems = prepareArrayForSort(jsonArray, parents, matched);

  return direction === 'ascending' ?
    sort(preparedItems, property) :
    reverseSort(sort(preparedItems, property));
};


/*
 * Makes a hash of unique parent ids ("productId:parentNumber") for each:
 * first, all the array's subitems' parents - whether the parent is a member of
 * the array or not; second, the parents that are members of the array.
 * We need this for inclusion checking below, and are making hashes for
 * inexpensive lookups.
 */
function createParentLookups(itemsArr) {
  let parents = {};
  let matched = {};

  itemsArr.forEach((item) => {
    let parentId = null;
    if (item.parent) {
      parentId = item.product.id + ':' + item.parent.number;
      matched[parentId] = true;
    } else if (item.children) {
      parentId = item.product.id + ':' + item.number;
      parents[parentId] = true;
    }
  });

  return {
    parents,
    matched
  };
};


  /*
   * Preprocesses items, adding any parents that aren't members to the array.
   * Also adds convenience attributes for styling.
   * Uses matchingParents to keep track of parent-subitem relationships.
   * Uses nonMatching to keep track of parents that may have been
   * added to the array already via other subitems.
   */
function prepareArrayForSort(itemsArr, memberParents, matchingParents) {
  let preprocessed = [];
  let nonMatching = {};

  itemsArr.forEach((item) => {
    let parentId = item.parent ? item.product.id + ':' + item.parent.number : null;

    // Is this a parent of any of the subitems in our array?
    if (item.children && matchingParents[item.product.id + ':' + item.number]) {
      item.isMatched = true;
    }

    // Is this item a subitem? If so, and its parent is not a member of our array,
    // add the parent. All subitems are matched to their parents here if not already.
    if (item.parent) {
      item.isMatched = true;

      if (!memberParents[parentId] && !nonMatching[parentId]) {
        preprocessed.push(assign({}, item.parent, {
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

/*
 * Always sort parent items in front of their children
 */
function parentPreferred(item, prop) {
  return lookup.get(item.parent ? item.parent : item, prop);
};


/*
 * Ensure that subitems are grouped to parent, while respecting product id.
 * True sorts later than false in this array-based sort,
 * so the fourth value causes subitems to show later in the list.
 */
function sort(processedJson, property) {
  return sortBy(processedJson, function(item) {
    var itemProperty = parentPreferred(item, property);

    if (typeof itemProperty === 'string') {
      itemProperty = property === 'score' ?
        scoreConversion[itemProperty.toLowerCase()] : itemProperty.toLowerCase();
    }

    return [
      itemProperty,
      parentPreferred(item, 'number'),
      item.product.id,
      !!item.parent,
      item.number
    ];
  }, this);
};


/*
 * When reversing, we want to preserve the order of parent followed
 * by children, so we push parents and subitems into a temporary intermediate array
 * while reversing to maintain sorted chunks. The chunks are parent/child groupings.
*/
function reverseSort(sortedArray) {
  let reverseSorted = [];
  let temp = [];

  for (var i = sortedArray.length - 1; i >= 0; i--) {
    // if the current item's value isn't the same as the temp,
    // push the full temp onto the resorted list; otherwise, add it to temp.
    let item = sortedArray[i];

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
      reverseSorted = union(reverseSorted, temp);
      temp = [item];
    }
  }
  return temp.length ? union(reverseSorted, temp) : reverseSorted;
}

/*
 * Even though groupSort is our public api, export all methods for testing.
 */
export default {
  groupSort,
  createParentLookups,
  prepareArrayForSort,
  parentPreferred,
  sort,
  reverseSort
}
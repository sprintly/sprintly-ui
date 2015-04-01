# Utils

### [GroupSort utility]

A [sorting utility](../src/utils/group_and_sort.js) that exposes methods for intelligently sorting Sprintly items by property in either ascending or descending order, while also maintaining groupings of parents with their subitems.

#### Use
```
var GroupSort = require('sprintly-ui').GroupSort;

var sorted = GroupSort.groupSort(myItemsArray);
```

Whether sort is ascending or descending, parents will _always_ be returned ahead of their subitems.

```
// For example, given an array of item objects:

var items = [
    {number: 1, product: {name: 'b-product'}, assigned_to: 'ann'},
    {number: 5, product: {name: 'c-product'}, assigned_to: 'ben'},
    {number: 2, product: {name: 'a-product'}, parent: 1, assigned_to: 'camille'}
];

// calling GroupSort.groupSort...

// ...with arguments (items, 'number', 'descending') returns:

    {number: 5, product: {name: 'c-product'}, assigned_to: 'ben'},
    {number: 1, product: {name: 'b-product'}, assigned_to: 'ann'},
    {number: 2, product: {name: 'a-product'}, parent: 1, assigned_to: 'camille'}

// where the parent item {number: 1} appears before its subitem {number: 2}.

// ...or, with arguments (items, 'product', 'ascending') returns:

    {number: 1, product: {name: 'b-product'}, assigned_to: 'ann'},
    {number: 2, product: {name: 'a-product'}, parent: 1, assigned_to: 'camille'},
    {number: 5, product: {name: 'c-product'}, assigned_to: 'ben'}

// where the parent {name: 'b-product'} appears before it's child {name: 'a-product'}.
```

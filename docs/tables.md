# Tables

## Sortable Table

Renders a table for displaying Sprintly item data delivered as (nested) model json. Sortable table was built to be sortable via the use of an external sort utility (such as [this group-and-sort utility](../src/utils/group_and_sort.js)), but will be static if no sort utility is used. If the former, when a user clicks one of the column labels, the onSortCollection handler will call an external function to handle sorting (see the [example file](../examples/tables.html) for example using the utils/group_and_sort.js sorter).


```
<SortableTable
   tableType='backlog'
   label='backlog items'
   collection={myItemsCollection.toJSON()}
   columnNames=['number', 'size', 'assigned to']
   onSortCollection={GroupSort.groupSort(coll, prop, dir)}
   isBulkEditable={false}
/>
```


### SortableTable(props)

#### props.tableType (string)
Identifier that becomes useful if you're creating multiple tables from one of several collections and want to track which table is triggering callbacks in your parent view. For example, we use this identifier to track which status-based table in Sprintly's Mine view should be sorted and rerendered on a user sort event.


#### props.label (string)
Table title that will appear above the table.


#### props.collection (array of objects; required)
We recommend using [Backbone Supermodel](http://pathable.github.io/supermodel/) to generate nested collections, or use the [Sprintly-data client](https://github.com/sprintly/sprintly-data), which returns collections of supermodels.

It is also possible to use non-nested item data (such as sprintly api data collected via the [Sprintly-search client](https://github.com/sprintly/sprintly-search)) with Sortable Table _as long as you're not passing "product" through as a column option_ (see below).

Either way, you'll need to serialize models to json before passing them to Sortable Table.


#### props.columnNames (array of strings; required)
In addition to expecting an array of nested json data, Sortable Table expects an array of item properties you'd like represented in the table as columns/properties to sort on.

Options include:

* 'product' (the product the item belongs to; don't pass if using non-nested item data)
* 'number'
* 'size' (item estimate or score)
* 'status'
* 'title'
* 'tags'
* 'created by'
* 'assigned to'
* 'created' (date created)


#### props.baseUrl (string)
Base url for table row linkable elements, such as item titles, item numbers, and product names.


#### props.onSortCollection (function; required)
Function to call on parent view that will handle sorting. See the [example file](../examples/tables.html) for example using the utils/group_and_sort.js sorter.

Use __.noop() or similar if rendering a static table.


#### props.isBulkEditable (boolean)
If true, the left-most column in the table will contain checkboxes for bulk-selection. Use with onBulkSelect handler (below).


#### props.onBulkSelect (function)
Bulk selection handler to trigger on parent view for operating on item data in aggregate.


#### props.modelChangerUtilties (object)
Container for passing through utility objects and/or functions for responding to item changes that are made via various Sortable Table child components (that may or may not be in play depending on columnNames passed in).

These include:

* Estimator (menu for changing item size/score)
* Status (menu for changing item status)
* TagEditor (menu for adding/removing tags)
* Assigner (menu for changing item 'assigned to' status)

```
// Something like....

var modelChangers = {
    estimateChanger: {
        changeScore: function() {..change item score..}
    },
    statusChanger: {
        changeStatus: function() {..change item status..}
    },
    tagChanger: {
        addOrRemove: function() {..add or remove item tag..}
    },
    assigneeChanger: {
        changeAssignee: function() {..change item assignee..}
    }
};
```


#### props.navigatorUtility (object)
Object whose intended purpose is to provide a navigation utility for routing to a tag-filtered view when users click on a tag in the Tags component menu.

```
// Example:

var navigator = {
    setTagFilterAndRoute: function() {..filter items by tag and load them in new view..}
}
```

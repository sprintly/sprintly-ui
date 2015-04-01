# Menu Components

### Selector Menu

Renders dropdown that shows a currently selected option, and when clicked opens to show a list of options and fuzzy-search input for finding from among the options list.

Matching user-entered text in search is case insensitive and partial-aware (ie, if a user enters "foo" and presses ENTER key, and there is at least one option containing "foo", that option will be selected. If there is more than one option containing "foo", the first option in lexical order will be selected.)


```
<SelectMenu
    optionsList={myProducts.toJSON()}
    onSelectionChange={_.bind(this.doSomething, this)}
/>
```

#### props.optionsList (array of objects)
An array of options (for example, myBackboneCollection.toJSON()). Each option in the list needs to have either a 'name' or a 'title' field to show in the menu.

#### props.defaultSelection (string)
If you'd like the default selection to be something other than 'All', specify an alternative string.

#### props.onSelectionChange (function; required)
Callback function that will be triggered when a user selects an item via the menu. You might use this, for example, to show the user different information via the parent view when selection changes.
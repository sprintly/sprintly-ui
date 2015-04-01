# Misc Components


### Assigner
WIP
Can use SelectorMenu for simple assigner with typeahead.


### Estimator

The Estimator component renders an item score that, when clicked, opens a score-editing menu. Score is editable via an edit menu that will open on score click unless props.readOnly is passed true.

#### props.modelId (array of numbers)
Representing product id and model id: [productId, modelId]. Supports usage in multi-product environments where we may need to identify and act on single items but where items from different products can have the same item number.

#### props.readOnly (boolean)
Read only items will render a score that is not editable and won't render a menu on click.

#### props.itemType (string; required)
Item type, ie: 'story', 'task', 'test', or 'defect'.

#### props.score (string; required)
Item score, ie: '~', S', 'M', 'L', 'XL'. The '~' signifies an unscored item.

#### props.estimateChanger (object)
```
// Something like ...

var estimateChanger = {
    changeScore: function(modelId, newScore) {
        var item = items.findById(modelId);

        if (newScore !== item.get('oldScore') {
            item.set('score', newScore);
        }
    }
};
```

If readOnly is false, then score is editable and this object can be used to provide a utility for changing item score externally. Must include a ```changeScore``` method.


### Expander

Renders buttons for toggling between expanded and condensed modes in various views. Used in Sprintly in columns and tables.

#### props.expanded (string)
Set the default state, either 'expanded' or 'condensed'.

#### props.onClick (function; required)
Handler for triggering change in parent state based on whether 'expanded' or 'condensed' are currently active.


### Status
WIP


### TagEditor

Interface for adding and removing item tags. Renders an edit icon that, when clicked, opens a menu with an add item input and list of item's tags that may be deleted/removed. If an item has no tags, renders the add item input alone.

#### props.modelId (array of numbers)
An array representing item product's id and item number. Supports identification of single items in a multi-product environment where items from different products may share the same item number.

#### props.readOnly (boolean)
If readOnly is passed {true}, clicking the tag icon will not open a tag edit menu.

#### props.tags (array of strings; required)
Array of item tags, for example: ```['tag1', 'tag2', 'tag3']```. If an item has no tags, pass an empty array.

#### props.tagChanger (object)
Object for passing utility function through for the purposes of adding and removing tags from item models. Must contain an ```addOrRemove``` method.

```
// Something like...

var tagChanger = {
    addOrRemove: function(modelId, tag, action) {
        var item = items.findItemById(modelId);
        action === 'add' ? item.add(tag) : item.remove(tag);
    }
};
```


### Tags

Renders either a textual list of tags ('tag1, tag2, tag3') or a tag count ('4 tags') button that, when clicked, opens a popup showing the item's tags. If passing a click handler through via navigatorUtility prop or altOnTagClick, clicking a tag will trigger the respective handler.

#### props.tags (array of strings)
List of tags, for example: ['tag1', 'tag2'].

#### props.condensed (boolean)
If you'd like tags represented as a clickable tag count instead of a textual list of tags, pass {true}.

#### props.navigatorUtility (object)
Object that wraps a ```setTagFilterAndRoute``` function.

```
// Something like...

var navigator = {
    setTagFilterAndRoute: function (tag) {
        myFilters.set({tags: tag});
        myView.navigate('/items/?tags=' + tag);
    }
};
```

#### props.altOnTagClick (function)
If not using a navigator utility to route to tag-filtered views and you want to trigger an alternate behavior when a user clicks on a tag, use this prop.
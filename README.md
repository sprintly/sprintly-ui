# Sprintly-UIKit

[![wercker status](https://app.wercker.com/status/02fb8fa03abe6c3d616cfeb1672d44ff/m "wercker status")](https://app.wercker.com/project/bykey/02fb8fa03abe6c3d616cfeb1672d44ff)

A library of reusable React components for building Sprintly UIs.


## Usage

To build production files, run ```npm run build-production```, which will compile the latest from source into ```dist```, giving you both _sprintly-uikit.js_ and _sprintly-uikit.min.js_.

To add a component to your project, simply either:
* add a script tag to your project's head referencing the ```sprintly-uikit.js or sprintly-uikit.min.js``` build file, or
* require the package at the top of your js file. You may require the whole library or a specific component.


Example 1:
```
var SprintlyUIKit = require('/path/sprintly-uikit');

React.renderComponent(
  <SprintlyUIKit.Widget
    options={myOptions}
    callback={myCallback}
  />
);
```


Example 2:
```
var Widget = require('/path/sprintly-uikit').Widget;

React.renderComponent(
  <Widget
    options={myOptions}
    callback={myCallback}
  />
);
```


## Testing

Before you can run the test suite, you'll need to compile and build the necessary files by running ```npm run setup-tests```. Thereafter, run tests via ```npm test```.


## Examples

[Selector menu example][1]

![](http://g.recordit.co/iVmXZP8gLh.gif)

[1]: http://sprintly.github.com/sprintly-uikit/examples/menus.html

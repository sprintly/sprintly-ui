# Sprintly-UIKit

[![wercker status](https://app.wercker.com/status/02fb8fa03abe6c3d616cfeb1672d44ff/m "wercker status")](https://app.wercker.com/project/bykey/02fb8fa03abe6c3d616cfeb1672d44ff)

A library of reusable React components for building Sprintly UIs.

The goal of this repository is to make it easier for developers (those who work at Sprintly as well as those who use Sprintly) to build Sprintly interfaces that look and feel like the Sprintly product.


## Usage

To add a component to your project, require the package at the top of your js file. You may require the whole library or a specific component.


Example 1:
```
var SprintlyUIKit = require('sprintly-uikit');

React.renderComponent(
  <SprintlyUIKit.Widget
    options={myOptions}
    callback={myCallback}
  />
);
```


Example 2:
```
var Widget = require('sprintly-uikit').Widget;

React.renderComponent(
  <Widget
    options={myOptions}
    callback={myCallback}
  />
);
```

To build production files, run ```npm run build-production```, which will compile the latest from source into ```dist```, giving you both _sprintly-uikit.js_ and _sprintly-uikit.min.js_. If you prefer to include the uikit as static files or include it in the head of your project, you'll want these build files.


## Testing

Before you can run the test suite a first time, you'll need to compile and build the necessary files by running ```npm run setup-tests```. Thereafter, run tests via ```npm test```.


## Examples

[Selector menu example][1]

![](http://g.recordit.co/iVmXZP8gLh.gif)

[1]: https://github.com/sprintly/sprintly-uikit/blob/master/examples/menus.html

# Sprintly-UIKit  **UNDER CONSTRUCTION**

A library of reusable React components for building Sprintly UIs.


## Installation

To install, you may download directly from Github or install via ```npm install sprintly-uikit```.


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
var SelectorMenu = require('/path/sprintly-uikit').Widget;

React.renderComponent(
  <Widget
    options={myOptions}
    callback={myCallback}
  />
);
```


## Testing

Compile and build tests with ```npm run build-test``` and run tests via ```npm test```, or combine ```npm run build-test && npm test```.


## Examples

[Selector menu example][1]

[1]: path_to_example.html

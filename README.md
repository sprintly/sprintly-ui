# Sprintly-UIKit

[![wercker status](https://app.wercker.com/status/02fb8fa03abe6c3d616cfeb1672d44ff/m "wercker status")](https://app.wercker.com/project/bykey/02fb8fa03abe6c3d616cfeb1672d44ff)

[![Coverage Status](https://img.shields.io/coveralls/sprintly/sprintly-uikit.svg)](https://coveralls.io/r/sprintly/sprintly-uikit)

[![dependencies](https://david-dm.org/sprintly/sprintly-uikit.png)](https://david-dm.org/sprintly/sprintly-uikit.png)

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

To generate a UMD bundle containing unminified and minified versions, run ```npm package-distro```.

## Development

To run a dev server and Browserfy watch tasks, run ```npm run dev```.
Note: While there are a handful of npm convenience scripts available for your use,
you'll find more incremental tasks in the gulpfile.

## Testing

Run tests in the console and open in browser via ```npm test```. (Note: localhost:8080/test/ will open automatically when you run tests. To run in cli-only environment, run ```npm run test-cli```).

To see Istanbul coverage information, run tests with ```npm test``` to build tests and start the server,
and then in a new tab run ```npm run coverage``` to generate coverage data. To view coverage info in the browser, go to localhost:8080/test/coverage/lcov. If you are unfamiliar, note that lcov reports allow you to drill down through code files to view per-file coverage data as well as line-by-line coverage.


## Examples

[Selector menu example][1]

![](http://g.recordit.co/iVmXZP8gLh.gif)

[1]: https://github.com/sprintly/sprintly-uikit/blob/master/examples/menus.html

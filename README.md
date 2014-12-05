# Sprintly-UI

[![wercker status](https://app.wercker.com/status/6f1113d164af4141ba82b9608cc795bc/m "wercker status")](https://app.wercker.com/project/bykey/6f1113d164af4141ba82b9608cc795bc)

[![Coverage Status](https://coveralls.io/repos/sprintly/sprintly-ui/badge.png)](https://coveralls.io/r/sprintly/sprintly-ui)
[![Dependency Status](https://david-dm.org/sprintly/sprintly-ui.svg)](https://david-dm.org/sprintly/sprintly-ui)
[![devDependency Status](https://david-dm.org/sprintly/sprintly-ui/dev-status.svg)](https://david-dm.org/sprintly/sprintly-ui#info=devDependencies)

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
For unminified only, run the gulp ```build``` task.


## Development

To run a dev server and Browserfy watch tasks, run ```npm run dev```. This currently requires including
new React components in the example/index.html file for browser viewing/debugging.

Note: While there are a handful of npm convenience scripts available for your use,
you'll find more incremental tasks in the gulpfile.


## Testing

Run tests in the console and open in browser via ```npm test```. (Note: localhost:8080/test/ will open automatically when you run tests. To run in cli-only environment, run ```npm run test-cli```).

To see Istanbul coverage information, run tests with ```npm test``` to build tests and start the server,
and then in a new tab run ```npm run coverage```. To view coverage info in the browser, go to localhost:8080/test/coverage/lcov. If you are unfamiliar with lcov html reports, note that these allow you to drill down through code files to view per-file coverage data as well as line-by-line coverage.


## Examples

[Selector menu example][1]

![](http://g.recordit.co/iVmXZP8gLh.gif)

[1]: https://github.com/sprintly/sprintly-uikit/blob/master/examples/index.html

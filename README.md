# Sprintly-UI

[![wercker status](https://app.wercker.com/status/6f1113d164af4141ba82b9608cc795bc/m "wercker status")](https://app.wercker.com/project/bykey/6f1113d164af4141ba82b9608cc795bc)

[![Coverage Status](https://coveralls.io/repos/sprintly/sprintly-ui/badge.png?branch=master)](https://coveralls.io/r/sprintly/sprintly-ui?branch=master)
[![Dependency Status](https://david-dm.org/sprintly/sprintly-ui.svg)](https://david-dm.org/sprintly/sprintly-ui)
[![devDependency Status](https://david-dm.org/sprintly/sprintly-ui/dev-status.svg)](https://david-dm.org/sprintly/sprintly-ui#info=devDependencies)

A library of reusable React components for building Sprintly UIs.

The goal of this repository is to make it easier for developers (those who work at Sprintly as well as those who use Sprintly) to build Sprintly interfaces that look and feel like the Sprintly product.


## Usage

To add a component to your project, require the package at the top of your js file. You may require the whole library or a specific component. For example, to include an Estimator component in your project:
```
// Option #1

var SprintlyUI = require('sprintly-ui');

React.renderComponent(
  <SprintlyUI.Estimator
    modelId: 1,
    itemType: 'task',
    score: 'S',
    estimateChanger: {...}
  />
);


// Option #2

var Estimator = require('sprintly-ui').Estimator;

React.renderComponent(
  <Estimator
    modelId: 1,
    itemType: 'task',
    score: 'S',
    estimateChanger: {...}
  />
);
```

To generate a UMD bundle containing unminified and minified versions, run ```$ npm package-distro```. This will save these files in /dist/js. For unminified only, run the gulp ```build``` task.

Note: While there are a handful of npm convenience scripts available for your use,
you'll find more incremental tasks in the gulpfile.

## Styles

We're using LESS to generate styles and have a build task for compiling minified and unminified versions: ```$ npm run build-css```. Compiled styles will be saved to /dist/css.


## Development

To run a dev server and Browserfy watch tasks, run ```$ npm run dev```. This will open the examples homepage where you'll find links to component examples. These files require CSS to be built via the ```$ npm run build-css``` command.

If you are building new components to add to this repo, you may add them to the appropriate example file or create a new example file to help you develop. There's a template.html file that you can copy over if creating a new example file. Please include your example file as part of any PRs for adding new components.

Please read the [contributing doc](CONTRIBUTING.md) before starting work and make use of the [PR template](PR_TEMPLATE.md) when submitting pull requests.


## Utils and mixins

We hope to provide utility classes and mixins wherever possible for controlling things like making item changes via component menus, sorting item data in tables, extending component functionality, etc. Please look for these in [utils](src/utils/) [docs [here](docs/utils.md)] and [mixins](src/mixins/) [docs [here](docs/mixins.md)].


## Tests and code coverage

Running ```$ npm test``` will run tests in the cli and then in the browser (a test server will open localhost:8080/test/ automatically). To run tests in the terminal only run ```$ npm run test-cli```, or to run tests the browser only run ```$ npm run test-browser```.

To see Istanbul coverage information, run ```$ npm test``` to build tests and start the server,
and, in a new tab, run ```$ npm run coverage```. To view html coverage info, visit localhost:8080/test/coverage/lcov. If you are unfamiliar with lcov html reports, these allow you to drill down through code files to view per-file coverage data as well as line-by-line coverage.


## Examples

[Selector menu example code][1]

![](http://g.recordit.co/6Q0ZAafcx0.gif)

[1]: https://github.com/sprintly/sprintly-ui/blob/master/examples/menus.html

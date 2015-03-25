# Sprintly-UI
[![wercker status](https://app.wercker.com/status/6f1113d164af4141ba82b9608cc795bc/m "wercker status")](https://app.wercker.com/project/bykey/6f1113d164af4141ba82b9608cc795bc)

[![Coverage Status](https://coveralls.io/repos/sprintly/sprintly-ui/badge.png?branch=master)](https://coveralls.io/r/sprintly/sprintly-ui?branch=master)
[![Dependency Status](https://david-dm.org/sprintly/sprintly-ui.svg)](https://david-dm.org/sprintly/sprintly-ui)
[![devDependency Status](https://david-dm.org/sprintly/sprintly-ui/dev-status.svg)](https://david-dm.org/sprintly/sprintly-ui#info=devDependencies)

A library of reusable React components for building Sprintly UIs.

The goal of this repository is to make it easier for developers (those who work at Sprintly as well as those who use Sprintly) to build Sprintly interfaces that look and feel like the Sprintly product.


## Usage
To use Sprintly-ui in your project: ```$ npm install sprintly-ui```. Or, generate a UMD bundle containing unminified and minified versions, run the prepublish script: ```$ npm run prepublish```. [Note: For unminified only, run the gulp ```build``` task.]

Then add a component to your project by requiring it at the top of your file:
```
// for example, to use just the Estimator component:

var SprintlyUI = require('sprintly-ui').Estimator;

React.renderComponent(
  <Estimator
    modelId: 1,
    itemType: 'task',
    score: 'S',
    estimateChanger: {...}
  />
);
```
...or include ```dist/js/sprintly-ui.min.js``` in a script tag in the head tag of your html file.


## Styles
To make it easier to modify component styles, we've decided against the React recommendation to inline styles and instead offer versioned stylesheets available via an Amazon S3 bucket that we've made public. To add Sprintly-ui styles into your project, include ```<link rel="stylesheet" href="https://s3-us-west-1.amazonaws.com/sprintly-ui-build-artifacts/v1.0.0/sprintly-ui.css" type="text/css">``` in the head of your html file. Just make sure that the ```<.../v1.0.0...>``` part is up-to-date and reflects the version of Sprintly-UI that you're using.

Alternatively, you may choose to store and serve the unminified or minified stylesheet in ```/dist/css```. You'll need to build those files via ```$ npm run build-css```.


## Working with components and fetching data
Sprintly-ui is a component library that is built using Facebook's React library. If you aren't familiar with React, you can think about it as the "V" (for "view") in MVC, though you can also build components that have controller-like functionality.

Since we want to be non-deterministic about how these components will be used, the assumption we make is that components in this library will be owned and managed by parent views that you, the user, will create. Just remember that you need to create a root node (typically an element with an 'id' property on it) in a template or html file to render your component into.

These parent or "controller views" will need to do the work of fetching data and propagating changes on that data down to their child components. We're using [Backbone](http://backbonejs.org/) and [Flux](https://facebook.github.io/flux/) on projects here at Sprintly, but Sprintly-ui components should be pluggable into your framework of choice. We've open-sourced two distinct clients for pulling data from Sprintly: [Sprintly-search](https://github.com/sprintly/sprintly-search), and [Sprintly-data](https://github.com/sprintly/sprintly-data).


## Development
Good-to-knows: there are a handful of npm convenience scripts available for your use in package.json, but you'll find more incremental tasks in the gulpfile.

To run a dev server and Browserfy watch tasks, run ```$ npm run dev```. This will open the examples homepage where you'll find links to component examples. These files require CSS to be built via the ```$ npm run build-css``` command.

If you are building new components to add to this repo, you may add them to the appropriate example file or create a new example file to help you develop. There's a [template file](examples/template.html) that you can copy over if creating a new example file. Please include your example file as part of any PRs for adding new components.

Please read the [contributing doc](CONTRIBUTING.md) before starting work and make use of the [PR template](PR_TEMPLATE.md) when submitting pull requests.


## Utils and mixins
We hope to provide utility classes and mixins wherever possible for controlling things like making item changes via component menus, sorting item data in tables, extending component functionality, etc. Please look for these in [utils](src/utils/) [docs [here](docs/utils.md)] and [mixins](src/mixins/) [docs [here](docs/mixins.md)].


## Tests and code coverage
Running ```$ npm test``` will run tests in the cli and then in the browser (a test server will open localhost:8080/test/ automatically). To run tests in the terminal only run ```$ npm run test-cli```, or to run tests the browser only run ```$ npm run test-browser```.

To see Istanbul coverage information, run ```$ npm test``` to build tests and start the server,
and, in a new tab, run ```$ npm run coverage```. To view html coverage info, visit localhost:8080/test/coverage/lcov. If you are unfamiliar with lcov html reports, these allow you to drill down through code files to view per-file coverage data as well as line-by-line coverage.


## Examples
You can view examples locally in the browser by running ```$ npm run build-css && npm run dev```, or take a look at some example code using the links below.
* [Selector menu example code](examples/menus.html)
* [SortableTable example code](examples/tables.html)
* [Misc. components example code](examples/misc.html)

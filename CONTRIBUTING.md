## Welcome!

We're excited that you're thinking about contributing to Sprintly-UI.
In order to make contributing as friction-free as possible, please read through and consider the following guidelines.

#### Roadmap and issues
Please refer to [the roadmap](roadmap.md) before starting work on new components that you plan for inclusion in this repo. This will help us avoid duplicate efforts. If there's something that we're already planning via the roadmap that you would nevertheless like to work on, let us know and we'll see if we can make that work with our dev schedule.

If there's a feature that you'd like to see as a component that _isn't_ on the roadmap, have at it! We'd prefer if you filed an issue before starting work so that we can check in and see if there's anything we can help with, but it's really up to you.

#### Component structure
Since we would like to be as non-deterministic as we can about how these components will be used, the assumption that we make is that users of this library will be plugging these componenets into apps that contain parent (or "controller") views that will manage data fetching and syncing themselves.

Designing components for maximum reusability isn't always easy, especially when writing multiple components with the intention of combining them to form a composite component, like our [SortableTable](src/components/sortable_table). A good rule of thumb is that if you think there could be another use for one of the components within your composite component, see if you can reasonably break it out (ie, make it functional for your situation while making its imputs as generic as possible). That's not always possible for very domain-specific components, so just use your best judgement.

#### Props vs state
To support React's one-way data flow pattern, we ask that you try to avoid state wherever possible when developing components for inclusion in Sprintly-ui, and instead favor passing data and callback functions through as props. The React [getting started](http://facebook.github.io/react/docs/thinking-in-react.html) docs are great and go over one-way data flow and the difference between props and state in detail.

#### Styles
We're using LESS to generate styles and have a build task for compiling minified and unminified versions: ```$ npm run build-css```. Compiled styles will be saved to ```/dist/css```.

#### Testing and coverage
All PRs must include unit tests, and we ask for a minimum of 80% coverage. Tests are written in Mocha, Chai, and Sinon, and we use Istanbul for code coverage. We recommend using the [React Test Utilities](https://facebook.github.io/react/docs/test-utils.html), which make testing component lifecycle much easier.

#### Submitting pull requests
Please include documentation and an example file as part of any PRs for adding new components.

You can find examples for existing components in ```/examples```. If an appropriate example file doesn't exist for the category of component you've developed, please add a new (appropriately named) file. There's a [template file](examples/template.html) that you can copy over to use as a base. Don't forget to add a link to your example file in [the examples index](examples/index.html)!

All component documentation is located in the [docs folder](docs/). Please update the docs, adding a new doc file if one covering the category your new component belongs to isn't already represented.

When you are ready to submit your request, please copy over the [PR template](PR_TEMPLATE.md) into the body of your pull request and fill it out. This gives us a common format for reading and reviewing pull requests.

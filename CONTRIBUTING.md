## Welcome!

### We're excited that you're thinking about contributing to Sprintly-UI.
In order to make contributing as friction-free as possible, please read through and consider the following guidelines.

#### Roadmap and issues
Please refer to the roadmap document before starting work on new components that you plan for inclusion in this repo. This will help us avoid duplicate efforts. If there's something that we're already planning via the roadmap that you would nevertheless like to work on, let us know and we'll see if we can make that work with our dev schedule.

If there's a feature that you'd like to see as a component that _isn't_ on the roadmap, have at it! We'd prefer if you filed an issue before starting work so that we know what to expect, but that's up to you.

#### Working with components and fetching data
Sprintly-ui is a component library that is built using Facebook's React library. If you aren't familiar with React, you can think about it as the "V" (for "view") in MVC, though you can also build components that have controller-like functionality.

Since we want to be non-deterministic about how these components will be used, the assumption we make is that components in this library will be owned and managed by parent views that you, the user, will create. Just remember that you need to create a root node (typically an element with an 'id' property on it) in a template or html file to render your component into.

These parent or "controller views" will need to do the work of fetching data and propagating changes on that data down to their child components. We're using [Backbone](http://backbonejs.org/) and [Flux](https://facebook.github.io/flux/) on projects here at Sprintly, but Sprintly-ui components should be pluggable into your framework of choice. We've open-sourced two distinct clients for pulling data from Sprintly: [Sprintly-search](https://github.com/sprintly/sprintly-search), and [Sprintly-data](https://github.com/sprintly/sprintly-data).


#### Props vs state
To support React's one-way data flow pattern, we ask that you try to avoid state wherever possible when developing components for inclusion in Sprintly-ui, and instead favor passing data and callback functions through as props. The React [getting started](http://facebook.github.io/react/docs/thinking-in-react.html) docs are great and go over one-way data flow and the difference between props and state in detail.



## Welcome!

### We're excited that you're thinking about contributing to the Sprintly UI kit.
In order to make contributing as friction-free as possible, please read through and consider the following guidelines.

#### Roadmap and Issues
Please refer to the roadmap document before starting work on new components. This will help us avoid duplicate efforts. If there's something that we're already planning via the roadmap that you would like to work on, let us know and we'll see if we can make that work.

If there's a feature that you'd like to see as a component that isn't on the roadmap, have at it! We'd prefer if you filed an issue before starting work so that we know what to expect, but it's up to you.

#### Component Structure
The assumption that we make is that the components in this library will be owned and managed by parent views that users create, and that these views will handle fetching data and reacting to changes in that data. This structure is in part dictated by our needs at Sprintly, and in part follows from the React one-way-data-flow pattern. We ask that you try to avoid state wherever possible, and instead favor passing data and callback functions through as props.

When building composite components (ie, components that will own other components) it can be very difficult to decide where on the spectrum of composability one should land. React, like other languages and frameworks, gives you the option of leveraging 'dependency-injection'-like patterns where you pass components into their parents fully formed and then manage them through this.props.children. (you should check this floda).

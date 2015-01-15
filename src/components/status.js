var React = window.React || require('react/addons');
var _ = require('lodash');

/*
 * (WIP)
 * TODO(fw): finish for Reports
 */

var Status = React.createClass({
  propTypes: {
    modelId: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    status: React.PropTypes.number.isRequired,
    statusChanger: React.PropTypes.object.isRequired
  },

  mixins: [],

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <div></div>
    );
  }
});

module.exports = Status;
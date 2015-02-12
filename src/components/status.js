var React = window.React || require('react/addons');
var _ = require('lodash');

/*
 * (WIP)
 * TODO(fw)
 */

var Status = React.createClass({
  propTypes: {
    modelId: React.PropTypes.arrayOf(React.PropTypes.number),
    readOnly: React.PropTypes.bool,
    status: React.PropTypes.number.isRequired,
    statusChanger: React.PropTypes.object.isRequired
  },

  mixins: [],

  getDefaultProps: function() {
    return {
      modelId: null,
      readOnly: false
    };
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
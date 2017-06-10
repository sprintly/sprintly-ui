var React = window.React || require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');

/*
 * (WIP)
 * TODO(fw)
 */

var Status = createReactClass({
  propTypes: {
    modelId: PropTypes.arrayOf(PropTypes.number),
    readOnly: PropTypes.bool,
    status: PropTypes.number.isRequired,
    statusChanger: PropTypes.object
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

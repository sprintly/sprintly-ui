import React from 'react';

/*
 * (WIP)
 * @TODO
 */

var Status = React.createClass({
  propTypes: {
    modelId: React.PropTypes.arrayOf(React.PropTypes.number),
    readOnly: React.PropTypes.bool,
    status: React.PropTypes.number.isRequired,
    statusChanger: React.PropTypes.object
  },

  mixins: [],

  getDefaultProps() {
    return {
      modelId: null,
      readOnly: false
    };
  },

  getInitialState() {
    return {};
  },

  render() {
    return (
      <div></div>
    );
  }
});

module.exports = Status;
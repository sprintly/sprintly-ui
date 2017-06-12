import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

/*
 * (WIP)
 * TODO(fw)
 */

const Status = createReactClass({
  propTypes: {
    modelId: PropTypes.arrayOf(PropTypes.number),
    readOnly: PropTypes.bool,
    status: PropTypes.number.isRequired,
    statusChanger: PropTypes.object
  },

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

export default Status;

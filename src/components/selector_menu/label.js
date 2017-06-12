import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';


const Label = createReactClass({

  propTypes: {
    selected: PropTypes.string,
    onClick: PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      selected: 'All'
    };
  },

  render: function() {
    return (
      <div className='selector__label' onClick={this.props.onClick}>
        <span className='inner'>{this.props.selected}</span>
        <i className='selector__icon'></i>
      </div>
    );
  }
});

export default Label;

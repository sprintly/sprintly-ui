import React from 'react';

const Label = React.createClass({

  propTypes: {
    selected: React.PropTypes.string,
    onLabelClick: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      selected: 'All'
    };
  },

  render() {
    return (
      <div className='selector__label' onClick={this.props.onLabelClick}>
        <span className='inner'>{this.props.selected}</span>
        <i className='selector__icon'></i>
      </div>
    );
  }
});

export default Label;
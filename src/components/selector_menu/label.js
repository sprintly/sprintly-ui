var React = window.React || require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');


var Label = createReactClass({

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


module.exports = Label;

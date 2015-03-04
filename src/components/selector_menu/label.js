var React = window.React || require('react/addons');


var Label = React.createClass({

  propTypes: {
    selected: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
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
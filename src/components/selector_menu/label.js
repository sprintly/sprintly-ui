import React from 'react/addons';


var Label = React.createClass({

  propTypes: {
    selected: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      selected: "All"
    };
  },

  render: function() {
    return (
      <div className="label" onClick={this.props.onClick}>
        <span>{this.props.selected}</span>
        <i className="icon icon-arrow-down"></i>
      </div>
    );
  }
});


export default Label;
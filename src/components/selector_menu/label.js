var React = window.React || require('react/addons');
var SelectorStyles = require('../../styles/selector_menu');


var Label = React.createClass({

  propTypes: {
    selected: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
  },

  mixins: [SelectorStyles],

  getDefaultProps: function() {
    return {
      selected: "All"
    };
  },

  render: function() {
    return (
      <div className="label" style={SelectorStyles.label} onClick={this.props.onClick}>
        <span style={SelectorStyles.innerLabel}>{this.props.selected}</span>
        <i className="icon icon-arrow-down" style={SelectorStyles.icon}></i>
      </div>
    );
  }
});


module.exports = Label;
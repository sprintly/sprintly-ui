/** @jsx React.DOM */
var $ = require('jquery');
var React = window.React || require('react/addons');


var List = React.createClass({
  __name__: "List",

  propTypes: {
    optionNames: React.PropTypes.array,
    onOptionSelect: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      optionNames: []
    };
  },

  onOptionSelect: function(ev) {
    var optionName = $(ev.currentTarget).text();
    this.props.onOptionSelect(optionName);
  },

  render: function() {
    var options = this.props.optionNames.map(function(optionName) {
      return (
        <li key={optionName} className="option" onClick={this.onOptionSelect}>
          <span>{optionName}</span>
        </li>
      );
    }, this);

    return (
      <ul className="options">
        {options}
      </ul>
    );
  }
});


module.exports = List;
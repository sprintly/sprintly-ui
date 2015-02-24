var React = window.React || require('react/addons');
var SelectorStyles = require('../../styles/selector_menu');


var Search = React.createClass({

  propTypes: {
    filterList: React.PropTypes.func.isRequired,
    onKeyDown: React.PropTypes.func.isRequired
  },

  mixins: [SelectorStyles],

  getFilter: function() {
    var userInput = this.getDOMNode().value;
    this.props.filterList(userInput);
  },

  render: function() {
    return (
      <input style={SelectorStyles.input} type="text"
        onKeyDown={this.props.onKeyDown}
        onChange={this.getFilter}
      />
    );
  }
});


module.exports = Search;
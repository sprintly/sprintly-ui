import React from 'react/addons';


var Search = React.createClass({

  propTypes: {
    filterList: React.PropTypes.func.isRequired,
    onKeyDown: React.PropTypes.func.isRequired
  },

  getFilter: function() {
    var userInput = this.getDOMNode().value;
    this.props.filterList(userInput);
  },

  render: function() {
    return (
      <input type="text"
        onKeyDown={this.props.onKeyDown}
        onChange={this.getFilter}
      />
    );
  }
});


export default Search;
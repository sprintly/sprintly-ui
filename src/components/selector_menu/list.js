var _ = require('lodash');
var React = window.React || require('react/addons');


var List = React.createClass({

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
    var optionName = ev.currentTarget.textContent;
    this.props.onOptionSelect(optionName);
  },

  render: function() {
    var options = this.props.optionNames.map(function(optionName) {
      return optionName.length ? (
        <li key={optionName} className='option' onClick={this.onOptionSelect}>
          <span className='inner'>{optionName}</span>
        </li>
      ) : null;
    }, this);

    return (
      <ul className='selector__options'>
        {options}
      </ul>
    );
  }
});

module.exports = List;
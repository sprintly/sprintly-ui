var React = window.React || require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');


var List = createReactClass({

  propTypes: {
    optionNames: PropTypes.array,
    onOptionSelect: PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      optionNames: []
    };
  },

  render: function() {
    var options = this.props.optionNames.map(function(optionName) {
      return optionName.length ? (
        <li key={optionName} className='option' onClick={_.partial(this.props.onOptionSelect, optionName)}>
          <span className='inner'>{optionName}</span>
        </li>
      ) : null;
    }.bind(this));

    return (
      <ul className='selector__options'>
        {options}
      </ul>
    );
  }
});

module.exports = List;

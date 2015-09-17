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

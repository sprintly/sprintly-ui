import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';


const List = createReactClass({

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
    const options = this.props.optionNames.map(function(optionName) {
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

export default List;

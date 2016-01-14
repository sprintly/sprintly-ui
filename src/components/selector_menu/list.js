import React from 'react';

const List = React.createClass({

  propTypes: {
    optionNames: React.PropTypes.array,
    onOptionSelect: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      optionNames: []
    };
  },

  render() {
    let options = this.props.optionNames.map((name) => {
      return name.length ? (
        <li key={name} className='option'
          onClick={() => { return this.props.onOptionSelect(name); }}>
          <span className='inner'>{name}</span>
        </li>
      ) : '';
    });

    return (
      <ul className='selector__options'>
        {options}
      </ul>
    );
  }
});

export default List;

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';


const Search = createReactClass({

  propTypes: {
    inputOverride: PropTypes.string,
    filterList: PropTypes.func.isRequired,
    processSearchInput: PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      value: ''
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps && nextProps.clearInput) {
      this.setState({
        value: ""
      });
    }
  },

  componentDidUpdate: function() {
    ReactDOM.findDOMNode(this).focus();
  },

  handleChange: function(ev) {
    const val = ev.target.value;

    this.setState({
      value: val
    });

    this.props.filterList(val);
  },

  maybeSubmit: function(ev) {
    const val = this.state.value;

    if (ev.which === 13 && val.length) {
      this.setState({
        value: ''
      });
      this.props.processSearchInput(val.toLowerCase());
    }
  },

  render: function() {
    return (
      <input
        className='selector__searchbox'
        type='text'
        value={this.state.value}
        onKeyDown={this.maybeSubmit}
        onChange={this.handleChange}
      />
    );
  }
});

export default Search;

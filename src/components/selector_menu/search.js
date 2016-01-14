import React from 'react';
import ReactDOM from 'react-dom';

const Search = React.createClass({

  propTypes: {
    inputOverride: React.PropTypes.string,
    filterList: React.PropTypes.func.isRequired,
    processSearchInput: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      value: ''
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.clearInput) {
      this.setState({
        value: ''
      });
    }
  },

  componentDidUpdate() {
    ReactDOM.findDOMNode(this).focus();
  },

  handleChange(event) {
    let value = event.target.value;

    this.setState({
      value
    });
    this.props.filterList(value);
  },

  maybeSubmit(event) {
    let value = this.state.value;

    if (event.which === 13 && value.length) {
      this.setState({
        value: ''
      });
      this.props.processSearchInput(value.toLowerCase());
    }
  },

  render() {
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

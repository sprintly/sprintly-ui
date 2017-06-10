var React = window.React || require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');


var Search = createReactClass({

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
    var val = ev.target.value;

    this.setState({
      value: val
    });

    this.props.filterList(val);
  },

  maybeSubmit: function(ev) {
    var val = this.state.value;

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


module.exports = Search;

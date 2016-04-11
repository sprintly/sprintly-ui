'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Search = _react2.default.createClass({
  displayName: 'Search',


  propTypes: {
    inputOverride: _react2.default.PropTypes.string,
    filterList: _react2.default.PropTypes.func.isRequired,
    processSearchInput: _react2.default.PropTypes.func.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      value: ''
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.clearInput) {
      this.setState({
        value: ''
      });
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    this.refs.input.focus();
  },
  handleChange: function handleChange(event) {
    var value = event.target.value;

    this.setState({
      value: value
    });
    this.props.filterList(value);
  },
  maybeSubmit: function maybeSubmit(event) {
    var value = this.state.value;

    if (event.which === 13 && value.length) {
      this.setState({
        value: ''
      });
      this.props.processSearchInput(value.toLowerCase());
    }
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('input', {
        ref: 'input',
        className: 'selector__searchbox',
        type: 'text',
        value: this.state.value,
        onKeyDown: this.maybeSubmit,
        onChange: this.handleChange
      })
    );
  }
});

exports.default = Search;
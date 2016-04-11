'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Label = _react2.default.createClass({
  displayName: 'Label',


  propTypes: {
    selected: _react2.default.PropTypes.string,
    onLabelClick: _react2.default.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      selected: 'All'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'selector__label', onClick: this.props.onLabelClick },
      _react2.default.createElement(
        'span',
        { className: 'inner' },
        this.props.selected
      ),
      _react2.default.createElement('i', { className: 'selector__icon' })
    );
  }
});

exports.default = Label;
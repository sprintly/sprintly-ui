'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var List = _react2.default.createClass({
  displayName: 'List',


  propTypes: {
    optionNames: _react2.default.PropTypes.array,
    onOptionSelect: _react2.default.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      optionNames: []
    };
  },
  render: function render() {
    var _this = this;

    var options = this.props.optionNames.map(function (name) {
      return name.length ? _react2.default.createElement(
        'li',
        { key: name, className: 'option',
          onClick: function onClick() {
            return _this.props.onOptionSelect(name);
          } },
        _react2.default.createElement(
          'span',
          { className: 'inner' },
          name
        )
      ) : '';
    });

    return _react2.default.createElement(
      'ul',
      { className: 'selector__options' },
      options
    );
  }
});

exports.default = List;
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * (WIP)
 * @TODO
 */

var Status = _react2.default.createClass({
  displayName: 'Status',

  propTypes: {
    modelId: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number),
    readOnly: _react2.default.PropTypes.bool,
    status: _react2.default.PropTypes.number.isRequired,
    statusChanger: _react2.default.PropTypes.object
  },

  mixins: [],

  getDefaultProps: function getDefaultProps() {
    return {
      modelId: null,
      readOnly: false
    };
  },
  getInitialState: function getInitialState() {
    return {};
  },
  render: function render() {
    return _react2.default.createElement('div', null);
  }
});

module.exports = Status;
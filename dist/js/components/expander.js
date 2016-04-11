'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Buttons for toggling the expanded/condensed state of
 * column items and table rows.
 */

var Expander = _react2.default.createClass({
  displayName: 'Expander',


  propTypes: {
    expanded: _react2.default.PropTypes.bool,
    onExpanderClick: _react2.default.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      expanded: false
    };
  },
  render: function render() {
    var _this = this;

    var expanded = this.props.expanded;
    var className = expanded ? 'expanded' : 'condensed';

    var buttonClass = 'expander__button';
    var iconClass = 'expander__icon';

    return _react2.default.createElement(
      'div',
      { className: 'expander ' + className },
      _react2.default.createElement(
        'button',
        {
          className: buttonClass + (expanded ? ' expand active' : ' expand'),
          onClick: function onClick(event) {
            return _this.props.onExpanderClick(event, true);
          } },
        _react2.default.createElement('i', { className: iconClass + (expanded ? ' expand active' : ' expand') })
      ),
      _react2.default.createElement(
        'button',
        {
          className: buttonClass + (!expanded ? ' condense active' : ' condense'),
          onClick: function onClick(event) {
            return _this.props.onExpanderClick(event, false);
          } },
        _react2.default.createElement('i', { className: iconClass + (!expanded ? ' condense active' : ' condense') })
      )
    );
  }
});

exports.default = Expander;
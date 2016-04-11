'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactClickOutside = require('react-click-outside');

var _reactClickOutside2 = _interopRequireDefault(_reactClickOutside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Estimator element displays item score that, when clicked, opens a menu
 * for editing the current score. Expects an estimate changer utility object
 * containing a changeScore method for handling score changing on the model
 * and syncing any changes with the backend.
 */

var Estimator = _react2.default.createClass({
  displayName: 'Estimator',

  ALL_ESTIMATES: [0, 1, 3, 5, 8],

  ESTIMATE_HASH: {
    0: '?',
    1: 'S',
    3: 'M',
    5: 'L',
    8: 'XL'
  },

  propTypes: {
    modelId: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number),
    readOnly: _react2.default.PropTypes.bool,
    itemType: _react2.default.PropTypes.string.isRequired,
    score: _react2.default.PropTypes.string.isRequired,
    estimateChanger: _react2.default.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      modelId: null,
      readOnly: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      menuOpen: false
    };
  },
  handleClickOutside: function handleClickOutside(event) {
    event.stopPropagation();

    this.setState({
      menuOpen: false
    });
  },
  onScoreClick: function onScoreClick() {
    if (this.props.readOnly || !this.props.estimateChanger) {
      return;
    }

    this.setState({
      menuOpen: !this.state.menuOpen ? true : false
    });
  },
  onScoreChange: function onScoreChange(event, newScore) {
    if (this.props.readOnly || !this.props.estimateChanger) {
      return;
    }

    if (this.props.score === this.ESTIMATE_HASH[newScore].toLowerCase()) {
      return;
    }

    this.props.estimateChanger.changeScore(this.props.modelId, newScore);
    this.setState({
      menuOpen: false
    });
  },
  render: function render() {
    var _this = this;

    var currentScore = this.props.score === '~' ? '?' : this.props.score;
    var scoreMenu = '';

    if (this.state.menuOpen) {
      var scores = this.ALL_ESTIMATES.map(function (score) {
        return _react2.default.createElement(
          'li',
          { key: score, className: 'estimator__score' },
          _react2.default.createElement(
            'button',
            {
              className: 'estimator__button ' + _this.props.itemType,
              onClick: function onClick(event) {
                return _this.onScoreChange(event, score);
              } },
            _this.ESTIMATE_HASH[score]
          )
        );
      });

      scoreMenu = _react2.default.createElement(
        'div',
        { className: 'estimator__menu' },
        _react2.default.createElement(
          'ul',
          { className: 'estimator__list' },
          scores
        )
      );
    }

    return _react2.default.createElement(
      'div',
      { className: 'estimator__score' },
      _react2.default.createElement(
        'button',
        { className: 'estimator__button ' + this.props.itemType,
          onClick: this.onScoreClick },
        currentScore
      ),
      scoreMenu
    );
  }
});

exports.default = (0, _reactClickOutside2.default)(Estimator);
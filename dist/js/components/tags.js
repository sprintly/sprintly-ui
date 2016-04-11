'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Tags element displays either a textual list of tags ("one, two, three")
 * or a count ("3 tags") button that, when clicked, reveals a menu popup of those tags.
 *
 * Individual tags are clickable and, if passed a navigation utility, will set filters
 * and route to tag-filtered view (however defined). Alternatively, you may pass in a callback
 * that is called on tag click to produce some other behavior.
 *
 * Note: The Tags element merely displays tags; for tag editing functionality, use in
 * conjunction with the TagEdit element.
 */

var Tags = _react2.default.createClass({
  displayName: 'Tags',


  propTypes: {
    tags: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string),
    condensed: _react2.default.PropTypes.bool,
    navigatorUtility: _react2.default.PropTypes.object,
    altOnTagClick: _react2.default.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      tags: '',
      condensed: false
    };
  },


  /*
   * If navigatorUtility prop passed in, will trigger navigation event to tag-filtered
   * view. Alternatively, pass in a different callback to trigger some other event.
   */
  onTagClick: function onTagClick(event, tag) {
    if (this.props.navigatorUtility) {
      this.props.navigatorUtility.setTagFilterAndRoute(tag);
    } else if (this.props.altOnTagClick) {
      this.props.altOnTagClick(tag);
    }
  },


  /*
   * If the item has no tags, the TagEdit sibling element takes over,
   * adding the 'Add a tag.' button.
   * If we only have a single tag, print the tag.
   * If we have more than one tag and if condensed,
   * prints the number of tags: ie, "4 tags"; or, if expanded,
   * shows a full textual representation of tags: "tag1, tag2, tag3"
   */
  render: function render() {
    var _this = this;

    var wrapped = '';
    var tagListItems = [];

    var len = this.props.tags.length;
    if (len === 1) {
      wrapped = _react2.default.createElement(
        'button',
        { className: 'tags__tag', onClick: function onClick(event) {
            return _this.onTagClick(event, _this.props.tags[0]);
          } },
        this.props.tags
      );
    } else if (len > 1) {
      wrapped = this.props.condensed ? _react2.default.createElement(
        'button',
        { className: 'tags__tag' },
        len.toString() + ' tags'
      ) : _react2.default.createElement(
        'ul',
        { className: 'tags__list' },
        this.buildTagList()
      );
    }

    return _react2.default.createElement(
      'div',
      { className: 'tags__wrapper' },
      wrapped
    );
  },
  buildTagList: function buildTagList() {
    var _this2 = this;

    return this.props.tags.map(function (tag, i, arr) {

      var maybeComma = i === arr.length - 1 ? '' : ',';
      return _react2.default.createElement(
        'li',
        { key: 'tag' + ':' + i, className: 'tags__list expanded' },
        _react2.default.createElement(
          'button',
          { className: 'tags__tag', onClick: function onClick(event) {
              return _this2.onTagClick(event, tag);
            } },
          tag
        ),
        maybeComma
      );
    });
  }
});

exports.default = Tags;
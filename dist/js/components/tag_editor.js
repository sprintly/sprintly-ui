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
 * TagEditor element provides interface for adding and removing item tags.
 * Used throughout app in tandem with Tags element.
 * Model id prop is optional, though if you're editing tags on an item,
 * you'll probably want to pass those in.
 */

var TagEditor = _react2.default.createClass({
  displayName: 'TagEditor',


  propTypes: {
    modelId: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number),
    readOnly: _react2.default.PropTypes.bool,
    tags: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string).isRequired,
    tagChanger: _react2.default.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      modelId: null,
      readOnly: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      value: '',
      showMenu: false
    };
  },
  handleClickOutside: function handleClickOutside(event) {
    event.stopPropagation();

    this.setState({
      showMenu: false
    });
  },
  handleEditClick: function handleEditClick(event) {
    event.stopPropagation();

    if (this.props.readOnly || !this.props.tagChanger) {
      return;
    }

    var showMenu = this.state.showMenu ? false : true;
    this.setState({
      showMenu: showMenu
    });
  },
  handleRemoveClick: function handleRemoveClick(event, tag) {
    event.stopPropagation();

    if (this.props.readOnly || !this.props.tagChanger) {
      return;
    }
    this.props.tagChanger.addOrRemove(this.props.modelId, this.props.tags, tag, 'remove');

    // Close popup if we've just removed our last tag
    if (this.props.tags.length === 1) {
      this.setState({
        showMenu: false
      });
    }
  },
  handleChange: function handleChange(event) {
    this.setState({
      value: event.target.value
    });
  },


  onFormSubmit: function onFormSubmit(event) {
    event.preventDefault();

    if (this.props.readOnly || !this.props.tagChanger) {
      return;
    }

    var tag = this.state.value;
    this.props.tagChanger.addOrRemove(this.props.modelId, this.props.tags, tag, 'add');

    // Close popup if we've just added our first tag
    var newState = { value: '' };
    if (this.props.tags.length < 1) {
      newState.showMenu = false;
    }

    this.setState(newState);
  },

  render: function render() {
    var tagsLength = this.props.tags.length;
    var addTagText = tagsLength ? '' : 'Add a tag.';
    var tagEditMenu = this.state.showMenu ? _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        { className: 'tag_editor__menu' },
        _react2.default.createElement(
          'form',
          { onSubmit: this.onFormSubmit },
          _react2.default.createElement('input', {
            type: 'text',
            placeholder: 'Add a tag',
            value: this.state.value,
            className: 'add-tag',
            onChange: this.handleChange
          })
        ),
        _react2.default.createElement(
          'ul',
          { className: 'tag_editor__list' },
          this.buildTagList()
        )
      )
    ) : '';

    return _react2.default.createElement(
      'div',
      { className: 'tag_editor__wrapper', key: this.props.modelId },
      _react2.default.createElement(
        'button',
        { className: 'tag_editor__tag', onClick: this.handleEditClick },
        _react2.default.createElement('i', { className: 'tag_editor__edit_icon' }),
        addTagText
      ),
      tagEditMenu
    );
  },
  buildTagList: function buildTagList() {
    var _this = this;

    return this.props.tags.map(function (tag) {
      return _react2.default.createElement(
        'li',
        { className: 'tag_editor__wrapper in-menu', key: _this.props.modelId + ':' + tag },
        _react2.default.createElement(
          'button',
          { className: 'tag_editor__tag', onClick: function onClick(event) {
              return _this.handleRemoveClick(event, tag);
            } },
          _react2.default.createElement('i', { className: 'tag_editor__delete_icon' })
        ),
        tag
      );
    });
  }
});

exports.default = (0, _reactClickOutside2.default)(TagEditor);
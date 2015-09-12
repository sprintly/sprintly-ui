var React = window.React || require('react/addons');
var _ = require('lodash');
var onClickOutside = require('@sprintly/react-onclickoutside');

/*
 * TagEditor element provides interface for adding and removing item tags.
 * Used throughout app in tandem with Tags element.
 * Model id prop is optional, though if you're editing tags on an item,
 * you'll probably want to pass those in.
 */

var TagEditor = React.createClass({

  propTypes: {
    modelId: React.PropTypes.arrayOf(React.PropTypes.number),
    readOnly: React.PropTypes.bool,
    tags: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    tagChanger: React.PropTypes.object
  },

  mixins: [
    onClickOutside
  ],

  getDefaultProps: function() {
    return {
      modelId: null,
      readOnly: false
    };
  },

  getInitialState: function() {
    return {
      value: '',
      showMenu: false
    };
  },

  handleClickOutside: function(ev) {
    ev.stopPropagation();
    this.setState({
      showMenu: false
    });
  },

  handleEditClick: function(ev) {
    ev.stopPropagation();
    if (this.props.readOnly || !this.props.tagChanger) {
      return;
    }

    var showOrHide = this.state.showMenu ? false : true;

    this.setState({
      showMenu: showOrHide
    });
  },

  handleRemoveClick: function(tag, ev) {
    ev.stopPropagation();
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

  handleChange: function(ev) {
    this.setState({
      value: ev.target.value
    });
  },

  onFormSubmit: function(ev) {
    ev.preventDefault();
    if (this.props.readOnly || !this.props.tagChanger) {
      return;
    }

    var tag = this.state.value;
    this.props.tagChanger.addOrRemove(this.props.modelId, this.props.tags, tag, 'add');

    // Close popup if we've just added our first tag
    var newState = {value: ''};
    if (this.props.tags.length < 1) {
      newState.showMenu = false;
    }

    this.setState(newState);
  },

  render: function() {
    var tagsLength = this.props.tags.length;
    var addTagText = tagsLength ? null : 'Add a tag.';
    var tagEditMenu = this.state.showMenu ?
      (
        <div>
          <div className='tag_editor__menu'>
            <form onSubmit={this.onFormSubmit}>
              <input
                type='text'
                placeholder='Add a tag'
                value={this.state.value}
                className='add-tag'
                onChange={this.handleChange}
              />
            </form>
            <ul className='tag_editor__list'>
              {this.buildTagList()}
            </ul>
          </div>
        </div>
      ) : null;

    return (
      <div className='tag_editor__wrapper' key={this.props.modelId}>
        <button className='tag_editor__tag' onClick={this.handleEditClick}>
          <i className='tag_editor__edit_icon' />
          {addTagText}
        </button>
        {tagEditMenu}
      </div>
    );
  },

  buildTagList: function() {
    return this.props.tags.map(function(tag) {
      return (
        <li className='tag_editor__wrapper in-menu' key={this.props.modelId + ':' + tag}>
          <button className='tag_editor__tag' onClick={_.partial(this.handleRemoveClick, tag)}>
            <i className='tag_editor__delete_icon' />
          </button>
          {tag}
        </li>
      );
    });
  }
});

module.exports = TagEditor;

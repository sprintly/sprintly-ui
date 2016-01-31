import React from 'react';
import clickOutsideWrapper from 'react-click-outside';

/*
 * TagEditor element provides interface for adding and removing item tags.
 * Used throughout app in tandem with Tags element.
 * Model id prop is optional, though if you're editing tags on an item,
 * you'll probably want to pass those in.
 */

const TagEditor = React.createClass({

  propTypes: {
    modelId: React.PropTypes.arrayOf(React.PropTypes.number),
    readOnly: React.PropTypes.bool,
    tags: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    tagChanger: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      modelId: null,
      readOnly: false
    };
  },

  getInitialState() {
    return {
      value: '',
      showMenu: false
    };
  },

  handleClickOutside(event) {
    event.stopPropagation();

    this.setState({
      showMenu: false
    });
  },

  handleEditClick(event) {
    event.stopPropagation();

    if (this.props.readOnly || !this.props.tagChanger) {
      return;
    }

    let showMenu = this.state.showMenu ? false : true;
    this.setState({
      showMenu: showMenu
    });
  },

  handleRemoveClick(event, tag) {
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

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  },

  onFormSubmit: function(event) {
    event.preventDefault();

    if (this.props.readOnly || !this.props.tagChanger) {
      return;
    }

    let tag = this.state.value;
    this.props.tagChanger.addOrRemove(this.props.modelId, this.props.tags, tag, 'add');

    // Close popup if we've just added our first tag
    let newState = {value: ''};
    if (this.props.tags.length < 1) {
      newState.showMenu = false;
    }

    this.setState(newState);
  },

  render() {
    let tagsLength = this.props.tags.length;
    let addTagText = tagsLength ? '' : 'Add a tag.';
    let tagEditMenu = this.state.showMenu ?
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
      ) : '';

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

  buildTagList() {
    return this.props.tags.map((tag) => {
      return (
        <li className='tag_editor__wrapper in-menu' key={this.props.modelId + ':' + tag}>
          <button className='tag_editor__tag' onClick={(event) => { return this.handleRemoveClick(event, tag); }}>
            <i className='tag_editor__delete_icon' />
          </button>
          {tag}
        </li>
      );
    });
  }
});

export default clickOutsideWrapper(TagEditor);

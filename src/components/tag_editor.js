var React = window.React || require('react/addons');
var _ = require('lodash');
var ClickOff = require('react-onclickoutside');

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
    tagChanger: React.PropTypes.object.isRequired
  },

  mixins: [ClickOff],

  getDefaultProps: function() {
    return {
      modelId: null,
      readOnly: false
    };
  },

  getInitialState: function() {
    return {
      showMenu: false
    };
  },

  handleClickOutside: function(ev) {
    ev.stopPropagation();
    this.setState({
      showMenu: false
    });
  },

  onTagEditClick: function(ev) {
    ev.stopPropagation();
    if (this.props.readOnly) {
      return;
    }

    var showOrHide = this.state.showMenu ? false : true;

    this.setState({
      showMenu: showOrHide
    });
  },

  onFormSubmit: function(ev) {
    ev.preventDefault();
    if (this.props.readOnly) {
      return;
    }

    var input = ev.target.childNodes[0];
    var tag = input.value;

    this.props.tagChanger.addOrRemove(this.props.modelId, this.props.tags, tag, 'add');
    input.value = '';

    // Close popup if we've just added our first tag
    if (this.props.tags.length < 1) {
      this.setState({
        showMenu: false
      });
    }
  },

  onTagRemoveClick: function(ev) {
    ev.stopPropagation();
    if (this.props.readOnly) {
      return;
    }

    var tag = ev.target.parentNode.nextSibling.textContent;

    this.props.tagChanger.addOrRemove(this.props.modelId, this.props.tags, tag, 'remove');

    // Close popup if we've just removed our last tag
    if (this.props.tags.length === 1) {
      this.setState({
        showMenu: false
      });
    }
  },

  render: function() {
    var tagsLength = this.props.tags.length;
    var addTagText = tagsLength ? null : 'Add a tag.'
    var tagEditMenu = this.state.showMenu ?
      (
        <div>
          <div className='tag_editor__menu'>
            <form onSubmit={this.onFormSubmit}>
              <input type='text' className='add-tag' placeholder='Add a tag' />
            </form>
            <ul className='tag_editor__list'>
              {this.buildTagList()}
            </ul>
          </div>
        </div>
      ) : null;

    return (
      <div className='tag_editor__wrapper' key={this.props.modelId}>
        <button className='tag_editor__tag' onClick={this.onTagEditClick}>
          <i className='tag_editor__edit_icon' />
          {addTagText}
        </button>
        {tagEditMenu}
      </div>
    );
  },

  buildTagList: function() {
    return _.map(this.props.tags, function(tag) {
      return (
        <li className='tag_editor__wrapper in-menu' key={this.props.modelId + ':' + tag}>
          <button className='tag_editor__tag' onClick={this.onTagRemoveClick}>
            <i className='tag_editor__delete_icon' />
          </button>
          {tag}
        </li>
      );
    }, this);
  }
});

module.exports = TagEditor;
var React = window.React || require('react/addons');
var _ = require('lodash');
var ClickOff = require('react-onclickoutside');
var TagEditorStyles = require('../styles/tag_editor');

/*
 * TagEditor element provides interface for adding and removing item tags.
 * Used throughout app in tandem with Tags element.
 */

var TagEditor = React.createClass({
  propTypes: {
    modelId: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    tags: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    tagChanger: React.PropTypes.object.isRequired
  },

  mixins: [ClickOff, TagEditorStyles],

  getDefaultProps: function() {
    return {};
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

  onTagEditClick: function() {
    var showOrHide = this.state.showMenu ? false : true;
    this.setState({
      showMenu: showOrHide
    });
  },

  onFormSubmit: function(ev) {
    ev.preventDefault();
    var input = ev.target.childNodes[0];
    var tag = input.value;

    this.props.tagChanger.addOrRemove(this.props.modelId, tag, 'add');
    input.value = '';

    // Close popup if we've just added our first tag
    if (this.props.tags.length < 1) {
      this.setState({
        showMenu: false
      });
    }
  },

  onTagRemoveClick: function(ev) {
    var tag = ev.target.parentNode.nextSibling.textContent;
    this.props.tagChanger.addOrRemove(this.props.modelId, tag, 'remove');

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
        <div className="tag-editor-menu" style={TagEditorStyles.popup}>
          <form onSubmit={this.onFormSubmit}>
            <input type="text" placeholder="Add a tag" style={TagEditorStyles.popupInput} />
          </form>
          <ul style={TagEditorStyles.list}>
            {this.buildTagList()}
          </ul>
        </div>
      ) : null;

    return (
      <div className="tag-editor" key={this.props.modelId} style={TagEditorStyles.wrapper}>
        <button style={TagEditorStyles.tag} onClick={this.onTagEditClick}>
          <i style={TagEditorStyles.editIcon} />
          {addTagText}
        </button>
        {tagEditMenu}
      </div>
    );
  },

  buildTagList: function() {
    return _.map(this.props.tags, function(tag) {
      return (
        <li key={this.props.modelId + ':' + tag} style={TagEditorStyles.listItem}>
          <button style={TagEditorStyles.menuTag} onClick={this.onTagRemoveClick}>
            <i style={TagEditorStyles.deleteIcon} />
          </button>
          {tag}
        </li>
      );
    }, this);
  }
});

module.exports = TagEditor;
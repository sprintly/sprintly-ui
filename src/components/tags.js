var React = window.React || require('react/addons');
var _ = require('lodash');
var TagsStyles = require('../styles/tags');

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

var Tags = React.createClass({

  propTypes: {
    modelId: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    tags: React.PropTypes.arrayOf(React.PropTypes.string),
    condensed: React.PropTypes.bool,
    navigatorUtility: React.PropTypes.object,
    altOnTagClick: React.PropTypes.func
  },

  mixins: [TagsStyles],

  getDefaultProps: function() {
    return {
      tags: '',
      condensed: false
    };
  },

  getInitialState: function() {
    return {};
  },

  onTagClick: function(ev) {
    /*
     * If navigatorUtility prop passed in, will trigger navigation event to tag-filtered
     * view. Alternatively, pass in a different callback to trigger some other event.
     */
    var tag = ev.target.textContent;

    if (this.props.navigatorUtility) {
      this.props.navigatorUtility.setTagFilterAndRoute(tag);
    } else if (this.props.altOnTagClick) {
      this.props.altOnTagClick(tag);
    }
  },

  render: function() {
    /*
     * If the item has no tags, the TagEdit sibling element takes over,
     * adding the 'Add a tag.' button.
     * If we only have a single tag, print the tag.
     * If we have more than one tag and if condensed,
     * prints the number of tags: ie, "4 tags"; or, if expanded,
     * shows a full textual representation of tags: "tag1, tag2, tag3"
     */
    var wrapped = null;
    var tagListItems = [];

    var len = this.props.tags.length;
    var mId = this.props.modelId[0] + ':' + this.props.modelId[1];
    var liStyle = this.props.condensed ? TagsStyles.listItem : TagsStyles.expanded;

    if (len === 1) {
      wrapped = (
        <button style={TagsStyles.tag} onClick={this.onTagClick}>
          {this.props.tags}
        </button>
      );
    } else if (len > 1) {
      wrapped = this.props.condensed ?
        (
          <button style={TagsStyles.tag}>
            {len.toString() + ' tags'}
          </button>
        ) :
        (
          <ul style={TagsStyles.list}>
            {this.buildTagList(mId)}
          </ul>
        );
    }

    return (
      <div key={mId} style={TagsStyles.wrapper}>
        {wrapped}
      </div>
    );
  },

  buildTagList: function(modelId) {
    return _.map(this.props.tags, function(tag, i, arr) {
      var maybeComma = i === (arr.length - 1) ? null : ',';
      return (
        <li key={modelId + ':' + tag} style={TagsStyles.expanded}>
          <button style={TagsStyles.tag} onClick={this.onTagClick}>
            {tag}
          </button>{maybeComma}
        </li>
      );
    }, this);
  }
});

module.exports = Tags;
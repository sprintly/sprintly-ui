import React from 'react';

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

const Tags = React.createClass({

  propTypes: {
    tags: React.PropTypes.arrayOf(React.PropTypes.string),
    condensed: React.PropTypes.bool,
    navigatorUtility: React.PropTypes.object,
    altOnTagClick: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      tags: '',
      condensed: false
    };
  },

  /*
   * If navigatorUtility prop passed in, will trigger navigation event to tag-filtered
   * view. Alternatively, pass in a different callback to trigger some other event.
   */
  onTagClick(tag, event) {
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
  render() {
    let wrapped = '';
    let tagListItems = [];

    let len = this.props.tags.length;
    if (len === 1) {
      wrapped = (
        <button className='tags__tag' onClick={() => { return this.onTagClick(this.props.tags[0]); }}>
          {this.props.tags}
        </button>
      );
    } else if (len > 1) {
      wrapped = this.props.condensed ?
        (
          <button className='tags__tag'>
            {len.toString() + ' tags'}
          </button>
        ) :
        (
          <ul className='tags__list'>
            {this.buildTagList()}
          </ul>
        );
    }

    return (
      <div className='tags__wrapper'>
        {wrapped}
      </div>
    );
  },

  buildTagList() {
    return this.props.tags.map((tag, i, arr) => {

      let maybeComma = i === (arr.length - 1) ? '' : ',';
      return (
        <li key={'tag' + ':' + i} className='tags__list expanded'>
          <button className='tags__tag' onClick={() => { return this.onTagClick(tag); }}>
            {tag}
          </button>{maybeComma}
        </li>
      );
    });
  }
});

export default Tags;
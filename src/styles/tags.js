var _ = require('lodash');
var ButtonBase = require('./buttons');

/*
 * Tags component styles.
 */

var TagsStyles = {
  wrapper: {
    display: 'inline-block'
  },
  tag: _.extend({}, ButtonBase.base, {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }),
  list: {
    listStyleType: 'none',
    width: '100%'
  },
  expanded: {
    display: 'inline-block',
    marginRight: '4px'
  }
};

module.exports = TagsStyles;
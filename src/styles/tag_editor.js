var _ = require('lodash');
var ButtonBase = require('./base_styles/buttons');
var IconBase = require('./base_styles/icons');
var PopupBase = require('./base_styles/popups');

/*
 * TagEditor component styles.
 */

var TagEditorStyles = {
  wrapper: {
    display: 'inline-block'
  },
  tag: _.extend({}, ButtonBase.base, {
    lineHeight: '19px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }),
  menuTag: _.extend({}, ButtonBase.base, {
    marginRight: '10px'
  }),
  list: {
    listStyleType: 'none',
    width: '100%'
  },
  listItem: {
    width: '100%',
    padding: '2px 10px 0 0'
  },
  editIcon: _.extend({}, IconBase.small, {
    display: 'inline-block',
    backgroundPosition: '-4px -228px',
    marginRight: '6px'
  }),
  deleteIcon: _.extend({}, IconBase.medium, {
    display: 'inline-block',
    backgroundPosition: '0 -208px',
    verticalAlign: 'middle',
    marginBottom: '2px'
  }),
  popup: PopupBase.elementMenu,
  popupInput: {
    border: '1px solid #c7c7c7',
    borderRadius: '4px',
    marginBottom: '4px',
    padding: '6px'
  }
};

module.exports = TagEditorStyles;
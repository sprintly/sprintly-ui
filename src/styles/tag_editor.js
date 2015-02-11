import _ from 'lodash';
import ButtonBase from './base_styles/buttons';
import IconBase from './base_styles/icons';
import PopupBase from './base_styles/popups';

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
    width: '100%',
    padding: '0',
    margin: '0'
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
  popup: _.extend({}, PopupBase.elementMenu, {
    marginTop: '-30px',
    marginLeft: '20px'
  }),
  popupInput: {
    border: '1px solid #c7c7c7',
    borderRadius: '4px',
    marginBottom: '4px',
    padding: '6px'
  },
  leftArrow: {
    position: 'absolute',
    borderRight: '20px solid #fff',
    borderTop: '20px solid transparent',
    borderBottom: '20px solid transparent',
    marginLeft: '8px',
    marginTop: '-30px',
    zIndex: '600'
  }
};

module.exports = TagEditorStyles;
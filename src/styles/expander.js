var _ = require('lodash');
var ButtonBase = require('./base_styles/buttons');
var IconBase = require('./base_styles/icons');

/*
 * Expander component (for tables and columns) styles.
 */

var buttonBase = _.extend({}, ButtonBase.base, {
  display: 'inline-block',
  backgroundColor: '#ffffff',
  border: '1px solid #c7c7c7',
  padding: '2px 2px 1px 3px'
});

var ExpanderStyles = {
  expand: _.extend({}, buttonBase, {
    borderTopLeftRadius: '3px',
    borderBottomLeftRadius: '3px',
    borderRight: 'none'
  }),
  condense: _.extend({}, buttonBase, {
    borderTopRightRadius: '3px',
    borderBottomRightRadius: '3px',
    borderLeft: 'none'
  }),
  active: {
    backgroundColor: '#175574',
    border: '1px solid #175574'
  },
  expandIcon: _.extend({}, IconBase.medium, {
    backgroundPosition: '0 -272px'
  }),
  condenseIcon: _.extend({}, IconBase.medium, {
    backgroundPosition: '0 -288px'
  }),
  expandIconActive: {
    backgroundPosition: '-16px -272px'
  },
  condenseIconActive: {
    backgroundPosition: '-16px -288px'
  }
};

module.exports = ExpanderStyles;
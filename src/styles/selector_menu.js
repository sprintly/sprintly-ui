var _ = require('lodash');
var IconBase = require('./base_styles/icons');

/*
 * Selector menu styles.
 * You'll probably want to set widths and icon left-position via css.
 */

var SelectorStyles = {
  wrapper: {
    position: 'absolute',
    color: '#2e2e2e',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    border: '1px solid #d3d3d3',
    borderRadius: '4px',
    overflow: 'hidden',
    zIndex: '1000'
  },
  expanded: {
    border: '1px solid #5a96ab',
    boxShadow: '0 5px 11px -4px rgba(0,0,0,0.5)'
  },
  inner: {
    display: 'none'
  },
  innerExpanded: {
    display: 'block'
  },
  input: {
    height: '30px',
    padding: '4px',
    margin: '6px',
    border: '1px solid #d3d3d3',
    borderRadius: '4px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  label: {
    display: 'block',
    width: '100%',
    height: '34px',
    lineHeight: '34px'
  },
  innerLabel: {
    display: 'block',
    padding: '0 10px'
  },
  optionInner: {
    display: 'block',
    padding: '5px 0'
  },
  icon: _.extend({}, IconBase.small, {
    position: 'absolute',
    backgroundPosition: '0 -400px',
    width: '12px',
    height: '9px',
    top: '12px'
  }),
  list: {
    width: '100%',
    listStyleType: 'none',
    paddingLeft: '0',
    margin: '0'
  },
  listItem: {
    width: '100%',
    color: '#2e2e2e',
    lineHeight: '40px',
    backgroundColor: '#fff',
    padding: '5px 0'
  },
  hovered: {
    backgroundColor: '#175574',
    color: '#fff',
    textTransform: 'none'
  },
  innerListItem: {
    paddingLeft: '10px'
  }
};

module.exports = SelectorStyles;
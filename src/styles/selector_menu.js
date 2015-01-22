var _ = require('lodash');

var SelectorStyles = {
  wrapper: {
    position: 'absolute',
    width: '282px',
    color: '#2e2e2e',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    border: '1px solid #d3d3d3',
    borderRadius: '4px',
    overflow: 'auto',
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
    width: '268px',
    height: '30px',
    padding: '4px',
    margin: '5px',
    border: '1px solid #d3d3d3',
    borderRadius: '4px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  label: {
    display: 'block',
    width: '100%',
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
  icon: {
    position: 'absolute',
    top: '13px',
    left: '290px'
  },
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
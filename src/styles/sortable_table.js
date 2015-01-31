var _ = require('lodash');
var ButtonBase = require('./base_styles/buttons');
var IconBase = require('./base_styles/icons');
var PopupBase = require('./base_styles/popups');

/*
 * Styles for SortableTable.
 * Collects styles for SortableTable and TableHeader, and TableRow
 * as used by SortableTable.
 */

var rowBase = {
  borderTop: '1px solid #d3d3d3',
  borderBottom: '1px solid #d3d3d3',
  boxSizing: 'border-box'
};

var cellWrapperBase = {
  width: '60px',
  fontSize: '12px',
  verticalAlign: 'middle',
  padding: '0 10px'
};

var SortableTableStyles = {
  table: {
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#323232',
      paddingTop: '30px',
      paddingBottom: '0'
    },
    wrapper: {
      width: '1000px',
      marginBottom: '40px',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      border: '1px solid #d3d3d3',
      borderLeft: 'none',
      borderCollapse: 'collapse',
      borderSpacing: '0',
      zIndex: '550'
    },
    thead: {
      backgroundColor: '#ffffff',
      border: '1px solid #c7c7c7'
    },
    tbody: {}
  },
  head: {
    row: rowBase,
    label: {
      WebkitUserSelect: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      lineHeight: '35px',
      color: '#323232',
      borderLeft: '1px solid #d3d3d3',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      paddingLeft: '10px',
      paddingRight: '10px'
    },
    button: ButtonBase.base
  },
  row: {
    story: _.extend({}, rowBase, {
      backgroundColor: '#e4efcf'
    }),
    task: _.extend({}, rowBase, {
      backgroundColor: '#f0f0ec'
    }),
    test: _.extend({}, rowBase, {
      backgroundColor: '#ebf7fa'
    }),
    defect: _.extend({}, rowBase, {
      backgroundColor: '#f8e6e6'
    }),
    spacer: {
      width: '100%',
      height: '4px'
    },
    expanded: {
      minHeight: '30px'
    },
    matched: {
      borderLeft: '6px solid #84b431'
    },
    nonMatching: {
      borderLeft: '6px solid #84b431',
      opacity: '0.6'
    }
  },
  cell: {
    base: {
      borderLeft: '1px solid #d3d3d3',
      boxSizing: 'border-box'
    },
    condensed: _.extend({}, cellWrapperBase, {
      lineHeight: '32px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    }),
    expanded: _.extend({}, cellWrapperBase, {
      lineHeight: '19px',
      padding: '8px 10px'
    }),
    borderCorrection: {
      padding: '0 8px'
    },
    narrow: {
      width: '20px'
    },
    wide: {
      width: '50px'
    },
    wider: {
      width: '90px'
    },
    widest: {
      width: '375px'
    },
    link: {
      color: '#323232'
    },
    linkHover: {
      color: '#323232',
      textDecoration: 'underline'
    },
    subitemArrow: _.extend({}, IconBase.medium, {
      float: 'left',
      backgroundPosition: '0 -335px',
      marginTop: '6px'
    }),
    subitemArrowExpanded: {
      marginTop: '0'
    }
  }
};

module.exports = SortableTableStyles;
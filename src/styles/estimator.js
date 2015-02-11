import _ from 'lodash';
import ButtonBase from './base_styles/buttons';
import PopupBase from './base_styles/popups';

/*
 * Estimator component styles.
 */

var button = _.extend({}, ButtonBase.base, {
  width: '22px',
  height: '22px',
  fontSize: '11px',
  color: '#ffffff',
  lineHeight: '19px',
  textAlign: 'center',
  border: 'none',
  borderRadius: '11px',
  marginLeft: '3px'
});

var EstimatorStyles = {
  list: {
    listStyleType: 'none',
    width: '100%',
    height: '28px',
    padding: '0',
    margin: '0'
  },
  score: {
    wrapper: {
      display: 'inline-block',
      marginLeft: '4px',
      marginBottom: '2px'
    },
    story: _.extend({}, button, {
      backgroundColor: '#84b431'
    }),
    task: _.extend({}, button, {
      backgroundColor: '#454545'
    }),
    test: _.extend({}, button, {
      backgroundColor: '#5a96ab'
    }),
    defect: _.extend({}, button, {
      backgroundColor: '#d94949'
    })
  },
  menu: _.extend({}, PopupBase.elementMenu, {
    display: 'inline-block',
    lineHeight: '19px',
    padding: '6px 10px 0px 7px',
    marginTop: '-30px',
    marginLeft: '40px'
  }),
  leftArrow: {
    position: 'absolute',
    borderRight: '12px solid #fff',
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    marginLeft: '32px',
    marginTop: '-30px',
    zIndex: '600'
  }
};

export default EstimatorStyles;
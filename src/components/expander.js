import React from 'react/addons';
import _ from 'lodash';
import Styles from '../styles/expander';

/*
 * Buttons for toggling the expanded/condensed state of
 * column items and table rows.
 */

var Expander = React.createClass({

  propTypes: {
    expanded: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
  },

  mixins: [Styles],

  getDefaultProps: function() {
    return {
      expanded: 'condensed'
    };
  },

  getInitialState: function() {
    // We'll use state to dump repeat clicks on the same button
    return {
      expandOrCondense: this.props.expanded
    };
  },

  onExpanderClick: function(expandOrCondense, ev) {
    ev.stopPropagation();

    if (expandOrCondense === this.state.expandOrCondense) {
      return;
    }

    this.setState({expandOrCondense: expandOrCondense});
    this.props.onClick(expandOrCondense);
  },

  render: function() {
    var className = "expander " + this.props.expanded;

    var condenseButton = Styles.condense;
    var condenseIcon = Styles.condenseIcon;
    var expandButton = Styles.expand;
    var expandIcon = Styles.expandIcon;

    if (this.props.expanded === 'condensed') {
      condenseButton = _.extend({}, condenseButton, Styles.active);
      condenseIcon = _.extend({}, condenseIcon, Styles.condenseIconActive);
    } else {
      expandButton = _.extend({}, expandButton, Styles.active);
      expandIcon = _.extend({}, expandIcon, Styles.expandIconActive);
    }

    return (
      <div className={className}>
        <button className="expanded" style={expandButton} onClick={_.partial(this.onExpanderClick, 'expanded')}>
          <i style={expandIcon}></i>
        </button>
        <button className="condensed" style={condenseButton} onClick={_.partial(this.onExpanderClick, 'condensed')}>
          <i style={condenseIcon}></i>
        </button>
      </div>
    );
  }
});

export default Expander;
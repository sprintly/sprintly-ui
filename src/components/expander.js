var React = window.React || require('react/addons');
var _ = require('lodash');
var ExpanderStyles = require('../styles/expander');

/*
 * Buttons for toggling the expanded/condensed state of
 * column items and table rows.
 */

var Expander = React.createClass({

  propTypes: {
    expanded: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
  },

  mixins: [ExpanderStyles],

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

  onExpanderClick: function(ev) {
    ev.stopPropagation();
    var expandOrCondense = ev.currentTarget.className;

    if (expandOrCondense === this.state.expandOrCondense) {
      return;
    }

    this.setState({expandOrCondense: expandOrCondense});
    this.props.onClick(expandOrCondense);
  },

  render: function() {
    var className = "expander " + this.props.expanded;

    var condenseButton = ExpanderStyles.condense;
    var condenseIcon = ExpanderStyles.condenseIcon;
    var expandButton = ExpanderStyles.expand;
    var expandIcon = ExpanderStyles.expandIcon;

    if (this.props.expanded === 'condensed') {
      condenseButton = _.extend({}, condenseButton, ExpanderStyles.active);
      condenseIcon = _.extend({}, condenseIcon, ExpanderStyles.condenseIconActive);
    } else {
      expandButton = _.extend({}, expandButton, ExpanderStyles.active);
      expandIcon = _.extend({}, expandIcon, ExpanderStyles.expandIconActive);
    }

    return (
      <div className={className}>
        <button className="expanded" style={expandButton} onClick={this.onExpanderClick}>
          <i style={expandIcon}></i>
        </button>
        <button className="condensed" style={condenseButton} onClick={this.onExpanderClick}>
          <i style={condenseIcon}></i>
        </button>
      </div>
    );
  }
});

module.exports = Expander;
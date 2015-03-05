var React = window.React || require('react/addons');
var _ = require('lodash');

/*
 * Buttons for toggling the expanded/condensed state of
 * column items and table rows.
 */

var Expander = React.createClass({

  propTypes: {
    expanded: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
  },

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
    var expanded = this.props.expanded === 'expanded';

    var buttonClass = 'expander__button';
    var iconClass = 'expander__icon';

    return (
      <div className={'expander ' + this.props.expanded}>
        <button className={buttonClass + (expanded ? ' expand active' : ' expand')} onClick={_.partial(this.onExpanderClick, 'expanded')}>
          <i className={iconClass + (expanded ? ' expand active' : 'expand')}></i>
        </button>
        <button className={buttonClass + (!expanded ? ' condense active' : ' condense')} onClick={_.partial(this.onExpanderClick, 'condensed')}>
          <i style={iconClass + (!expanded ? ' condense active' : ' condense')}></i>
        </button>
      </div>
    );
  }
});

module.exports = Expander;
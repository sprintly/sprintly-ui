import React from 'react';

/*
 * Buttons for toggling the expanded/condensed state of
 * column items and table rows.
 */

const Expander = React.createClass({

  propTypes: {
    expanded: React.PropTypes.bool,
    onExpanderClick: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      expanded: false
    };
  },

  render() {
    let expanded = this.props.expanded;
    let className = expanded ? 'expanded' : 'condensed';

    let buttonClass = 'expander__button';
    let iconClass = 'expander__icon';

    return (
      <div className={'expander ' + className}>
        <button
          className={buttonClass + (expanded ? ' expand active' : ' expand')}
          onClick={(event) => { return this.props.onExpanderClick(event, true); }}>
          <i className={iconClass + (expanded ? ' expand active' : ' expand')} />
        </button>
        <button
          className={buttonClass + (!expanded ? ' condense active' : ' condense')}
          onClick={(event) => { return this.props.onExpanderClick(event, false); }}>
          <i className={iconClass + (!expanded ? ' condense active' : ' condense')} />
        </button>
      </div>
    );
  }
});

export default Expander;
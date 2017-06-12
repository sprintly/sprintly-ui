import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

/*
 * Buttons for toggling the expanded/condensed state of
 * column items and table rows.
 */

const Expander = createReactClass({

  propTypes: {
    expanded: PropTypes.bool,
    onExpanderClick: PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      expanded: false
    };
  },

  render: function() {
    const expanded = this.props.expanded;
    const className = expanded ? 'expanded' : 'condensed';

    const buttonClass = 'expander__button';
    const iconClass = 'expander__icon';

    return (
      <div className={'expander ' + className}>
        <button
          className={buttonClass + (expanded ? ' expand active' : ' expand')}
          onClick={_.partial(this.props.onExpanderClick, true)}>
          <i className={iconClass + (expanded ? ' expand active' : ' expand')} />
        </button>
        <button
          className={buttonClass + (!expanded ? ' condense active' : ' condense')}
          onClick={_.partial(this.props.onExpanderClick, false)}>
          <i className={iconClass + (!expanded ? ' condense active' : ' condense')} />
        </button>
      </div>
    );
  }
});

export default Expander;

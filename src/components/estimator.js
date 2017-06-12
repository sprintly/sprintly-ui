import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from '@sprintly/react-onclickoutside';
import createReactClass from 'create-react-class';

/*
 * Estimator element displays item score that, when clicked, opens a menu
 * for editing the current score. Expects an estimate changer utility object
 * containing a changeScore method for handling score changing on the model
 * and syncing any changes with the backend.
 */

const Estimator = createReactClass({
  ALL_ESTIMATES: [0, 1, 3, 5, 8],

  ESTIMATE_HASH: {
    0: '?',
    1: 'S',
    3: 'M',
    5: 'L',
    8: 'XL'
  },

  mixins: [
    onClickOutside
  ],

  propTypes: {
    modelId: PropTypes.arrayOf(PropTypes.number),
    readOnly: PropTypes.bool,
    itemType: PropTypes.string.isRequired,
    score: PropTypes.string.isRequired,
    estimateChanger: PropTypes.object
  },

  getDefaultProps: function() {
    return {
      modelId: null,
      readOnly: false
    };
  },

  getInitialState: function() {
    return {
      menuOpen: false
    };
  },

  handleClickOutside: function(ev) {
    ev.stopPropagation();

    this.setState({
      menuOpen: false
    });
  },

  onScoreClick: function() {
    if (this.props.readOnly || !this.props.estimateChanger) {
      return;
    }

    const openOrClose = this.state.menuOpen === false ? true : false;

    this.setState({
      menuOpen: openOrClose
    });
  },

  onScoreChange: function(ev) {
    if (this.props.readOnly || !this.props.estimateChanger) {
      return;
    }

    const newScore = parseInt(ev.target.getAttribute('data-score'), 10);

    if (this.props.score === this.ESTIMATE_HASH[newScore].toLowerCase()) {
      return;
    }

    this.props.estimateChanger.changeScore(this.props.modelId, newScore);
    this.setState({
      menuOpen: false
    });
  },

  render: function() {
    const currentScore = this.props.score === '~' ? '?' : this.props.score;
    let scoreMenu = null;

    if (this.state.menuOpen) {
      const scores = this.ALL_ESTIMATES.map(function(score) {
        return (
          <li key={score} className='estimator__score'>
            <button className={'estimator__button ' + this.props.itemType}
              data-score={score}
              onClick={this.onScoreChange}>
              {this.ESTIMATE_HASH[score]}
            </button>
          </li>
        );
      }.bind(this));

      scoreMenu = (
        <div className='estimator__menu'>
          <ul className='estimator__list'>
            {scores}
          </ul>
        </div>
      );
    }

    return (
      <div className='estimator__score'>
        <button className={'estimator__button ' + this.props.itemType}
          onClick={this.onScoreClick}>
          {currentScore}
        </button>
        {scoreMenu}
      </div>
    );
  }
});

export default Estimator;

import React from 'react';
/*
 * Estimator element displays item score that, when clicked, opens a menu
 * for editing the current score. Expects an estimate changer utility object
 * containing a changeScore method for handling score changing on the model
 * and syncing any changes with the backend.
 */

const Estimator = React.createClass({
  ALL_ESTIMATES: [0, 1, 3, 5, 8],

  ESTIMATE_HASH: {
    0: '?',
    1: 'S',
    3: 'M',
    5: 'L',
    8: 'XL'
  },

  propTypes: {
    modelId: React.PropTypes.arrayOf(React.PropTypes.number),
    readOnly: React.PropTypes.bool,
    itemType: React.PropTypes.string.isRequired,
    score: React.PropTypes.string.isRequired,
    estimateChanger: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      modelId: null,
      readOnly: false
    };
  },

  getInitialState() {
    return {
      menuOpen: false
    };
  },

  onClickOff(event) {
    if (event.target.className === "estimator__button") {
      return;
    }

    this.setState({
      menuOpen: false
    });
  },

  onScoreClick() {
    if (this.props.readOnly || !this.props.estimateChanger) {
      return;
    }

    this.setState({
      menuOpen: !this.state.menuOpen ? true : false
    });
  },

  onScoreChange(event, newScore) {
    if (this.props.readOnly || !this.props.estimateChanger) {
      return;
    }

    if (this.props.score === this.ESTIMATE_HASH[newScore].toLowerCase()) {
      return;
    }

    this.props.estimateChanger.changeScore(this.props.modelId, newScore);
    this.setState({
      menuOpen: false
    });
  },

  render() {
    let currentScore = this.props.score === '~' ? '?' : this.props.score;
    let scoreMenu = '';

    if (this.state.menuOpen) {
      let scores = this.ALL_ESTIMATES.map((score) => {
        return (
          <li key={score} className='estimator__score'>
            <button
              className={'estimator__button ' + this.props.itemType}
              onClick={(event) => { return this.onScoreChange(event, score); }}>
              {this.ESTIMATE_HASH[score]}
            </button>
          </li>
        );
      });

      scoreMenu = (
        <div className='estimator__menu'>
          <ul className='estimator__list'>
            {scores}
          </ul>
        </div>
      );
    }

    return (
      <div>
        <div className='estimator__score'>
          <button className={'estimator__button ' + this.props.itemType}
            onClick={this.onScoreClick}>
            {currentScore}
          </button>
          {scoreMenu}
        </div>
        {this.state.menuOpen ? (
          <div className="layer__click-off" onClick={event => this.onClickOff(event)} />
        ) : null}
      </div>
    );
  }
});

export default Estimator;

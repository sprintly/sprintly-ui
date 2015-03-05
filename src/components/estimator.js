var React = window.React || require('react/addons');
var _ = require('lodash');
var ClickOff = require('react-onclickoutside');

/*
 * Estimator element displays item score that, when clicked, opens a menu
 * for editing the current score. Expects an estimate changer utility object
 * containing a changeScore method for handling score changing on the model
 * and syncing any changes with the backend.
 */

var Estimator = React.createClass({
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
    estimateChanger: React.PropTypes.object.isRequired
  },

  mixins: [ClickOff],

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
    if (this.props.readOnly) {
      return;
    }

    var openOrClose = this.state.menuOpen === false ? true : false;

    this.setState({
      menuOpen: openOrClose
    });
  },

  onScoreChange: function(ev) {
    if (this.props.readOnly) {
      return;
    }

    var newScore = parseInt(ev.target.getAttribute('data-score'), 10);

    if (this.props.score === this.ESTIMATE_HASH[newScore].toLowerCase()) {
      return;
    }

    this.props.estimateChanger.changeScore(this.props.modelId, newScore);
    this.setState({
      menuOpen: false
    });
  },

  render: function() {
    var currentScore = this.props.score === '~' ? '?' : this.props.score;
    var scoreMenu = null;

    if (this.state.menuOpen) {
      var scores = _.map(this.ALL_ESTIMATES, function(score) {
        return (
          <li key={score} className='estimator__score'>
            <button className={'estimator__button ' + this.props.itemType}
              data-score={score}
              onClick={this.onScoreChange}>
              {this.ESTIMATE_HASH[score]}
            </button>
          </li>
        );
      }, this);

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

module.exports = Estimator;
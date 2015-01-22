var _ = require('lodash');
var React = window.React || require('react/addons');
var SelectorStyles = require('../../styles/selector_menu');

var List = React.createClass({

  propTypes: {
    optionNames: React.PropTypes.array,
    onOptionSelect: React.PropTypes.func.isRequired
  },

  mixins: [SelectorStyles],

  getDefaultProps: function() {
    return {
      optionNames: []
    };
  },

  onOptionHover: function(ev) {
    ev.stopPropagation();
    _.extend(ev.currentTarget.style, SelectorStyles.hovered);
  },

  onOptionOut: function(ev) {
    ev.stopPropagation();
    _.extend(ev.currentTarget.style, SelectorStyles.listItem);
  },

  onOptionSelect: function(ev) {
    var optionName = ev.currentTarget.textContent;
    this.props.onOptionSelect(optionName);
  },

  render: function() {
    var liStyle = SelectorStyles.listItem;

    var options = this.props.optionNames.map(function(optionName) {
      return optionName.length ? (
        <li key={optionName} className="option"
          style={liStyle}
          onMouseOver={this.onOptionHover}
          onMouseOut={this.onOptionOut}
          onClick={this.onOptionSelect}>
          <span style={SelectorStyles.innerListItem}>{optionName}</span>
        </li>
      ) : null;
    }, this);

    return (
      <ul className="options" style={SelectorStyles.list}>
        {options}
      </ul>
    );
  }
});


module.exports = List;
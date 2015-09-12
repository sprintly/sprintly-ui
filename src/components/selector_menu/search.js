var React = window.React || require('react/addons');


var Search = React.createClass({

  propTypes: {
    filterList: React.PropTypes.func.isRequired,
    processSearchInput: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      value: ''
    };
  },

  handleChange: function(ev) {
    var val = ev.target.value;

    this.setState({
      value: val
    });

    this.props.filterList(val);
  },

  maybeSubmit: function(ev) {
    var val = this.state.value;

    if (ev.which === 13 && val.length) {
      this.setState({
        value: ''
      });
      this.props.processSearchInput(val.toLowerCase());
    }
  },

  render: function() {
    return (
      <input
        className='selector__searchbox'
        type='text'
        onKeyDown={this.maybeSubmit}
        onChange={this.handleChange}
      />
    );
  }
});


module.exports = Search;

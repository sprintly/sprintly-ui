var _ = require('lodash');
var React = window.React || require('react/addons');
var TestUtils = React.addons.TestUtils;
var assert = require('chai').assert;
var sinon = require('sinon');
var Status = require('../src/components/status');

/*
 * Status element tests.(WIP)
 */

describe('Status', function() {
  it('should render item status');
  it('should not render status edit menu by default');
  it('should render a status edit menu on status click');
  it('should trigger a changeStatus method on status changer utility on other status clicked');
  it('should close the menu on status change');
  it('should close the menu if the item status icon is clicked a second time');
  it('should close the menu on clicking out of menu');
});
window._ = require('lodash');
require('es5-shim');

var chai = require('chai');
window.assert = chai.assert;

// Component tests
require('./estimator_test.js');
require('./expander_test.js');
require('./selector_menu_test.js');
require('./sortable_table_test.js');
require('./status_test.js');
require('./tag_editor_test.js');
require('./tags_test.js');

if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  window.mocha.run();
}
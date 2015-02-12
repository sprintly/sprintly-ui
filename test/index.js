import _ from 'lodash';
window._ = _;
import 'es5-shim';
import '6to5/register';

import chai from 'chai';
window.assert = chai.assert;

// Component tests
import './estimator_test.js';
import './expander_test.js';
import './selector_menu_test.js';
import './sortable_table_test.js';
import './status_test.js';
import './tag_editor_test.js';
import './tags_test.js';
import './group_and_sort_test.js';

if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  window.mocha.run();
}
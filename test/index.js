require('es5-shim');

// Menus
require('../src/js/menus/selector_menu/index_test.js');

if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  window.mocha.run();
}
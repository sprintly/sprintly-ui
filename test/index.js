require('es5-shim');

// Menus
require('./menus/selector_menu_test.js');

if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  window.mocha.run();
}
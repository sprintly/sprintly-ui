'use strict';

var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var path = require('path');
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var openPage = require('open');

/*
 *
 */
gulp.task('dev-server', function() {
  var tests = connect();
  tests.use(serveStatic('./'));
  http.createServer(tests).listen(8090);
  openPage('http://localhost:8090/examples/');
});

/*
 * Test
 */
gulp.task('test-server', function() {
  var tests = connect();
  tests.use(serveStatic('./'));
  http.createServer(tests).listen(8080);
  openPage('http://localhost:8080/test/');
});

gulp.task('test', function() {
  gulp.src('./test/index.html')
    .pipe(mochaPhantomJS({
      reporter: 'dot'
    })).
    on('error', function(err) {
      console.log("There was an error running tests: ", err.message);
    });
});

gulp.task('test-coverage', function() {
  var root = path.resolve('./test');
  gulp.src('./test/index.html')
    .pipe(mochaPhantomJS({
      path: root + 'index.html',
      phantomjs: {
        hooks: root + '/phantom_hooks'
      }
    }));
});

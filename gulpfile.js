'use strict';

var gulp = require('gulp');
var path = require('path');
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var openPage = require('open');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');

/*
 * Dev
 */

gulp.task('build', function() {
  var bundler = browserify('./src/index.js', {
    exclude: 'react',
    standalone: 'SprintlyUI',
    debug: true,
    verbose: true
  });

  return bundler.bundle()
    .pipe(source('sprintly-ui.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch', ['build'], function() {
  var bundler = watchify('./src/index.js', watchify.args);
  bundler.transform('babelify');
  bundler.on('update', rebundle);

  function rebundle() {
    return gulp.run('build');
  }
});

gulp.task('dev-server', function() {
  var tests = connect();
  tests.use(serveStatic('./'));
  http.createServer(tests).listen(8090);
  openPage('http://localhost:8090/examples/');
});

gulp.task('less', function() {
  gulp.src('./src/less/sprintly-ui.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'));
});


/*
 * Test
 */

gulp.task('build-test', function() {
  var bundler = browserify('./test/index.js', {
    debug: true,
    verbose: true
  });

  return bundler.bundle()
      .pipe(source('build.js'))
      .pipe(gulp.dest('./test/'));
});

gulp.task('watch-test', ['build-test'], function() {
  var bundler = watchify('./test/build.js', watchify.args);
  bundler.transform('babelify');
  bundler.on('update', rebundle);

  function rebundle() {
    gulp.run('build-test');
  }
});

gulp.task('test-server', function() {
  var tests = connect();
  tests.use(serveStatic('./'));
  http.createServer(tests).listen(8080);
  openPage('http://localhost:8080/test/');
});

gulp.task('test', ['build-test'], function() {
  gulp.src('./test/index.html')
    .pipe(mochaPhantomJS({
      reporter: 'dot'
    }));
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


gulp.task('default', ['test']);

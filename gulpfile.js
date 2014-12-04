'use strict';

var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

/*
 * Dev
 */

gulp.task('build', function() {
  var bundler = browserify('./src/js/index.js', {
    standalone: 'SprintlyUI',
    exclude: 'react',
    debug: true,
    verbose: true
  });

  return bundler.bundle()
    .pipe(source('sprintly-ui.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', ['build'], function() {
  var bundler = watchify('./src/js/index.js', watchify.args);
  bundler.transform('reactify');
  bundler.on('update', rebundle);

  function rebundle() {
    return gulp.run('build');
  }
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
  bundler.transform('reactify');
  bundler.on('update', rebundle);

  function rebundle() {
    gulp.run('build-test');
  }
});

gulp.task('test', function() {
  gulp.src('./test/index.html')
    .pipe(mochaPhantomJS({
      reporter: 'dot'
    }));
});

gulp.task('test-coverage', ['build-test'], function() {
  gulp.src('./test/index.html')
    .pipe(mochaPhantomJS({
      path: 'file:///Users/floraworley/Projects/sprintly_ui/sprintly-ui/test/index.html',
      phantomjs: {
        hooks: '/Users/floraworley/Projects/sprintly_ui/sprintly-ui/test/phantom_hooks'
      },
    }));
});


gulp.task('default', ['test']);
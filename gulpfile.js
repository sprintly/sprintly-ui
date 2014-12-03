'use strict';

var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var istanbul = require('gulp-istanbul');
var jsx = require('gulp-jsx');
var sourcemaps = require('gulp-sourcemaps');
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
    transform: ['reactify'],
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


gulp.task('build-test', function(cb) {
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
  var runner = gulp.src('./test/index.html')
    .pipe(mochaPhantomJS({
      reporter: 'dot'
    }));
});

gulp.task('instrument', function() {
  return gulp.src(['./src/js/**/**/*.js'])
    .pipe(jsx())
    .pipe(istanbul({
      coverageVariable: '__coverage__'
    }))
    .pipe(gulp.dest('./test/tmp/'));
});

gulp.task('test-coverage', ['instrument'], function(cb) {
  gulp.src('./test/index.html')
    .pipe(mochaPhantomJS({
      path: 'file:///Users/floraworley/Projects/sprintly_ui/sprintly-ui/test/index.html',
      phantomjs: {
        hooks: '/Users/floraworley/Projects/sprintly_ui/sprintly-ui/test/phantom_hooks'
      },
    }))
    .pipe(istanbul.writeReports())
    .on('end', cb);
});

// gulp.src('./test/build.js')
//     .pipe(sourcemaps.init())
//     .pipe(sourcemaps.write();

// gulp.task('test-coverage', ['instrument'], function() {
//   var page = require('webpage').create();
//   var coverage = gulp.run('test')
//     .pipe(page.evaluate(function() {
//       return window.__coverage__.toJSON();
//     }))
//     .pipe(source('coverage.json'))
//     .pipe(gulp.dest('./test/'));

//   return coverage;
// });

// gulp.task('test-server', function() {
//   connect.server({
//     port: 9000,
//     middleware: function(connect, opts) {
//       return [
//         ///....
//       ]
//     }
//   });
//   //run phantom tests
//   connect.serverClose();
// });

// gulp.task('browser-coverage', function() {
//   page.open('https://local.', function() {
//     page.evaluate(function() {
//       return window.coverage;
//     });
//     phantom.exit();
//   });
// });

// gulp.task('istanbul', function(cb) {
//   gulp.src(['./build/test/test.js'])
//     .pipe(istanbul())
//     .on('end', cb);
// });

// gulp.task('test-coverage', function() {
//   gulp.run('istanbul', function() {
//     gulp.src(['./build/test.js'])
//       .pipe(mocha())
//       .pipe(istanbul.writeReports({
//         dir: './coverage',
//         reporters: ['lcov'],
//         reportOpts: {dir: './coverage'}
//       }));
//   });
// });



gulp.task('default', ['test']);
var gulp = require('gulp');
var mocha = require('gulp-mocha-phantomjs');
var istanbul = require('gulp-istanbul');

JS_SRC = './src/js/**/*.js';
JS_MAIN = './src/js/index.js';
JS_TESTS = './src/js/**/*_test.js';

gulp.task('test', function() {
  return gulp.src('./test/index.html')
    .pipe(mocha({
      reporter: 'dot'
    }));
});

gulp.task('test-server', function() {
  connect.server({
    port: 8888,
    middleware: function(connect, opts) {
      return [
        ///....
      ]
    }
  });
  /// run phantom tests, etc
  connect.serverClose();
});

gulp.task('istanbul', function(cb) {
  gulp.src(['./dist/sprintly-uikit.js'])
    .pipe(istanbul())
    .on('end', cb);
});

gulp.task('test-coverage', function() {
  gulp.run('istanbul', function() {
    gulp.src(['./test/build.js'])
      .pipe(mocha())
      .pipe(istanbul.writeReports({
        dir: './coverage',
        reporters: ['lcov'],
        reportOpts: {dir: './coverage'}
      }));
  });
});




gulp.task('default', ['test']);
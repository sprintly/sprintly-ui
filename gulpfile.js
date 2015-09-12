'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var path = require('path');
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var source = require('vinyl-source-stream');
var openPage = require('open');

var browserify = require('browserify');
var istanbulify = require('browserify-istanbul');
var watchify = require('watchify');
var babelify = require('babelify');
var exorcist = require('exorcist');

var less = require('gulp-less');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

/*
 * Dev
 */
var appArgs = {
  ignore: 'sinon',
  exclude: ['react'],
  standalone: 'SprintlyUI',
  debug: true,
  verbose: true
};

var jsSrc = './src/';
var jsDest = './dist/js/';
var jsDist = 'sprintly-ui.js';
var jsMapDist = './dist/js/sprintly-ui.js.map';

function bundle(b) {
  b.transform(babelify)
    .transform(istanbulify({ignore: ["**/node_modules/**","**/test/**"]}))
    .bundle()
    .pipe(exorcist(jsMapDist))
    .pipe(source(jsDist))
    .pipe(gulp.dest(jsDest));
}

gulp.task('build', function() {
  var bundler = browserify(jsSrc, appArgs);
  bundle(bundler);
});

gulp.task('less', function() {
  gulp.src('./src/less/sprintly-ui.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('watch', function() {
  var bundler = watchify(browserify(jsSrc, _.extend({}, watchify.args, appArgs)));
  bundle(bundler);

  bundler.on('update', function() {
    return bundle(bundler);
  });
});

gulp.task('jsmin', ['build'], function() {
  gulp.src('./dist/js/sprintly-ui.js')
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('cssmin', ['less'], function() {
  gulp.src('./dist/css/sprintly-ui.css')
    .pipe(csso())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('dev-server', function() {
  var tests = connect();
  tests.use(serveStatic('./'));
  http.createServer(tests).listen(8090);
  openPage('http://localhost:8090/examples/');
});

/*
 * Test
 */

gulp.task('build-test', function() {
  var bundler = watchify(browserify('./test/index.js', _.extend({}, watchify.args, {
    debug: true,
    verbose: true
  })));

  return bundler
      .transform(babelify)
      .bundle()
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

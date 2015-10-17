// @file gulpfile.js
var gulp     = require('gulp');

//load gulp plugins

// use which 'gulp-sass' or 'gulp-compass'
// var sass     = require('gulp-sass');
var compass = require('gulp-compass');

var pleeease = require('gulp-pleeease');

var plumber  = require('gulp-plumber');
var imagemin = require('gulp-imagemin');

var webserver = require('gulp-webserver');
var open = require("gulp-open");

var cmq = require('gulp-combine-media-queries');

// sass
gulp.task('sass', function() {
    gulp.src("src/scss/**/*.scss")
      .pipe(plumber())
        .pipe(compass({
            config_file : 'config.rb',
            comments : true,
            css : 'app-dev/css/',
            sass: 'src/scss/',
            sourcemap: true
        }))
        .pipe(pleeease({
          minifier: false,
          autoprefixer: {
              browsers: ['last 4 versions']
          },
        }))
        .pipe(gulp.dest('app-dev/css/'));
});

//webserver
gulp.task('webserver', function() {
  gulp.src('app-dev/')
    .pipe(webserver({
      // host:8000,
    livereload: true,
    }));
});

//open
gulp.task('open',function(){
  var options = {
    url: 'http://localhost:8000',
    app: 'firefox'
  };
  gulp.src('app-dev/index.html')
  .pipe(open('', options));
});

//imagemin
gulp.task('imagemin', function () {
  return gulp.src(['app-dev/**/*.+(jpg|jpeg|png|gif)','!app-dev/png/**/*.png']).
    pipe(imagemin({
      optimizationLevel: 7,
    })).
    pipe(gulp.dest('dist/'));
});

//copy dist to web
gulp.task('copy', function () {
    gulp.src(['dist/**/*.+(jpg|jpeg|png|gif|svg)','!dist/png/**/','!dist/cgi-bin/**/'])
    .pipe(gulp.dest('app-dev/'));
});

//combine media queries
gulp.task('cmq', function () {
  gulp.src('app-dev/**/*.css')
    .pipe(cmq({
      log: true
    }))
    .pipe(gulp.dest('dist'));
});

//copy web to dist
gulp.task('copytodist', function () {
    gulp.src('app-dev/**/*.+(txt|html|shtml|php|js|dwt)')
    .pipe(gulp.dest('dist/'));
    gulp.src('app-dev/png/**/')
    .pipe(gulp.dest('dist/png/'));
    gulp.src('app-dev/fonts/**/')
    .pipe(gulp.dest('dist/fonts/'));
});

//watch
gulp.task('watch', function () {
    gulp.watch('app-dev/**/', ['copytodist']);
});

gulp.task('default',['watch']);
gulp.task('release',['imagemin','cmq','copytodist']);
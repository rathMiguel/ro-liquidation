// @file gulpfile.js
var gulp     = require('gulp');

//load gulp plugins

// use which 'gulp-sass' or 'gulp-compass'
// var sass     = require('gulp-sass');
var compass = require('gulp-compass');
var pleeease = require('gulp-pleeease');

var cmq = require('gulp-combine-media-queries');
var minifyCSS = require('gulp-minify-css');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var plumber  = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var frontnote = require('gulp-frontnote');

var browserSync = require("browser-sync");

var jade = require('gulp-jade');
var ejs = require("gulp-ejs");

var prettify = require('gulp-prettify');

var sequence = require('run-sequence');
var clean = require('gulp-clean');


// sass
gulp.task('sass', function() {
    return gulp.src("src/scss/**/*.scss")
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(compass({
            config_file : 'config.rb',
            comments : true,
            css : 'web/css/',
            sass: 'src/scss/'
        }))
        .pipe(pleeease({
        	minifier: false,
        	autoprefixer: {
            	browsers: ['last 2 versions']
        	},
        }))
        .pipe(gulp.dest('web/css/'))
        .pipe(browserSync.reload({stream: true}))
});

//mincss

gulp.task('mincss', function() {
    gulp.src("web/css/**/*.css")
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('cmq', function() {
    gulp.src('web/css/**/*.css')
    .pipe(cmq({
      log: true
    })).pipe(gulp.dest('dist/css/'));
});

//frontnote
gulp.task('guide', function() {
    gulp.src('src/**/*.scss')
        .pipe(frontnote({
            out: './styleguide/',
            css: '../dist/css/style.css'
        }));
});

//JavaScript minify and integration
gulp.task('js', function(){
    gulp.src('web/js/**/*.js')
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest('dist/js'));
});

//browsersync
gulp.task("sync", ['sass','jade'] , function () {
    browserSync({
        server: {
            baseDir: "web/"
        }
    });
    gulp.watch("web/", function() {
        browserSync.reload();
    });
});

//imagemin
gulp.task('imagemin', function () {
  return gulp.src('web/img/**/*.+(jpg|jpeg|png|gif)').
    pipe(imagemin({
      optimizationLevel: 7,
    })).
    pipe(gulp.dest('dist/img/'));
});

//jade
gulp.task('jade', function () {
    return gulp.src(['src/jade/*.jade','src/jade/**/*.jade','!src/jade/**/_*.jade'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(jade({
          pretty: true,
        }))
        .pipe(gulp.dest('web/'))
        .pipe(browserSync.reload({stream: true}))
});

//ejs
gulp.task("ejs", function() {s
    gulp.src(["src/ejs/**/*.ejs",'!' + "src/ejs/**/_*.ejs"])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(ejs())
        .pipe(gulp.dest('web/'))
        .pipe(browserSync.reload({stream: true}))
});

//copy web to dist
gulp.task('copytodist', function () {
    gulp.src('web/**/*.+(txt|php|js|dwt|svg|pdf)')
    .pipe(gulp.dest('dist/'));
    gulp.src('web/fonts/**/')
    .pipe(gulp.dest('dist/fonts/'));
});

// copy assets to web
// gulp.task('assetscopy', function () {
//     gulp.src('assets/common-assets/**/*.+(jpg|gif|png|svg)').pipe(gulp.dest('web/img/common/'));
// });

// clean files
// gulp.task('clean-img', function () {
//     return gulp.src( [
//         'web/img/'
//         ], {read: false} )
//     .pipe(clean());
// });

// gulp.task('clean-assets', function () {
//     return gulp.src( [
//         'assets/**/*.+(jpg|gif|png|svg)'
//         ], {read: false} )
//     .pipe(clean());
// });

//html prettify
gulp.task('prettify', function() {
  gulp.src('web/**/*.html')
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest('dist/'))
});

gulp.task('default', ['sync'] , function () {
    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch('src/jade/**/*.jade', ['jade']);
});

gulp.task('release',['imagemin','cmq','copytodist','prettify']);

'use strict';
// Dependences
const gulp = require('gulp'),
        sass = require('gulp-sass'),
        haml = require('gulp-haml'),
        sourcemaps = require('gulp-sourcemaps'),
        autoprefixer = require('gulp-autoprefixer'),
        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'),
        rigger = require('gulp-rigger'),
        rimraf = require('rimraf'),
        browserSync = require('browser-sync').create(),
        reload = browserSync.reload;

// Paths
var path = {
  build: {
        html: 'app/build/',
        js: 'app/build/js/',
        css: 'app/build/css/',
        img: 'app/build/img/',
        fonts: 'app/build/fonts/'
    },
  src: {
      html: 'app/src/*.haml',
      js: 'app/src/js/*.js',
      style: 'app/src/style/*.sass',
      img: 'app/src/img/**/*.*',
      fonts: 'app/src/fonts/**/*.*'
    },
  watch: {
    html: 'app/src/*.haml',
      js: 'app/src/js/**/*.*',
      style: 'app/src/style/**/*.*',
      img: 'app/src/img/**/*.*',
      fonts: 'app/src/fonts/**/*.*'
  },
  clean: 'build'
};

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: path.build.html
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: 'nightmare'
    });
});

// compile SASS file >> CSS
gulp.task('style', function () {
  return gulp.src(path.src.style)
      // connect sourcemaps
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded'
      })
      .on('error', sass.logError))
    // connect autoprefixer
    .pipe(autoprefixer({
        browsers: ['last 2 version'],
        cascade: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css));
});

// compile PUG files >> HTML
gulp.task('html', function() {
  return gulp.src(path.src.html)
    .pipe(haml({compiler: 'visionmedia'}))
    .pipe(gulp.dest(path.build.html))
});

// compile JS files >> into one JS
gulp.task('js', function(){
  return gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
});

// optimized img
gulp.task('image', function(){
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
});

// compile fonts
gulp.task('fonts', function(){
  gulp.src([path.src.fonts, 'node_modules/bootstrap-sass/assets/fonts/bootstrap/*.svg'])
    .pipe(gulp.dest(path.build.fonts))
});


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

// watch files compiling
gulp.task('watch', function () {
  gulp.watch([path.watch.style], ['style']);
  gulp.watch([path.watch.html], ['html']);
  gulp.watch([path.watch.js], ['js']);
  gulp.watch([path.watch.fonts], ['fonts']);
  gulp.watch([path.watch.img], ['image']);
  gulp.watch(path.build.html).on('change', reload);
});

gulp.task('build', [
    'html',
    'js',
    'style',
    'fonts',
    'image'
]);

gulp.task('default', ['build', 'watch', 'browserSync']);
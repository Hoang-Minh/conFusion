'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let browserSync = require('browser-sync');
let del = require('del');
let imagemin = require('gulp-imagemin');
let uglify = require('gulp-uglify');
let rev = require('gulp-rev');
let usemin = require('gulp-usemin');
let cleanCss = require('gulp-clean-css');
let flatmap = require('gulp-flatmap');
let htmlmin = require('gulp-htmlmin');

gulp.task('sass', function () {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});
    
gulp.task('sass:watch', function () {
    gulp.watch('./css/*.scss', ['sass']);
});
    
gulp.task('browser-sync', function () {
    var files = [
    './*.html',
    './css/*.css',
    './img/*.{png,jpg,gif}',
    './js/*.js'
    ];

    browserSync.init(files, {
    server: {
        baseDir: "./"
    }
    });

});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('copyfonts', function() {
   return gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});

// Images
gulp.task('imagemin', function() {
    return gulp.src('img/*.{png,jpg,gif}')
      .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
      .pipe(gulp.dest('dist/img'));
});

gulp.task('usemin', function() {
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
          .pipe(usemin({
              css: [ rev() ],
              html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
              js: [ uglify(), rev() ],
              inlinejs: [ uglify() ],
              inlinecss: [ cleanCss(), 'concat' ]
          }))
      }))
      .pipe(gulp.dest('dist/'));
  });

// Default task
gulp.task('default', gulp.series('browser-sync', 'sass:watch'));

gulp.task('build', gulp.series('clean', 'copyfonts', 'imagemin', 'usemin', function (done) { done(); }    
));
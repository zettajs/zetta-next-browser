var gulp = require('gulp')
  , less = require('gulp-less-sourcemap')
  , path = require('path')
  , minifyCSS = require('gulp-minify-css')
  , concat = require('gulp-concat')
  , stripDebug = require('gulp-strip-debug')
  , jshint = require('gulp-jshint')
  , uglify = require('gulp-uglify')
  , prefix = require('gulp-autoprefixer')
  , sourcemaps = require('gulp-sourcemaps')
  , liquid = require("gulp-liquid")
  , htmlmin = require('gulp-htmlmin')
  , serve = require('gulp-serve');;

gulp.task('jshint', function() {
  gulp.src('./src/js/zetta.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  gulp.src(["./src/js/zetta.js"])
    .pipe(sourcemaps.init())
      .pipe(concat('scripts.js'))
  /*  .pipe(stripDebug()) */
      .pipe(uglify({mangle:false}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/scripts'))
});

gulp.task('styles',['css'], function() {
  gulp.src('./src/styles/styles.less')
    .pipe(less({
      generateSourceMap: true, 
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./src/styles'));
});

gulp.task('css', function() {
  gulp.src(['./src/styles/pure.css',
            './src/styles/grids-responsive-min.css', 
            './src/styles/styles.css'])
    .pipe(sourcemaps.init())
      .pipe(prefix("last 2 version", "> 5%", "ie 9"))
      .pipe(concat('styles.css'))
      .pipe(minifyCSS({noAdvanced:true, keepSpecialComments: 0}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/styles'));
});
  
gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe(sourcemaps.init())
      .pipe(htmlmin({
        useShortDoctype: true
        , removeRedundantAttributes: true
      /*, collapseWhitespace: true
        , conservativeCollapse: true */
      }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
});


gulp.task('serve', serve({
    root: 'dist',
    port: 3000
}));

gulp.task('default', ['jshint','scripts', 'html', 'styles', 'serve'], function(){
  gulp.watch('./src/js/*.js', ['jshint', 'scripts']);
  gulp.watch('./src/styles/*.*', ['styles']);
  gulp.watch('./src/*.html', ['html']);
});



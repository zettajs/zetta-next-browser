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
  , htmlmin = require('gulp-htmlmin')
  , serve = require('gulp-serve')
  , fileinclude = require('gulp-file-include');;

/*
Try this instead of fileinclude
https://www.npmjs.org/package/gulp-angular-templates/
*/

gulp.task('jshint', function() {
  gulp.src('./src/js/zetta.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  gulp.src(["./src/js/zetta.js", "angular.js"])
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

gulp.task('fileinclude', function() {
  gulp.src(['./src/pages/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlmin({
        useShortDoctype: true
        , removeRedundantAttributes: true
      /*, collapseWhitespace: true
        , conservativeCollapse: true */
      }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('move', function() {
  gulp.src(['./src/images/*.*']).pipe(gulp.dest('./dist/images'));
});

gulp.task('serve', serve({
    root: 'dist',
    port: 3000
}));

gulp.task('default', ['jshint','scripts', 'styles', 'fileinclude', 'move', 'serve'], function(){
  gulp.watch('./src/js/*.js', ['jshint', 'scripts']);
  gulp.watch('./src/styles/*.*', ['styles']);
  gulp.watch(['./src/partials/*.html', './src/pages/*.html'], ['fileinclude']);
  gulp.watch('./src/images', ['move']);
});



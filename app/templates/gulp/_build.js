'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'browser-sync', 'lazypipe', 'main-bower-files', 'uglify-save-license', 'del']
});

var reload = $.browserSync.reload;

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

// ********
// options
// ********
var o       = {}

o.module    = '<%= appName %>'
o.dir       = {
  src: 'src',
  tmp: '.tmp',
  dist: 'dist'
}
o.partials  = {
  filename: 'templates.js',
  dest    : o.dir.tmpDir + '/components/templates'
}

// ********
// CSS Task
// ********
gulp.task('styles', ['wiredep'],  function () {
  return gulp.src(o.dir.src + '/**/*.css')
    <% // If a CSS preprocessor option was selected
    props.cssPreprocs.forEach( function(v,i,a) {
      switch (v.key) {

        case 'node-sass': /* If Node Sass option was selected */ %>
    .pipe(gulp.src(o.dir.src + '/**/*.scss'))
    .pipe($.if('**/*.scss', $.sass({
        style: 'expanded'
      })))

      <% case 'ruby-sass': /* If Ruby Sass option was selected */ %>
    .pipe(gulp.src(o.dir.src + '/**/*.scss'))
    .pipe($.if('**/*.scss', $.lazypipe()
      .pipe($.rubySass, {
          style: 'expanded',
          sourcemap: false // this options is ignored due to bugs in gulp-ruby-sass v.0.7.1
      })
      // remove map files created by bugs in gulp-ruby-sass v.0.7.1
    .pipe($.ignore.exclude, '**/*.map')()))

      <% case 'less': /* If LESS option was selected */ %>
    .pipe(gulp.src(o.dir.src + '/**/*.less'))
    .pipe($.if('**/*.less', $.less(
        paths: [
          'src/bower_components',
          'src/app',
          'src/components'
        ]
      )))

      <% case 'stylus': /* If Stylus option was selected */ %>
    .pipe(gulp.src(o.dir.src + '/**/*.styl'))
    .pipe($.if('**/*.styl', $.stylus()))
    <% }} ) %>

    .pipe($.autoprefixer({
      browsers: ['last 1 version']
    }))
    .on('error', handleError)
    .pipe(gulp.dest(o.dir.tmp))
    .pipe($.size())
    .pipe(reload({stream:true}));
});

// *******
// JS Task
// *******
gulp.task('scripts', function () {

  return gulp.src([o.dir.src + '/**/*.js'])
    <% // If a JavaScript preprocessor option was selected
    props.jsPreprocs.forEach( function(v,i,a) {
      switch (v.key) {

        case 'coffee': /* If CoffeeScript option was selected */ %>
    .pipe(gulp.src(o.dir.src + '/**/*.coffee'))
    .pipe($.if('**/*.coffee', $.lazypipe()
      .pipe($.coffee, {
          bare: false
        })
      .pipe(gulp.dest, o.dir.tmp)()
    ))
    <% }} ) %>

    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .on('error', handleError)
    .pipe($.size())
    .pipe(reload({stream:true}));
});

// **********
// HTML Tasks
// **********
// Process base html (files such as index.html and 404.html)
gulp.task('html:base', ['wiredep'], function () {
  return gulp.src(o.dir.src + '/*.html')
    <% // If an HTML preprocessor option was selected
    props.htmlPreprocs.forEach( function(v,i,a) {
      switch (v.key) {

        case 'jade': /* If Jade option was selected */ %>
    .pipe(gulp.src(o.dir.src + '/*.jade'))
    .pipe($.if('*.jade', $.lazypipe()
      .pipe($.jade, {
          locals: {},
          pretty: true
        })
      .pipe(gulp.dest, o.dir.tmp)()
    ))
    <% }} ) %>

    .on('error', handleError)
    .pipe($.size())
});
// Process html partials (your html templates that live in app/ and components/)
gulp.task('html:partials', function () {
  return gulp.src(o.dir.src + '/{app,components}/**/*.html')
    <% props.htmlPreprocs.forEach( function(v,i,a) { 
      switch (v.key) {

        case 'jade': %>
    .pipe(gulp.src(o.dir.src + '/{app,components}/**/*.jade'))
    .pipe($.if('**/*.jade', $.lazypipe()
      .pipe($.jade, {
          locals: {},
          pretty: true
        })
      .pipe(gulp.dest, o.dir.tmp)()
    ))
    <% }} ) %>

    .on('error', handleError)
    .pipe($.size())
});
// Convert your html partials to javascript. Only needed for distribution. This is run automatically for you when building.
gulp.task('html:partials:js', ['html:partials'], function () {
  return gulp.src([o.dir.tmp + '/{app,components}/**/*.html', o.dir.src + '/{app,components}/**/*.html'])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache(partials.filename, {module: o.module}))
    .pipe(gulp.dest(partials.dest))
    .on('error', handleError)
    .pipe($.size())
});
// Shortcut task to process all html for development with size logging and brower-sync reload.
gulp.task('html', ['html:base', 'html:partials'], function () {
  return gulp.src([o.dir.tmp + '/**/*.html', o.dir.src + '/**/*.html'])
    .pipe($.size())
    .pipe(reload({stream:true}));
});

// Build html for distribution
gulp.task('build:html', ['styles', 'scripts', 'html:base', 'html:partials:js'], function () {
  var htmlBaseFilter      = $.filter('*.html');
  var jsFilter            = $.filter('**/*.js');
  var cssFilter           = $.filter('**/*.css');
  var assets;

  return gulp.src([o.dir.tmp + '/*.html', o.dir.src + '/*.html'])
    // Inject partials
    .pipe($.inject(gulp.src(o.partials.dest + '/' + o.partials.filename), {
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false,
      addPrefix: '../'
    }))

    .pipe(assets = $.useref.assets())
    
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())

    .pipe(cssFilter)
    <% if (props.ui.key === 'bootstrap') {
      switch ((_.find(props.cssPreprocs, 'primary') || {'extension': 'css'}).extension) {
        case 'scss': %>
    .pipe($.replace('bower_components/bootstrap-sass-official/assets/fonts/bootstrap', 'fonts'))
      <% case 'less': %>
    .pipe($.replace('bower_components/bootstrap/fonts', 'fonts'))
    <% }} %>
    .pipe($.csso())
    .pipe(cssFilter.restore())

    .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())

    .pipe(htmlBaseFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlBaseFilter.restore())

    .pipe(gulp.dest(o.dir.dist))
    .on('error', handleError)
    .pipe($.size())
    .pipe(reload({stream:true}));
});

gulp.task('images', function () {
  return gulp.src(o.dir.src + '/assets/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(o.dir.dist + '/assets/images'))
    .pipe($.size())
    .pipe(reload({stream:true}));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(o.dir.dist + '/fonts'))
    .pipe($.size())
    .pipe(reload({stream:true}));
});

gulp.task('misc', function () {
  return gulp.src(o.dir.src + '/**/*.ico')
    .pipe(gulp.dest(o.dir.dist))
    .pipe($.size())
    .pipe(reload({stream:true}));
});

gulp.task('clean', function (done) {
  $.del([o.dir.tmp, o.dir.dist], done);
});

gulp.task('build', ['build:html', 'images', 'fonts', 'misc']);

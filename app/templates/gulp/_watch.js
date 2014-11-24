'use strict';

var gulp = require('gulp');

// ********
// options
// ********
o           = {}

o.dir       = {}
o.dir.src   = 'src'
o.dir.watchDir = o.dir.src

gulp.task('watch', ['styles', 'scripts', 'html'] , function () {
  var styles  = [];
  var scripts = [];
  var html    = [];

  <% [].concat(props.jsPreprocs, {'extension': 'js'}).forEach(function (v,i,a) { %>
  scripts.push(o.dir.watchDir + '/**/*.' + '<%= v.extension %>');
  <% }) %>

  <% [].concat(props.htmlPreprocs, {'extension': 'html'}).forEach(function (v,i,a) { %>
  html.push(o.dir.watchDir + '/**/*.' + '<%= v.extension %>');
  <% }) %>

  <% [].concat(props.cssPreprocs, {'extension': 'css'}).forEach(function (v,i,a) { %>
  styles.push(o.dir.watchDir + '/**/*.' + '<%= v.extension %>');
  <% }) %>

  

  gulp.watch(styles, ['styles']);
  gulp.watch(scripts, ['scripts']);
  gulp.watch(html, ['html']);
  gulp.watch(o.dir.watchDir + '/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});

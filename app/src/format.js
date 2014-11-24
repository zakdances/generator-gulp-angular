'use strict';

var files     = require('../files.json');
var path      = require('path');
var Vinyl     = require('vinyl');

var html2jade = require('html2jade');
var js2coffee = require('gulp-js2coffee');
var gulpIf    = require('gulp-if');
// var js2coffee = require('js2coffee');

module.exports = function () {
  var _       = this._;
  this.files  = files;

  var scriptPrimary = _.find(this.props.jsPreprocs, 'primary')    || {'key': 'default', 'extension': 'js'};
  var markupPrimary = _.find(this.props.htmlPreprocs, 'primary')  || {'key': 'default', 'extension': 'html'};
  var stylePrimary  = _.find(this.props.cssPreprocs, 'primary')   || {'key': 'default', 'extension': 'css'};

  // var html2Jade = function(src) {

  // };
  // var js2Jade = function(src) {

  // };
  // var indent = function(src) {

  // }



  // TODO: Use lodash to make this less ugly.
  if (scriptPrimary.extension == 'coffee') {

    this.registerTransformStream(gulpIf('**/*.js', js2coffee()));

    // _.forIn(this.files, function(v, k) {

    //   var map = _.map(v, function(v,i,a) {

    //     v = path.extname(v) == '.js' ? new Vinyl({
    //       // cwd: "../",
    //       // base: "/test/",
    //       path: v,
    //       contents: new Buffer(this.fs.read(this.templatePath(v)))
    //     }) : v;

    //     return v;
    //   }, this);



    // }, this);

  // Format JavaScript
  // if (scriptPrimary.extension == 'coffee') {
  //   js2coffee.build(jstContent, {show_src_lineno: false, single_quotes: true, indent: "    "});
  // };
  }



  // Retrieve props stored in .yo-rc.json
  if (this.skipConfig) {
    this.props = this.config.get('props');
  }

  // Format list ngModules included in AngularJS DI
  var ngModules = this.props.angularModules.map(function (module) {
    return module.module;
  });

  ngModules = _.flatten([
    ngModules,
    this.props.resource.module,
    this.props.router.module
  ]);

  this.modulesDependencies = _.chain(ngModules)
    .filter(_.isString)
    .map(function (dependency) {
      return '\'' + dependency + '\'';
    })
    .valueOf()
    .join(', ');

  // Format list techs used to generate app included in main view of sample
  var listTechs = require('../techs.json');

  var usedTechs = [
    'angular', 'browsersync', 'gulp', 'jasmine', 'karma', 'protractor',
    this.props.jQuery.name,
    this.props.ui.key
    // Get keys of chosen preprocessors and add them to the list
    ].concat([this.props.jsPreprocs, this.props.htmlPreprocs, this.props.cssPreprocs].reduce( function(p,v,i,a) {
      v.forEach( function(v,i,a) {
        p.push(v.key)
      });
      return p;
    }, []))
    .filter(function(tech) {
      return _.isString(tech) && tech !== 'default';
  });

  var techsContent = _.map(usedTechs, function(value) {
    return listTechs[value];
  });

  this.technologies = JSON.stringify(techsContent, null, 2).replace(/"/g, '\'').replace(/\n/g, '\n    ');
  this.technologiesLogoCopies = _.map(usedTechs, function(value) {
    return 'src/assets/images/' + listTechs[value].logo;
  });

  // Select partials relative to props.ui
  this.partialCopies = {};

  var navbarPartialSrc = 'src/components/navbar/__' + this.props.ui.key + '-navbar.html';
  this.partialCopies[navbarPartialSrc] = 'src/components/navbar/navbar.html';

  var routerPartialSrc = 'src/app/main/__' + this.props.ui.key + '.html';
  if(this.props.router.module !== null) {
    this.partialCopies[routerPartialSrc] = 'src/app/main/main.html';
  }

  // Compute routing relative to props.router
  switch(this.props.router.module) {
    case 'ngRoute':
      this.routerHtml = '<div ng-view></div>';
      this.routerJs = this.read('src/app/__ngroute.js', 'utf8');
      break;
    case 'ui.router':
      this.routerHtml = '<div ui-view></div>';
      this.routerJs = this.read('src/app/__uirouter.js', 'utf8');
      break;
    default:
      this.routerHtml = this.read(routerPartialSrc, 'utf8');
      this.routerHtml = this.routerHtml.replace(
        /^<div class="container">/,
        '<div class="container" ng-controller="MainCtrl">'
      );
      this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
      this.routerJs = '';
      break;
  }
  // if (this.props.router.module === 'ngRoute') {
  //   this.routerHtml = '<div ng-view></div>';
  //   this.routerJs = this.read('src/app/__ngroute.js', 'utf8');
  // } else if (this.props.router.module === 'ui.router') {
  //   this.routerHtml = '<div ui-view></div>';
  //   this.routerJs = this.read('src/app/__uirouter.js', 'utf8');
  // } else {
  //   this.routerHtml = this.read(routerPartialSrc, 'utf8');
  //   this.routerHtml = this.routerHtml.replace(
  //     /^<div class="container">/,
  //     '<div class="container" ng-controller="MainCtrl">'
  //   );

  //   this.routerHtml = this.routerHtml.replace(/\n/g, '\n    ');
  //   this.routerJs = '';
  // }

  // Format choice UI Framework
  if(this.props.ui.key === 'bootstrap' && stylePrimary.extension !== 'scss') {
    this.props.ui.name = 'bootstrap';
  }
  
  this.styleCopies = {};
  
  var styleAppSrc = 'src/app/__' + this.props.ui.key + '-index.' + stylePrimary.extension;
  this.styleCopies[styleAppSrc] = 'src/app/index.' + stylePrimary.extension;

  // ## Special case for Foundation, LESS, and Stylus: Foundation doesn't have a LESS or Stylus version so we include css
  if (((stylePrimary.extension === 'less' || stylePrimary.extension === 'styl') && this.props.ui.key === 'foundation') || stylePrimary.extension    === 'css')
  {
    this.isVendorStylesPreprocessed = false;
  } else {
    this.isVendorStylesPreprocessed = true;
  }

  if(this.isVendorStylesPreprocessed && this.props.ui.name !== null) {
    var styleVendorSource = 'src/app/__' + this.props.ui.key + '-vendor.' + stylePrimary.extension;
    this.styleCopies[styleVendorSource] = 'src/app/vendor.' + stylePrimary.extension;
  }


  
};

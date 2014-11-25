'use strict';

var files = require('../files.json');
var path  = require('path');

/* Process files */
module.exports = function () {
  var _     = this._;

  // Copy static files
  _.forEach(files.staticFiles, function(src) {
    this.fs.copy(
      this.templatePath(src),
      this.destinationPath(src)
    );
  }, this);
  
  // Copy dot files
  _.forEach(files.dotFiles, function(src) {
    this.fs.copy(
      this.templatePath(src),
      this.destinationPath('.' + src)
    );
  }, this);

  // Copy files formatted (format.js) with options selected in prompt
  _.forEach(files.technologiesLogoCopies, function(src) {
    this.fs.copy(
      this.templatePath(src),
      this.destinationPath(src)
    );
  }, this);
  _.forIn(files.partialCopies, function(value, key) {
    this.fs.copy(
      this.templatePath(value),
      this.destinationPath(key)
    );
  }, this);
  _.forIn(files.styleCopies, function(value, key) {
    this.fs.copy(
      this.templatePath(value),
      this.destinationPath(key)
    );
  }, this);

  // Create files with templates
  _.forEach(files.templates, function(dest) {
    var basename  = path.basename(dest);
    var src       = dest.replace(basename, '_' + basename);

    this.fs.copyTpl(
      this.templatePath(src),
      this.destinationPath(dest),
      this
    );
  }, this);

};

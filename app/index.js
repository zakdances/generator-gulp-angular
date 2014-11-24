'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var prompts = require('./prompts.js');

var GulpAngularGenerator = yeoman.generators.Base.extend({

  init: function () {
    // Define the appName
    this.argument('appName', {
      type: String,
      required: false
    });
    this.appName = this.appName || path.basename(process.cwd());
    this.appName = this._.camelize(this._.slugify(this._.humanize(this.appName)));
  },

  info: function () {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay(
        chalk.red('Welcome!') + '\n' +
        chalk.yellow('You\'re using the fantastic generator for scaffolding an application with Angular and Gulp!')
      ));
    }
  },

  checkYoRc: function() {
    var cb = this.async();

    if(this.config.get('props')) {
      this.prompt([{
        type: 'confirm',
        name: 'skipConfig',
        message: 'Existing ' + chalk.green('.yo-rc') + ' configuration found, would you like to use it?',
        default: true,
      }], function (answers) {
        this.skipConfig = answers.skipConfig;
        cb();
      }.bind(this));
    } else {
      cb();
    }
  },

  askQuestions: function () {
    if (this.skipConfig) {
      return ;
    }

    var done = this.async();

    this.prompt(prompts, function(props) {
      if (!props.jsPreprocs)    {props.jsPreprocs   = [];};
      if (!props.htmlPreprocs)  {props.htmlPreprocs = [];};
      if (!props.cssPreprocs)   {props.cssPreprocs  = [];};

      ['jsPrimaryPreproc', 'htmlPrimaryPreproc', 'cssPrimaryPreproc'].forEach( function(v,i,a) {
        v = props[v];
        v['primary'] = true;
        if (i == 0 && v.key != 'js') {
          props.jsPreprocs.unshift(v);
        }
        else if (i == 1 && v.key != 'html') {
          props.htmlPreprocs.unshift(v);
        }
        else if (i == 2 && v.key != 'css') {
          props.cssPreprocs.unshift(v);
        };
        delete props[a[i]];
      } );

      this.props = props;
      done();
    }.bind(this));

  },

  saveSettings: function() {
    if (this.skipConfig) {
      return ;
    }

    this.config.set('props', this.props);
    this.config.forceSave();
  },

  // Format templates using prop values
  formatProps: require('./src/format'),

  // Write files (copy, template)
  writeFiles: require('./src/write'),

  // Install dependencies
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-message']
    });
  }
});

module.exports = GulpAngularGenerator;

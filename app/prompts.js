"use strict";
var _ = require('lodash');

var whuh = [
    {
      "value": {
        "key": "node-sass",
        "extension": "scss",
        "npm": {
          "gulp-sass": "^0.7.3"
        }
      },
      "name": "Sass (Node), Node.js binding to libsass, the C version of Sass. (faster, less features)"
    },
    {
      "value": {
        "key": "ruby-sass",
        "extension": "scss",
        "npm": {
          "gulp-ruby-sass": "^0.7.1"
        }
      },
      "name": "Sass (Ruby), Original Syntactically Awesome StyleSheets. (slower, more stable, requires Ruby) WARNING: This option doesn't support souremaps due to bugs in the current version of gulp-ruby-sass (v.0.7.1)."
    },
    {
      "value": {
        "key": "less",
        "extension": "less",
        "npm": {
          "gulp-less": "^1.3.6"
        }
      },
      "name": "Less, extends the CSS language, adding features that allow variables, mixins, functions and more."
    },
    {
      "value": {
        "key": "stylus",
        "extension": "styl",
        "npm": {
          "gulp-stylus": "^1.3.4"
        }
      },
      "name": "Stylus, supporting both an indented syntax and regular CSS style."
    },
    {
      "value": {
        "key": "css",
        "extension": "css"
      },
      "name": "None, just CSS."
    }
  ];

// var fuh = function(answers) {
//     var ps = answers.stylePrimary;
//     return ps.key == this.value.key ? 'primary' : null;
//   };

// whuh.forEach( function(v,i,a) {
//     if (!v.disabled) {
//       v.disabled = fuh.bind(v);
//     }
//   } );

var prompts = [
  {
    "type": "list",
    "name": "angularVersion",
    "message": "Which version of Angular would you like?",
    "choices": [
      {
        "value": "1.3.x",
        "name": "1.3.x (latest)"
      },
      {
        "value": "1.2.x",
        "name": "1.2.x (legacy 2013-11-08)"
      }
    ]
  },
  {
    "type": "checkbox",
    "name": "angularModules",
    "message": "Which Angular modules would you like? (ngRoute and ngResource are offered later)",
    "choices": [
      {
        "value": {
          "name": "angular-animate",
          "module": "ngAnimate"
        },
        "name": "angular-animate.js (enables animation features)",
        "checked": true
      },
      {
        "value": {
          "name": "angular-cookies",
          "module": "ngCookies"
        },
        "name": "angular-cookies.js (handles cookie management)",
        "checked": true
      },
      {
        "value": {
          "name": "angular-touch",
          "module": "ngTouch"
        },
        "name": "angular-touch.js (for mobile development)",
        "checked": true
      },
      {
        "value": {
          "name": "angular-sanitize",
          "module": "ngSanitize"
        },
        "name": "angular-sanitize.js (securely parses and manipulates HTML)",
        "checked": true
      }
    ]
  },
  {
    "type": "list",
    "name": "jQuery",
    "message": "Would you like jQuery or perhaps Zepto?",
    "choices": [
      {
        "value": {
          "name": "jquery",
          "version": "2.1.x"
        },
        "name": "jQuery 2.1.x (newer version, lighter, IE9+)"
      },
      {
        "value": {
          "name": "jquery",
          "version": "1.11.x"
        },
        "name": "jQuery 1.11.x (older version, but still supports IE6, 7 and 8)"
      },
      {
        "value": {
          "name": "zeptojs",
          "version": "1.1.x"
        },
        "name": "ZeptoJS 1.1.x (light alternative, jQuery compatible)"
      },
      {
        "value": {
          "name": null,
          "version": null
        },
        "name": "None (Angular will use it's own jqLite)"
      }
    ]
  },
  {
    "type": "list",
    "name": "resource",
    "message": "Which REST resource library would you like?",
    "choices": [
      {
        "value": {
          "name": "angular-resource",
          "module": "ngResource"
        },
        "name": "ngResource, the official module for RESTful services."
      },
      {
        "value": {
          "name": "restangular",
          "version": "1.3.x",
          "module": "restangular"
        },
        "name": "Restangular, an alternative service to handle RESTful requests."
      },
      {
        "value": {
          "name": null,
          "version": null,
          "module": null
        },
        "name": "None, $http is enough!"
      }
    ]
  },
  {
    "type": "list",
    "name": "router",
    "message": "Which router would you like?",
    "choices": [
      {
        "value": {
          "name": "angular-route",
          "module": "ngRoute"
        },
        "name": "ngRoute, the official routing module."
      },
      {
        "value": {
          "name": "angular-ui-router",
          "version": "0.2.x",
          "module": "ui.router"
        },
        "name": "UI Router, flexible routing with nested views."
      },
      {
        "value": {
          "name": null,
          "version": null,
          "module": null
        },
        "name": "None"
      }
    ]
  },
  {
    "type": "list",
    "name": "ui",
    "message": "Which UI framework would you like?",
    "choices": [
      {
        "value": {
          "name": "bootstrap-sass-official",
          "version": "3.2.x",
          "key": "bootstrap"
        },
        "name": "Bootstrap, the most popular HTML, CSS, and JS framework."
      },
      {
        "value": {
          "name": "foundation",
          "version": "5.4.x",
          "key": "foundation"
        },
          "name": "Foundation, \"The most advanced responsive front-end framework in the world.\""
      },
      {
        "value": {
          "name": null,
          "version": null,
          "key": "default"
        },
        "name": "None"
      }
    ]
  },
  {
    "type": "list",
    "name": "jsPrimaryPreproc",
    "message": "Which JavaScript preprocessor would you like?. (plain JavaScript is supported for all options)",
    "choices": [
      {
        "value": {
          "key": "coffee",
          "extension": "coffee",
          "npm": {
            "gulp-coffee": "^2.2.0"
          }
        },
        "name": "CoffeeScript, a little language that compiles into JavaScript.",
      },
      {
        "value": {
          "key": "js",
          "extension": "js"
        },
        "name": "None, just JavaScript.",
      }
    ]
  },
  {
    "type": "list",
    "name": "htmlPrimaryPreproc",
    "message": "Which HTML preprocessor would you like? (plain HTML is supported for all options)",
    "choices": [
      {
        "value": {
          "key": "jade",
          "extension": "jade",
          "npm": {
            "gulp-jade": "^0.9.0"
          }
        },
        "name": "Jade, a terse and simple templating language with a strong focus on performance and powerful features.",
        "checked": true
      },
      {
        "value": {
          "key": "html",
          "extension": "html"
        },
        "name": "None, just HTML.",
      }
    ]
  },
  {
    "type": "list",
    "name": "cssPrimaryPreproc",
    "message": "Which CSS preprocessor would you like? (CSS is still supported for all options)",
    "choices": _.cloneDeep(whuh)
  },
  {
    "type": "checkbox",
    "name": "cssPreprocs",
    "message": "Add extra CSS preprocessor support? (Multiple answers accepted)",
    "choices": (function(answers) {

      var foo = _.cloneDeep(whuh);
      var p   = answers.cssPrimaryPreproc;
      
      _.remove(foo, function(v,i,a) {
        return v.value && v.value.key == 'css';
      });

      foo.forEach( function(v,i,a) {

        // var key = v.key;

        v.disabled = (function(answers) {
          // If this was selected as primary, then disable it here.
          var msg = false;
          if (p.extension == 'scss' && this.value.extension == 'scss') {
              msg = p.key + ' already chosen';
          };
          // msg = this.value.key == 'css' ? 'always supported' : msg;
          msg = p.key == this.value.key ? 'primary' : msg;
          return msg;
        }).bind(v);

      } );

      return foo;
    })
  },
  // {
  //   "type": "list",
  //   "name": "sassOptions",
  //   "message": "Which Sass engine would you like?",
  //   "when": (function(answers) {
  //     return  answers.stylePrimary.key == 'sass' ||
  //             answers.styleSecondary.filter( function(v,i,a) {
  //               return v.key == "sass";
  //             } ).length > 0 ? true : false;
  //   }),
  //   "choices": [
  //     {
  //       "value": {
  //         "key": "node-sass",
  //         "extension": "scss",
  //         "npm": {
  //           "gulp-sass": "^0.7.3"
  //         },
  //         "parent": "sass"
  //       },
  //       "name": "Sass (Node), Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass. (faster, less features)"
  //     },
  //     {
  //       "value": {
  //         "key": "ruby-sass",
  //         "extension": "scss",
  //         "npm": {
  //           "gulp-ruby-sass": "^0.7.1"
  //         },
  //         "parent": "sass"
  //       },
  //       "name": "Sass (Ruby), the original Ruby-powered Sass engine (slower, more stable, requires Ruby) WARNING: This option doesn't support souremaps due to bugs in the current version of gulp-ruby-sass (v.0.7.1)."
  //     }
  //   ]
  // },
  {
    "type": "list",
    "name": "indentationLevel",
    "message": "What level of indentation do you prefer?",
    "choices": [
      {
        "value": {
          "key"   : "space",
          "value" : 2
        },
        "name": "2 spaces."
      },
      {
        "value": {
          "key"   : "space",
          "value" : 4
        },
        "name": "4 spaces."
      },
      {
        "value": {
          "key"   : "tab",
          "value" : 1
        },
        "name": "1 tab."
      }
    ]
  }
];

module.exports = prompts;
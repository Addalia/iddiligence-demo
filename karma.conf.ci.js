// Karma configuration
var baseConfig = require('./karma.conf.js');

module.exports = function(config) {
  // Load base config
  baseConfig(config);

  // Override base config
  config.set({

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // enable / disable colors in the output (reporters and logs)
    colors: false,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'junit', 'coverage'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/scripts/**/*.js': ['coverage']
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Report results in junit xml format.
    junitReporter: {
      outputDir: 'test/reports/junit',
      outputFile: 'TEST-xunit.xml',
      useBrowserName: false
    },

    // Generate code coverage.
    coverageReporter: {
      type: 'lcov',
      dir: 'test/reports',
      subdir: 'coverage'
    }

  });
};

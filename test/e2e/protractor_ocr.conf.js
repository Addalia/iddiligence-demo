// An example configuration file.
exports.config = {
    // Using ChromeDriver directly (new)
    directConnect: true,
    // Capabilities to be passed to the webdriver instance.
    capabilities: {
    'browserName': 'chrome'
    },
    /*
     capabilities: {
     'browserName': 'chrome',
     'chromeOptions': {
     'args': ['show-fps-counter=true']
     }
     },

     capabilities: {
     'browserName': 'firefox',
     'firefox_binary': 'C:/Program Files (x86)/Mozilla Firefox_11/firefox.exe',
     'binary_': 'C:/Program Files (x86)/Mozilla Firefox_11/firefox.exe'
     },

     capabilities: {
     'browserName': 'internet explorer'
     },

     multiCapabilities: [{
     'browserName': 'firefox',
     'firefox_binary': 'C:/Program Files (x86)/Mozilla Firefox_11/firefox.exe',
     'binary_': 'C:/Program Files (x86)/Mozilla Firefox_11/firefox.exe'
     }, {
     'browserName': 'chrome',
     'chromeOptions': {
     'args': ['show-fps-counter=true']
     }
     }],
     */
    allScriptsTimeout:  45000,
    // Framework to use. Jasmine 2 is recommended.
    framework: 'jasmine2',
    // Spec patterns are relative to the current working directly when
    // protractor is called.
    // specs: ['./test/e2e/**/*_spec.js'],
    specs: ['./*_spec_ocr.js'],
    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 150000,
        isVerbose: true
    },

  onPrepare : function() {
        browser.manage().window().maximize();
    },
    // Save the test output in json format al this path.
    // The path is relative to the location of this config.
  resultJsonOutputFile: 'reports/scenarios_results_ocr.json',
  restartBrowserBetweenTests: false

};

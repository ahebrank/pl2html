#!/usr/bin/env node

var glob = require('glob');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

if ('patterndir' in argv) {
  var patternDir = argv.patterndir;
} else {
  throw new Error('Need --patterndir specified: directory containing templates and pages.');
}

if ('host' in argv) {
  var host = argv.host;
} else {
  throw new Error('Need --host specified: URL prefix for public directory.');
}

var configFile = false;
if ('config' in argv) {
  if (fs.existsSync(argv.config)) {
    configFile = argv.config;
  }
}

var globOpts = {
  ignore: [
    '**/*markup-only.html'
  ]
};

var cleanFilename = function(fn) {
  return host + '/' + fn.replace(/^.*(patterns)/, '$1');
};

var files = glob.sync(patternDir + '/*+(templates|pages)*/*.html', globOpts);
var urls = files.map(f => {
  return cleanFilename(f);
});
process.stdout.write(urls.join('\n') + '\n');

if (configFile) {
  var data = fs.readFileSync(configFile);
  var config = JSON.parse(data);  
  if (!('urls' in config)) {
    config.urls = [];
  }
  config.urls = config.urls.concat(urls);
  config.urls = config.urls.filter((v, i, a) => a.indexOf(v) === i);
  data = JSON.stringify(config);  
  fs.writeFileSync(configFile, data);
}
#!/usr/bin/env node

var glob = require('glob');

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


var globOpts = {
  ignore: [
    '**/*markup-only.html'
  ]
};

var cleanFilename = function(fn) {
  return host + '/' + fn.replace(/^.*(patterns)/, '$1');
};

var files = glob.sync(patternDir + '/*+(templates|pages)*/*.html', globOpts);
var urls = {
  'urls': files.map(f => {
            return cleanFilename(f);
          })
};
process.stdout.write(JSON.stringify(urls) + '\n');

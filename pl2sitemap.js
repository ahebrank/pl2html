#!/usr/bin/env node

var glob = require('glob');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var builder = require('xmlbuilder');

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
var urls = files.map(f => {
  return cleanFilename(f);
});

var doc = builder.create('root')
  .ele('urlset')
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
urls.forEach(url => {
  doc.ele('url')
    .ele('loc')
    .text(url);
});
doc.end({ pretty: true });

process.stdout.write(doc.toString());
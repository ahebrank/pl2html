#!/usr/bin/env node

var fs = require('fs');
var glob = require('glob');
var tidy = require('htmltidy2').tidy;

var argv = require('minimist')(process.argv.slice(2));

if ('patterndir' in argv) {
  var patternDir = argv.patterndir;
} else {
  throw new Error('Need --patterndir specified.');
}
var outDir = './parsed';
if ('outdir' in argv) {
  outDir = argv.outdir;
}
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}
var pathReplace = /\.\.\/\.\.\/(css|js|images)/g;
if ('pathreplace' in argv) {
  pathReplace = argv.pathreplace;
}

var cleanFile = function(fn) {
  var lineNumber = require('line-number');
  var fin = fs.readFileSync(fn, 'utf8');
  var start = lineNumber(fin, /Begin Pattern Lab/g);
  var end = lineNumber(fin, /End Pattern Lab/g);
  
  var removed = 0;
  var lines = fin.split("\n");
  
  if (start.length == end.length) {
    for (var i = 0; i < start.length; i++) {
      start_line = start[i].number - removed - 1;
      end_line = end[i].number - removed;
      lines.splice(start_line, end_line - start_line);
      removed += (end_line - start_line);
    }
  }
  
  var html = lines.join("\n");
  return html.replace(pathReplace, '$1');
};

var cleanFilename = function(fn) {
  var base = new String(fn).substring(fn.lastIndexOf('/') + 1);
  return base.replace(/^.*(pages|templates)\-/, '');
};

var globOpts = {
  ignore: [
    '**/*markup-only.html'
  ]
};
var lines;
var tidyOpts = {
    doctype: 'html5',
    hideComments: false,
    indent: true
};
var outFile;
glob(patternDir + '/*+(templates|pages)*/*.html', globOpts, function(er, files) {
  files.forEach(function(fn) {
    lines = cleanFile(fn);
    tidy(lines, tidyOpts, function(err, html) {
      outFile = cleanFilename(fn);
      if (err) {
        console.log(err);
        fs.writeFile(outDir + '/' + outFile, lines);
      }
      else {
        fs.writeFile(outDir + '/' + outFile, html);
      }
    });
  });
});

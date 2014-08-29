var through2 = require('through2');
var gutil = require('gulp-util');
var styledown = require('styledown');
var PluginError = gutil.PluginError;
var path = require('path');
var fs = require('fs');
var File = gutil.File;

// consts
const PLUGIN_NAME = 'gulp-styledown';

function gulpStyledown(opt) {
  'use strict';
  var firstFile = null;
  var enc = "utf8"
  var srcFiles = [];
  var inlineMode = false;

  function transform(file, encodeing, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new PluginError('gulp-styledown',  'Streaming not supported'));
    }
    if (!firstFile) {
      firstFile = file;
      enc = encodeing || enc;
    }

    srcFiles.push({
      name:file.path,
      data: file.contents.toString(enc)
    });
    callback(null);
  }

  function flush(callback) {

    var data;

    if (!opt ) {
      opt = {};
    }
    if (opt.config) {
      //TODO: Error Check
      srcFiles.push({
        name: opt.config,
        data: fs.readFileSync(opt.config, enc)
      });
    }
    if (!opt.filename) { opt.filename = 'styleguide.html';}

    try {
      data = styledown.parse(srcFiles, opt)
    } catch (err) {
      return callback(new PluginError('gulp-styledown',  'Fail to parse'));
    }

    var output = new File({
      path: path.join(firstFile.cwd, opt.filename || 'index.html'),
    });
    
    if (data) {
      output.contents = new Buffer(data);
    }
    this.push(output);
    callback();
  }
  return through2.obj(transform, flush);
}

module.exports = gulpStyledown;

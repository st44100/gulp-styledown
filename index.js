var through2 = require('through2');
var gutil = require('gulp-util');
var styledown = require('styledown');
var PluginError = gutil.PluginError;
var path = require('path');
var fs = require('fs');
var merge = require('merge');
var File = gutil.File;

const PLUGIN_NAME = 'gulp-styledown';

function gulpStyledown(opt) {
  'use strict';
  var firstFile = null;
  var enc = 'utf8'
  var srcFiles = [];
  var inlineMode = false;
  opt = merge({
    filename: 'styleguide.html'
  },opt);
  function transform(file, encodeing, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME,  'Streaming not supported'));
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

    if (opt.config) {
      //TODO: Error Check
      srcFiles.push({
        name: opt.config,
        data: fs.readFileSync(opt.config, enc)
      });
    }

    try {
      data = styledown.parse(srcFiles, opt)
    } catch (err) {
      return callback(new PluginError(PLUGIN_NAME, 'Fail to parse'));
    }

    var output = new File({
      path: path.join(firstFile.cwd, opt.filename),
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

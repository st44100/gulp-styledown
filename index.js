var through = require('through');
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
  var buffer =[];
  var data;
  var firstFile = null;

  // Write file contents to Buffer.
  function writeBuff(file) {
    if (file.isNull()) return; // ignore
    if (file.isStream()) return this.emit('error', new PluginError('gulp-styledown',  'Streaming not supported'));
    if (!firstFile) firstFile = file;

    // read to buffer
    buffer.push(file.contents.toString('utf8'));
  }

  function endBuff() {
    if (opt.config) {
      //TODO: Error Check
      buffer.push(fs.readFileSync(opt.config));
    }
    try {
      data = styledown.parse(buffer.join(''), opt)
    } catch (err) {
      return this.emit('error', new PluginError('gulp-styledown',  'Fail to parse styledown'));
    }

    if (data) {
      var file = new File({
        path: path.join(firstFile.cwd, opt.filename),
        contents: new Buffer(data)
      });
      this.emit('data', file);
    }
    this.emit('end');
  }

  return through(writeBuff, endBuff);
}

module.exports = gulpStyledown;

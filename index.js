//styledown doc/styleguide/styledown/src/**/*.md config/styledown/config.md > public/styleguide.html
// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var styledown = require('styledown');
var PluginError = gutil.PluginError;
var merge = require('merge');
var Stream = require('stream');
var path = require('path');
var BufferStreams = require('bufferstreams');
var File = gutil.File;

// consts
const PLUGIN_NAME = 'gulp-styledown';

function gulpStyledown(opt) {
  'use strict';
  /*
  defult option:
  // HTML template
  template: [
    "<!doctype html>",
    "<html>",
    "<head>",
    "<meta charset='utf-8'>",
    "<title>Styledown</title>",
    "</head>",
    "<body>",
    "</body>",
    "</html>"
  ].join("\n"),
  head: false, // Things to put into `head`
  inline: false, // Force inline mode
  body: "<div sg-content></div>", // Things to put into `body`
  prefix: 'sg', // Prefix for classnames
  indentSize: 2 // Indentation spaces
  */

  gutil.log('Style Down 1');
  var stream = Stream.Transform({objectMode: true});

  stream._transform = function(file, unuse, done) {
    gutil.log('Style Down 3');
    if(file.isNull()) {
      stream.push(file); done();
      return;
    }

    var data,
        str = file.contents.toString('utf8');

    gutil.log('try Style Down Parse');
    try {
      data = styledown.parse(str, opt)
    } catch (err) {
      gutil.log('Style Down Parse Error');
      cb(new PluginError('gulp-styledown', err));
    }
    gutil.log('Style Down Parse', data);

    // Buffers
    if(file.isBuffer()) {
      if (data) {
        file.contents = Buffer(data);
        stream.push(file);
        file.path = opt.output;
        done();
      };
    // Streams
    } else {
      file.contents = file.contents.pipe(new BufferStreams(data));
      stream.push(file);
      file.path = out.output;
      done();
    }
  };

  var buffer =[];

  function endBuff() {
    var configMd = fs.readFileSync(path.join(opt.configDirectory || '', 'config.md'));

    try {
      data = styledown.parse(buffer)
    } catch (err) {
      gutil.log('Style Down Parse Error');
      return this.emit('error', new PluginError('gulp-styledown',  'Fail to parse styledown'));
    }
    gutil.log('Style Down Parse', data);
    var dest = gutil.relative(opt.dest || './styledown.html');

    var file = new File({
      cwd: dest.cwd,
      base: destBase,
      path: dest,
      contents: new Buffer(data)
    });

  }

  // Write file contents to Buffer.
  function writeBuff(file) {
    gutil.log('start read file to buffer');
    if (file.isNull()) return; // ignore
    if (file.isStream()) return this.emit('error', new PluginError('gulp-styledown',  'Streaming not supported'));
    // read to buffer
    gutil.log('Raed file to buffer');
    buffer.push(file.contents.toString('utf8'));
  }

  gutil.log('Style Down 2');
  return through(writeBuff, endBuff);
}

// exporting the plugin main function
module.exports = gulpStyledown;

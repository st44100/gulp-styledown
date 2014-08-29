var gulpstyledown = require('../');
var styledown = require('styledown');
var should = require('should');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');

require('mocha');

function createVinyl(sassFileName, contents) {
  var base = path.join(__dirname, 'fixtures');
  var filePath = path.join(base, sassFileName);

  return new gutil.File({
    cwd: __dirname,
    base: base,
    path: filePath,
    contents: contents || fs.readFileSync(filePath)
  });
}

describe('gulp-styledown', function() {
  describe('styledown()', function() {
    var mdFilePath = path.join(__dirname, '/fixtures/styleguide.md');
    var cssFilePath = path.join(__dirname, '/fixtures/styleguide.css');

    it('should emit error when file is Stream.', function(done) {
      
      var streamFile = {
        isNull: function () { return false; },
        isStream: function () { return true; }
      };

      var stream = gulpstyledown();
      stream.on('error', function() {
        done();
      })
      .write(streamFile);
    });

    it('should create styleguide from *.md file.', function(done) {
      var md = createVinyl('styleguide.md');
      var stream = gulpstyledown();

      var opt = {};
      var contents = new Buffer(fs.readFileSync(mdFilePath));
      var expected = styledown.parse(String(contents), opt);

      stream.on('data', function(data) {
        var result = data.contents.toString();
        (result).should.equal(expected);
      });
      stream.on('end', function(data) {
        done();
      });
      stream.write(md);
      stream.end();
    });
    
    it('should create styleguide from *.css file.', function(done) {
      var md = createVinyl('styleguide.css');
      
      var opt = {};
      var stream = gulpstyledown(opt);

      var contents = new Buffer(fs.readFileSync(cssFilePath));
      var expected = styledown.parse([
        {
          name: cssFilePath,
          data: String(contents)
        }
      ], opt);

      stream.on('data', function(data) {
        var result = data.contents.toString();
        (result).should.equal(expected);
      });
      stream.on('end', function(data) {
        done();
      });
      stream.write(md);
      stream.end();
    });
    
    it('should create styleguide with options.', function(done) {
      var md = createVinyl('styleguide.md');
      var opt = {
        prefix: 'test',
        template: '<div class="test"></div>',
        head: '<head></head>',
        body: '<div test-content></div>',
        indentSize: 8
      };
      var stream = gulpstyledown(opt);

      var contents = new Buffer(fs.readFileSync(mdFilePath));
      var expected = styledown.parse(String(contents), opt);


      stream.on('data', function(data) {
        var result = data.contents.toString();
        (result).should.equal(expected);
      });
      stream.on('end', function(data) {
        done();
      });
      stream.write(md);
      stream.end();
    });
    
    it('should return null if styledown.md is empty.', function(done) {
      var md = createVinyl('styleguide.md');
      md.contents = new Buffer('');
      var opt = {};
      var stream = gulpstyledown(opt);
      var expected = styledown.parse('', opt);

      stream.on('data', function(data) {
        should(data.contents).equal(null);
      });
      stream.on('end', function(data) {
        done();
      });
      stream.write(md);
      stream.end();
    });

  });
});

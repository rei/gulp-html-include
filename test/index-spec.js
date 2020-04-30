'use strict';

var expect = require('chai').expect;
var gutil = require('gulp-util');
var include = require('../index');
var path = require('path');

var through = require('through2');

var JS_INCLUDE = '<script src="include/path/javascript.js" ></script>';
var CSS_INCLUDE = '<link href="include/path/style.css" rel="stylesheet" >';
var CSS_INCLUDE_XHTML = '<link href="include/path/style.css" rel="stylesheet" />';
var JS_ROOT = '<script src="/javascript.js" ></script>';
var CSS_ROOT = '<link href="/style.css" rel="stylesheet" >';
var CSS_ROOT_XHTML = '<link href="/style.css" rel="stylesheet" />';
var DEFAULT_JS_DEST = 'javascript.js.html';
var DEFAULT_CSS_DEST = 'style.css.html';
var LITERAL_ATTRIBUTES = {'back to school': 1986};
var JS_ROOT_WITH_LITERAL_ATTRIBUTES = '<script src="/javascript.js" back to school="1986"></script>';
var CSS_ROOT_WITH_LITERAL_ATTRIBUTES = '<link href="/style.css" rel="stylesheet" back to school="1986">';
var CSS_ROOT_XHTML_WITH_LITERAL_ATTRIBUTES = '<link href="/style.css" rel="stylesheet" back to school="1986"/>';

var out = gutil.log;

beforeEach(function () {
  gutil.log = function () {
  };
});

afterEach(function () {
  gutil.log = out;
});

describe('File Generation', function () {

  it('should generate HTML files to include JS files', function (done) {
    var stream = include({path: 'include/path'});

    stream.on('data', function (file) {
      expect(file.path).to.equal(DEFAULT_JS_DEST);
      expect(file.contents.toString()).to.equal(JS_INCLUDE);
      done();
    });

    stream.write(new gutil.File({
      path: 'javascript.js',
      contents: Buffer.from('')
    }));
  });

  it('should generate HTML files to include CSS files', function (done) {
    var stream = include({path: 'include/path'});

    stream.on('data', function (file) {
      expect(file.path).to.equal(DEFAULT_CSS_DEST);
      expect(file.contents.toString()).to.equal(CSS_INCLUDE);
      done();
    });

    stream.write(new gutil.File({
      path: 'style.css',
      contents: Buffer.from('')
    }));
  });

  it('should generate XHTML-compliant files to include CSS files', function (done) {
    var stream = include({path: 'include/path', xhtml: true});

    stream.on('data', function (file) {
      expect(file.path).to.equal(DEFAULT_CSS_DEST);
      expect(file.contents.toString()).to.equal(CSS_INCLUDE_XHTML);
      done();
    });

    stream.write(new gutil.File({
      path: 'style.css',
      contents: Buffer.from('')
    }));
  });

  it('should pass through `null` files', function (done) {
    var stream = include();

    stream.on('data', function (file) {
      expect(file.contents).to.equal(null);
      done();
    });

    stream.write(new gutil.File({
      path: 'style.css',
      contents: null
    }));
  });

  it('should throw an error when it sees a stream', function () {
    var stream = include();

    function useStream() {
      stream.write(new gutil.File({
        path: 'blah.css',
        contents: through()
      }));
    }

    expect(useStream).to.throw();
  });

  it('should pass through files that are not JS or CSS', function (done) {
    var stream = include();

    stream.on('data', function (file) {
      expect(file.path).to.equal('image.jpg');
      done();
    });

    stream.write(new gutil.File({
      path: 'image.jpg',
      contents: Buffer.from('')
    }));
  });

});

describe('Include Pathing', function () {

  it('should default the path to the root directory', function (done) {
    var stream = include();

    stream.on('data', function (file) {
      expect(file.contents.toString()).to.equal(JS_ROOT);
      done();
    });

    stream.write(new gutil.File({
      path: 'javascript.js',
      contents: Buffer.from('')
    }));
  });

  it('should default the path to the root directory for CSS files', function (done) {
    var stream = include();

    stream.on('data', function (file) {
      expect(file.contents.toString()).to.equal(CSS_ROOT);
      done();
    });

    stream.write(new gutil.File({
      path: 'style.css',
      contents: Buffer.from('')
    }));
  });

  it('should default the path to the root directory for XHTML-targeted CSS files', function (done) {
    var stream = include({xhtml: true});

    stream.on('data', function (file) {
      expect(file.contents.toString()).to.equal(CSS_ROOT_XHTML);
      done();
    });

    stream.write(new gutil.File({
      path: 'style.css',
      contents: Buffer.from('')
    }));
  });

  it('should normalize paths', function (done) {
    var stream = include({path: 'include/path'});

    stream.on('data', function (file) {
      expect(file.path).to.equal(DEFAULT_JS_DEST);
      expect(file.contents.toString()).to.equal(JS_INCLUDE);
      done();
    });

    stream.write(new gutil.File({
      path: 'javascript.js',
      contents: Buffer.from('')
    }));
  });

});

describe('Output Destinations', function () {

  it('should default the destination to the current directory', function (done) {
    var stream = include();

    stream.on('data', function (file) {
      expect(file.path).to.equal(DEFAULT_JS_DEST);
      done();
    });

    stream.write(new gutil.File({
      path: 'javascript.js',
      contents: Buffer.from('')
    }));
  });

  it('should use provided destinations', function (done) {
    var stream = include({dest: '../static/'});

    stream.on('data', function (file) {
      expect(file.path).to.equal(path.normalize('../static/javascript.js.html'));
      done();
    });

    stream.write(new gutil.File({
      path: 'javascript.js',
      contents: Buffer.from('')
    }));
  });

});

describe('Literal attributes', function () {

  it('should pass literal attributes to js tags', function (done) {
    var stream = include({passThroughAttributes: LITERAL_ATTRIBUTES});

    stream.on('data', function (file) {
      expect(file.contents.toString()).to.equal(JS_ROOT_WITH_LITERAL_ATTRIBUTES);
      done();
    });

    stream.write(new gutil.File({
      path: 'javascript.js',
      contents: Buffer.from('')
    }));
  });

  it('should pass literal attributes to style tags', function (done) {
    var stream = include({passThroughAttributes: LITERAL_ATTRIBUTES});

    stream.on('data', function (file) {
      expect(file.contents.toString()).to.equal(CSS_ROOT_WITH_LITERAL_ATTRIBUTES);
      done();
    });

    stream.write(new gutil.File({
      path: 'style.css',
      contents: Buffer.from('')
    }));
  });

  it('should pass literal attributes to xhtml style tags', function (done) {
    var stream = include({passThroughAttributes: LITERAL_ATTRIBUTES, xhtml: true});

    stream.on('data', function (file) {
      expect(file.contents.toString()).to.equal(CSS_ROOT_XHTML_WITH_LITERAL_ATTRIBUTES);
      done();
    });

    stream.write(new gutil.File({
      path: 'style.css',
      contents: Buffer.from('')
    }));
  });
});

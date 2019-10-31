'use strict';
const path = require('path');
const gutil = require('gulp-util');
const through = require('through2');
const PLUGIN_NAME = 'gulp-html-include';

function _normalizePath(input) {
  const len = input.length;
  const end = input[len - 1];
  return input + (end === '/' ? '' : '/');
}

module.exports = function (options) {
  const config = {
    dest: './',
    path: '/',
    xhtml: false
  };
  const merged = Object.assign(config, options);

  const mergedWithNormalizedPath = Object.assign(merged, {
    path: _normalizePath(merged.path),
  });

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      throw new gutil.PluginError({
        plugin: PLUGIN_NAME,
        message: 'Streaming not supported'
      });
    }

    const fileName = path.basename(file.path);
    const fileType = path.extname(fileName);
    const htmlName = fileName + '.html';
    let includeContents;
    const normalizedPath = path.join(mergedWithNormalizedPath.path, fileName);

    if (fileType === '.js') {
      includeContents = `<script src="${normalizedPath}"></script>`;
    } else if (fileType === '.css') {
      if (mergedWithNormalizedPath.xhtml) {
        includeContents = `<link href="${normalizedPath}" rel="stylesheet" />`;
      } else {
        includeContents = `<link href="${normalizedPath}" rel="stylesheet">`;
      }
    } else {
      this.push(file);
      return cb();
    }

    const htmlFile = new gutil.File({
      base: mergedWithNormalizedPath.dest,
      contents: Buffer.from(includeContents),
      path: path.join(mergedWithNormalizedPath.dest, htmlName)
    });

    this.push(htmlFile);

    gutil.log('Generating file', htmlFile.path);

    return cb();
  });
};

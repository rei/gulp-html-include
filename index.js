'use strict';
var path        = require( 'path' );
var gutil       = require( 'gulp-util' );
var through     = require( 'through2' );

var File        = gutil.File;
var PluginError = gutil.PluginError;

module.exports = function ( includePath ) {
    var includePath = includePath || './';
    includePath += includePath[ includePath.length - 1 ] === '/' ? '' : '/';

    return through.obj(function ( file, enc, cb ) {
        if ( file.isNull() ) {
            this.push( file );
            return cb();
        }

        if ( file.isStream() ) {
            throw new PluginError({
                plugin: 'gulp-include-generator',
                message: 'Streaming not supported'
            });
            return cb();
        }

        var fileName = path.basename( file.path );
        var fileType = path.extname( fileName );
        var htmlName = fileName + '.html';
        var template = fileType === '.js' ?
                       '<script src="<%= path %>"></script>' :
                       '<link href="<%= path %>" rel="stylesheet" />';

        var includeContents = _.template( template, {
            path: includePath + fileName
        });

        this.push(new File({
            contents:   new Buffer( includeContents ),
            path:       htmlName
        }));

        cb();
    });
};

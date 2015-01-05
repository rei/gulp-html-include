# gulp-html-include [![Build Status][travis-image]][travis-url]

> HTML include generator for static assets, e.g., foo.min.js => foo.min.js.html

## Usage

This plugin generates an HTML file with solely a `script` or `link` reference
to JS or CSS files passed to it, respectively. It pairs well with
[gulp-rev](https://github.com/sindresorhus/gulp-rev) and
[gulp-rename](https://github.com/hparra/gulp-rename) to make it easy to include
dynamically named static files (e.g., via
[JSP](http://en.wikipedia.org/wiki/JavaServer_Pages) `include`). Now you can
enjoy versioned files without having to manually update the references to your
generated files.

```js
gulp.src( '/path/to/my/files' )
    .pipe( rev() )
    .pipe( include() )
    .pipe( rename(function ( dir, base, ext ) {
        return base.replace( /\-[^\.]+/, '' ) + ext;
    }))
    .pipe( gulp.dest( '/path/to/web/root' ) )
```

You can optionally pass in the path to prefix these files with (e.g.,
`/static/`) and the destination directory to set as the base for these files
(e.g., `../../static/`). The default path prefix is `/`, and the default
destination directory is `./`.

```js
gulp.src( '/path/to/my/files' )
    .pipe( rev() )
    .pipe( include( { path: '/static/', dest: '../../static/' } ) )
    .pipe( rename(function ( dir, base, ext ) {
        return base.replace( /\-[^\.]+/, '' ) + ext;
    }))
    .pipe( gulp.dest( '../../static' ) )
```

By default this plugin does not use self-closing tags for the `link` reference. You can enable XHTML-compliant output by setting the `xhtml` option to `true`.

```js
gulp.src( '/path/to/my/files' )
    .pipe( rev() )
    .pipe( include( { xhtml: true } ) )
    .pipe( rename(function ( dir, base, ext ) {
        return base.replace( /\-[^\.]+/, '' ) + ext;
    }))
    .pipe( gulp.dest( '/path/to/web/root' ) )
```


## Testing

You can run the tests with [Mocha](http://visionmedia.github.io/mocha/) by
running `npm run test` in the project directory.

## License

MIT © 2014 Recreational Equipment Inc.

[travis-url]: https://travis-ci.org/reidev/gulp-html-include
[travis-image]: https://travis-ci.org/reidev/gulp-html-include.svg

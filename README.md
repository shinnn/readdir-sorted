# readdir-sorted

[![npm version](https://img.shields.io/npm/v/readdir-sorted.svg)](https://www.npmjs.com/package/readdir-sorted)
[![Build Status](https://travis-ci.org/shinnn/readdir-sorted.svg?branch=master)](https://travis-ci.org/shinnn/readdir-sorted)
[![Build status](https://ci.appveyor.com/api/projects/status/k0xmvwm4bc1qn4nl/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/readdir-sorted/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/readdir-sorted.svg)](https://coveralls.io/github/shinnn/readdir-sorted?branch=master)

Like [`fs.readdir`](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback) but sorts the result based on [`String#localeCompare()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)

```javascript
const readdirSorted = require('readdir-sorted');

(async () => {
  await readdirSorted('.'); /* => [
    '.editorconfig',
    '.gitattributes',
    '.gitignore',
    '.travis.yml',
    'index.js',
    'LICENSE',
    'package.json',
    'README.md',
    'test'
  ] */
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install readdir-sorted
```

## API

```javascript
const readdirSorted = require('readdir-sorted');
```

### readdirSorted(*path* [, *options*])

*path*: `string` `Buffer` [`URL`](https://nodejs.org/api/url.html#url_class_url) (directory path)  
*options*: `Object`  
Return: `Promise<Array<string>>`

Similar to Node.js built-in `fs.readdir`, but different in the following points:

* Returns a `Promise`
* Doesn't support `encoding` option
* The result is sorted based on `String#localeCompare()`

#### Options

`locale` property will be passed to the second argument of `String#localeCompare()`, and the rest will be used in the third argument.

```javascript
(async () => {
  await readdirSorted('/path/to/dir');
  //=> ['10', '2', 'ä', 'z']

  await readdirSorted('/path/to/dir', {
    locale: 'sv',
    numeric: true
  });
  //=> ['2', '10', 'z', 'ä']
})();
```

## License

[ISC License](./LICENSE) © 2017 - 2018 Shinnosuke Watanabe

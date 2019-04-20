# readdir-sorted

[![npm version](https://img.shields.io/npm/v/readdir-sorted.svg)](https://www.npmjs.com/package/readdir-sorted)
[![Build Status](https://travis-ci.com/shinnn/readdir-sorted.svg?branch=master)](https://travis-ci.com/shinnn/readdir-sorted)
[![codecov](https://codecov.io/gh/shinnn/readdir-sorted/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/readdir-sorted)

Like [`fs.promise.readdir()`](https://nodejs.org/api/fs.html#fs_fspromises_readdir_path_options) but sorts the result based on [`String#localeCompare()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)

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

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install readdir-sorted
```

## API

```javascript
const readdirSorted = require('readdir-sorted');
```

### readdirSorted(*path* [, *options*])

*path*: `string | Buffer | URL` (directory path)  
*options*: `Object`  
Return: `Promise<string[]|Buffer[]|fs.Dirent[]>`

It returns a result of `fs.promises.readdir()` with sorting entries based on `String#localeCompare()`.

#### Options

#### options.encoding and options.withFileTypes

Both will be passed to `fs.promises.readdir()`.

```javascript
(async () => {
  await readdirSorted('example');
  //=> ['directory', 'file.txt', 'symlink']

  await readdirSorted('example', {
    encoding: 'base64',
    withFileTypes: true
  });
  /* => [
    Dirent { name: 'ZGlyZWN0b3J5', [Symbol(type)]: 2 },
    Dirent { name: 'aW5kZXguanM=', [Symbol(type)]: 1 },
    Dirent { name: 'c3ltbGluaw==', [Symbol(type)]: 3 }
  ] */
})();
```

#### Other options

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

[ISC License](./LICENSE) © 2017 - 2019 Shinnosuke Watanabe

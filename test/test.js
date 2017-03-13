'use strict';

const {join} = require('path');

const junk = require('junk');
const readdirSorted = require('..');
const test = require('tape');

test('readdirSorted()', t => {
  t.plan(17);

  const fixtureDir = join(__dirname, 'fixtures');

  readdirSorted(fixtureDir).then(paths => {
    t.deepEqual(
      paths.filter(junk.not),
      ['10', '2', 'a.ac', 'aab'],
      'should run `readdir` with sorting the result.'
    );
  }).catch(t.fail);

  readdirSorted(fixtureDir, {
    locales: ['en'],
    ignorePunctuation: true,
    numeric: true
  }).then(paths => {
    t.deepEqual(
      paths.filter(junk.not),
      ['2', '10', 'aab', 'a.ac'],
      'should support String#localeCompare() options.'
    );
  }).catch(t.fail);

  readdirSorted('none').catch(({code}) => {
    t.strictEqual(
      code,
      'ENOENT',
      'should fail when it cannot get contents in a given path.'
    );
  });

  readdirSorted().catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a directory path (string), but got undefined.',
      'should fail when it takes no arguments.'
    );
  });

  readdirSorted(/!/).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a directory path (string), but got /!/ (regexp).',
      'should fail when the first parameter takes a non-string value.'
    );
  });

  readdirSorted('').catch(err => {
    t.strictEqual(
      err.toString(),
      'Error: Expected a directory path, but got \'\' (empty string).',
      'should fail when the first parameter takes an empty string.'
    );
  });

  readdirSorted('a', 1).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: The second argument of readdir-sorted must be a plain object, but got 1 (number).',
      'should fail when the second parameter takes an non-object value.'
    );
  });

  readdirSorted('a', {locales: new Set()}).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected `locale` option to be a string or an array of strings, but got Set {}.',
      'should fail when `locale` option is neither a string nor an array.'
    );
  });

  readdirSorted('a', {locales: ['???']}).catch(err => {
    t.strictEqual(
      err.toString(),
      'RangeError: Invalid language tag: ???',
      'should fail when `locale` option is not valid.'
    );
  });

  readdirSorted('a', {localeMatcher: new Map()}).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected `localeMatcher` option to be either \'lookup\' or \'best fit\', but got Map {}.',
      'should fail when `localeMatcher` option is not a string.'
    );
  });

  readdirSorted('a', {localeMatcher: '~'}).catch(err => {
    t.strictEqual(
      err.toString(),
      'RangeError: Value ~ out of range for collator options property localeMatcher',
      'should fail when `localeMatcher` option is not valid.'
    );
  });

  readdirSorted('a', {usage: [0, 1, 2]}).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: `usage` option is not supported, but [ 0, 1, 2 ] was provided for it.',
      'should fail when `usage` option is provided.'
    );
  });

  readdirSorted('a', {sensitivity: -0}).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected `sensitivity` option to be one of ' +
      '\'base\' or \'accent\', \'case\' and \'variant\' but got -0 (number).',
      'should fail when `sensitivity` option is not a string.'
    );
  });

  readdirSorted('a', {sensitivity: '#'}).catch(err => {
    t.strictEqual(
      err.toString(),
      'RangeError: Value # out of range for collator options property sensitivity',
      'should fail when `sensitivity` option is not valid.'
    );
  });

  readdirSorted('a', {ignorePunctuation: {}}).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected `ignorePunctuation` option to be a Boolean value, but got {} (object).',
      'should fail when `ignorePunctuation` option is not a boolean.'
    );
  });

  readdirSorted('a', {numeric: '\0'}).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected `numeric` option to be a Boolean value, but got \'\\u0000\' (string).',
      'should fail when `numeric` option is not a boolean.'
    );
  });

  readdirSorted('a', {caseFirst: Buffer.from('a')}).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected `caseFirst` option to be one of ' +
      '\'upper\', \'lower\', or \'false\', but got <Buffer 61>.',
      'should fail when `numeric` option is not a boolean.'
    );
  });
});

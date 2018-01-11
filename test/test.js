'use strict';

const {join} = require('path');
const {URL} = require('url');

const fileUrl = require('file-url');
const junk = require('junk');
const readdirSorted = require('..');
const test = require('tape');

test('readdirSorted()', async t => {
  const fixtureDir = join(__dirname, 'fixtures');

  t.deepEqual(
    (await readdirSorted(fixtureDir)).filter(junk.not),
    ['10', '2', 'a.ac', 'aab'],
    'should run `readdir` with sorting the result.'
  );

  t.deepEqual(
    (await readdirSorted(Buffer.from(fixtureDir), {
      locales: ['en'],
      ignorePunctuation: true,
      numeric: true
    })).filter(junk.not),
    ['2', '10', 'aab', 'a.ac'],
    'should support String#localeCompare() options.'
  );

  try {
    await readdirSorted(new URL(fileUrl('none')));
  } catch ({code}) {
    t.equal(
      code,
      'ENOENT',
      'should fail when it cannot get contents in a given path.'
    );
  }

  try {
    await readdirSorted();
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got no arguments.',
      'should fail when it takes no arguments.'
    );
  }

  try {
    await readdirSorted('a', 'b', 'c');
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got 3 arguments.',
      'should fail when it takes too many arguments.'
    );
  }

  try {
    await readdirSorted(/!/);
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: path must be a string or Buffer',
      'should fail when the first parameter takes a non-string value.'
    );
  }

  try {
    await readdirSorted('');
  } catch (err) {
    t.equal(
      err.toString(),
      'Error: Expected a valid directory path, but got \'\' (empty string).',
      'should fail when the first parameter takes an empty string.'
    );
  }

  try {
    await readdirSorted(Buffer.alloc(0));
  } catch (err) {
    t.equal(
      err.toString(),
      'Error: Expected a valid directory path, but got an empty Buffer.',
      'should fail when the first parameter takes an empty Buffer.'
    );
  }

  try {
    await readdirSorted('a', 1);
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: The second argument of readdir-sorted must be a plain object, but got 1 (number).',
      'should fail when the second parameter takes an non-object value.'
    );
  }

  try {
    await readdirSorted('a', {locales: new Set()});
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: Expected `locale` option to be a string or an array of strings, but got Set {}.',
      'should fail when `locale` option is neither a string nor an array.'
    );
  }

  try {
    await readdirSorted('a', {locales: ['???']});
  } catch (err) {
    t.equal(
      err.toString(),
      'RangeError: Invalid language tag: ???',
      'should fail when `locale` option is not valid.'
    );
  }

  try {
    await readdirSorted('a', {localeMatcher: new Map()});
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: Expected `localeMatcher` option to be either \'lookup\' or \'best fit\', but got Map {}.',
      'should fail when `localeMatcher` option is not a string.'
    );
  }

  try {
    await readdirSorted('a', {localeMatcher: '~'});
  } catch (err) {
    t.equal(
      err.toString(),
      'RangeError: Value ~ out of range for collator options property localeMatcher',
      'should fail when `localeMatcher` option is not valid.'
    );
  }

  try {
    await readdirSorted('a', {usage: [0, 1, 2]});
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: `usage` option is not supported, but [ 0, 1, 2 ] was provided for it.',
      'should fail when `usage` option is provided.'
    );
  }

  try {
    await readdirSorted('a', {sensitivity: -0});
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: Expected `sensitivity` option to be one of ' +
      '\'base\' or \'accent\', \'case\' and \'variant\' but got -0 (number).',
      'should fail when `sensitivity` option is not a string.'
    );
  }

  try {
    await readdirSorted('a', {sensitivity: '#'});
  } catch (err) {
    t.equal(
      err.toString(),
      'RangeError: Value # out of range for collator options property sensitivity',
      'should fail when `sensitivity` option is not valid.'
    );
  }

  try {
    await readdirSorted('a', {ignorePunctuation: {}});
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: Expected `ignorePunctuation` option to be a Boolean value, but got {} (object).',
      'should fail when `ignorePunctuation` option is not a boolean.'
    );
  }

  try {
    await readdirSorted('a', {numeric: '\0'});
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: Expected `numeric` option to be a Boolean value, but got \'\\u0000\' (string).',
      'should fail when `numeric` option is not a boolean.'
    );
  }

  try {
    await readdirSorted('a', {caseFirst: Buffer.from('a')});
  } catch (err) {
    t.equal(
      err.toString(),
      'TypeError: Expected `caseFirst` option to be one of ' +
      '\'upper\', \'lower\', or \'false\', but got <Buffer 61>.',
      'should fail when `caseFirst` option is not valid.'
    );
  }

  t.end();
});

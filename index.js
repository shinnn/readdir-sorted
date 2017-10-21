'use strict';

const {inspect, promisify} = require('util');

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');
const {readdir} = require('graceful-fs');

const promisifiedReaddir = promisify(readdir);

module.exports = async function readdirSorted(...args) {
  const argLen = args.length;

  if (argLen !== 1 && argLen !== 2) {
    throw new TypeError(`Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got ${
      argLen === 0 ? 'no' : argLen
    } arguments.`);
  }

  const [dir, options] = args;

  if (argLen === 2) {
    if (!isPlainObj(options)) {
      throw new TypeError(`The second argument of readdir-sorted must be a plain object, but got ${
        inspectWithKind(options)
      }.`);
    }

    if (options.locales !== undefined && typeof options.locales !== 'string' && !Array.isArray(options.locales)) {
      throw new TypeError(`Expected \`locale\` option to be a string or an array of strings, but got ${
        inspectWithKind(options.locales)
      }.`);
    }

    if (options.localeMatcher !== undefined && typeof options.localeMatcher !== 'string') {
      throw new TypeError(`Expected \`localeMatcher\` option to be either 'lookup' or 'best fit', but got ${
        inspectWithKind(options.localeMatcher)
      }.`);
    }

    if (options.usage !== undefined) {
      throw new TypeError(`\`usage\` option is not supported, but ${
        inspect(options.usage)
      } was provided for it.`);
    }

    if (options.sensitivity !== undefined && typeof options.sensitivity !== 'string') {
      throw new TypeError(`Expected \`sensitivity\` option to be one of 'base' or 'accent', 'case' and 'variant' but got ${
        inspectWithKind(options.sensitivity)
      }.`);
    }

    if (options.ignorePunctuation !== undefined && typeof options.ignorePunctuation !== 'boolean') {
      throw new TypeError(`Expected \`ignorePunctuation\` option to be a Boolean value, but got ${
        inspectWithKind(options.ignorePunctuation)
      }.`);
    }

    if (options.numeric !== undefined && typeof options.numeric !== 'boolean') {
      throw new TypeError(`Expected \`numeric\` option to be a Boolean value, but got ${
        inspectWithKind(options.numeric)
      }.`);
    }

    if (options.caseFirst !== undefined && typeof options.caseFirst !== 'string' && options.caseFirst !== false) {
      throw new TypeError(`Expected \`caseFirst\` option to be one of 'upper', 'lower', or 'false', but got ${
        inspectWithKind(options.caseFirst)
      }.`);
    }
  }

  const sortOptions = Object.assign({usage: 'sort'}, options);
  const sort = argLen === 1 ?
    (a, b) => a.localeCompare(b, undefined, sortOptions) :
    (a, b) => a.localeCompare(b, options.locales, sortOptions);

  // validate options in advance
  sort('');

  return (await promisifiedReaddir(dir)).sort(sort);
};

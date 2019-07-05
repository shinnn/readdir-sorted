'use strict';

const {inspect} = require('util');
const {readdir} = require('fs').promises;

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');

const PATH_ERROR = 'Expected a valid directory path';

module.exports = async function readdirSorted(...args) {
	const argLen = args.length;

	if (argLen !== 1 && argLen !== 2) {
		throw new TypeError(`Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const [dir, options = {}] = args;

	if (dir === '') {
		throw new Error(`${PATH_ERROR}, but got '' (empty string).`);
	}

	if (Buffer.isBuffer(dir) && dir.length === 0) {
		throw new Error(`${PATH_ERROR}, but got an empty Buffer.`);
	}

	const {
		encoding,
		withFileTypes,
		locales,
		localeMatcher,
		usage,
		sensitivity,
		ignorePunctuation,
		numeric,
		caseFirst
	} = options;

	if (argLen === 2) {
		if (!isPlainObj(options)) {
			throw new TypeError(`The second argument of readdir-sorted must be a plain object, but got ${
				inspectWithKind(options)
			}.`);
		}

		if (encoding !== undefined) {
			if (typeof encoding !== 'string') {
				const error = new TypeError(`Expected \`encoding\` option to be a <string>, but got a non-string value ${
					inspectWithKind(encoding)
				}.`);
				error.code = 'ERR_INVALID_OPT_VALUE_ENCODING';

				throw error;
			}

			if (encoding.length === 0) {
				const error = new TypeError('Expected `encoding` option to be an encoding identifier for example \'base64\' and \'buffer\', but got \'\' (empty string).');
				error.code = 'ERR_INVALID_OPT_VALUE_ENCODING';

				throw error;
			}
		}

		if (withFileTypes !== undefined && typeof withFileTypes !== 'boolean') {
			throw new TypeError(`Expected \`withFileTypes\` option to either \`true\` or \`false\`, but got a non-boolean value ${
				inspectWithKind(withFileTypes)
			}.`);
		}

		if (locales !== undefined && typeof locales !== 'string' && !Array.isArray(locales)) {
			throw new TypeError(`Expected \`locale\` option to be a string or an array of strings, but got ${
				inspectWithKind(locales)
			}.`);
		}

		if (localeMatcher !== undefined && typeof localeMatcher !== 'string') {
			throw new TypeError(`Expected \`localeMatcher\` option to be either 'lookup' or 'best fit', but got ${
				inspectWithKind(localeMatcher)
			}.`);
		}

		if (usage !== undefined) {
			throw new TypeError(`\`usage\` option is not supported, but ${inspect(usage)} was provided for it.`);
		}

		if (sensitivity !== undefined && typeof sensitivity !== 'string') {
			throw new TypeError(`Expected \`sensitivity\` option to be one of 'base' or 'accent', 'case' and 'variant' but got ${
				inspectWithKind(sensitivity)
			}.`);
		}

		if (ignorePunctuation !== undefined && typeof ignorePunctuation !== 'boolean') {
			throw new TypeError(`Expected \`ignorePunctuation\` option to be a Boolean value, but got ${
				inspectWithKind(ignorePunctuation)
			}.`);
		}

		if (numeric !== undefined && typeof numeric !== 'boolean') {
			throw new TypeError(`Expected \`numeric\` option to be a Boolean value, but got ${
				inspectWithKind(numeric)
			}.`);
		}

		if (caseFirst !== undefined && typeof caseFirst !== 'string' && caseFirst !== false) {
			throw new TypeError(`Expected \`caseFirst\` option to be one of 'upper', 'lower', or 'false', but got ${
				inspectWithKind(caseFirst)
			}.`);
		}
	}

	const sortOptions = {
		usage: 'sort',
		...options,
		encoding: undefined,
		locales: undefined,
		withFileTypes: undefined
	};

	// validate options in advance
	''.localeCompare('', locales, sortOptions);

	const arr = await readdir(dir, {encoding, withFileTypes});

	if (withFileTypes) {
		if (encoding === 'buffer') {
			return arr.sort((a, b) => a.name.toString().localeCompare(b.name.toString(), locales, sortOptions));
		}

		return arr.sort((a, b) => a.name.localeCompare(b.name, locales, sortOptions));
	}

	return arr.sort((a, b) => a.localeCompare(b, locales, sortOptions));
};

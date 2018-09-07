'use strict';

const {dirname, join} = require('path');

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

	const dirents = (await readdirSorted(Buffer.from(fixtureDir), {
		encoding: 'buffer',
		withFileTypes: true,
		locales: ['en'],
		ignorePunctuation: true,
		numeric: true
	})).filter(({name}) => junk.not(name.toString()));

	t.deepEqual(
		dirents,
		[{name: Buffer.from('2')}, {name: Buffer.from('10')}, {name: Buffer.from('aab')}, {name: Buffer.from('a.ac')}],
		'should support String#localeCompare() options.'
	);

	t.equal(
		dirents[0].isFile(),
		true,
		'should support fs.readdir() options.'
	);

	const base64Names = (await readdirSorted(dirname(__dirname), {
		encoding: 'base64',
		withFileTypes: true
	})).map(({name}) => name);

	t.equal(
		base64Names.indexOf(Buffer.from('package.json').toString('base64')) - base64Names.indexOf(Buffer.from('package-lock.json').toString('base64')),
		1,
		'should sort entries after filenames are encoded.'
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

	t.end();
});

test('Argument validation', async t => {
	async function getError(...args) {
		try {
			return await readdirSorted(...args);
		} catch (err) {
			return err;
		}
	}

	t.equal(
		(await getError()).toString(),
		'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got no arguments.',
		'should fail when it takes no arguments.'
	);

	t.equal(
		(await getError('a', 'b', 'c')).toString(),
		'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got 3 arguments.',
		'should fail when it takes too many arguments.'
	);

	t.equal(
		(await getError('a', {encoding: new Uint32Array()})).toString(),
		'TypeError: Expected `encoding` option to be a <string>, but got a non-string value Uint32Array [].',
		'should fail when `encoding` option takes a non-string value.'
	);

	t.equal(
		(await getError('a', {encoding: ''})).toString(),
		'TypeError: Expected `encoding` option to be an encoding identifier for example \'base64\' and \'buffer\', but got \'\' (empty string).',
		'should fail when `encoding` option takes an empty string.'
	);

	t.equal(
		(await getError('a', {withFileTypes: new Map()})).toString(),
		'TypeError: Expected `withFileTypes` option to either `true` or `false`, but got a non-boolean value Map {}.',
		'should fail when `withFileTypes` option takes a non-boolean value.'
	);

	t.equal(
		(await getError(Symbol('!'))).code,
		'ERR_INVALID_ARG_TYPE',
		'should fail when the first parameter takes a non-string value.'
	);

	t.equal(
		(await getError('')).toString(),
		'Error: Expected a valid directory path, but got \'\' (empty string).',
		'should fail when the first parameter takes an empty string.'
	);

	t.equal(
		(await getError(Buffer.alloc(0))).toString(),
		'Error: Expected a valid directory path, but got an empty Buffer.',
		'should fail when the first parameter takes an empty Buffer.'
	);

	t.equal(
		(await getError('a', 1)).toString(),
		'TypeError: The second argument of readdir-sorted must be a plain object, but got 1 (number).',
		'should fail when the second parameter takes an non-object value.'
	);

	t.equal(
		(await getError('a', {locales: new Set()})).toString(),
		'TypeError: Expected `locale` option to be a string or an array of strings, but got Set {}.',
		'should fail when `locale` option is neither a string nor an array.'
	);

	t.equal(
		(await getError('a', {locales: ['???']})).toString(),
		'RangeError: Invalid language tag: ???',
		'should fail when `locale` option is not valid.'
	);

	t.equal(
		(await getError('a', {localeMatcher: new Map()})).toString(),
		'TypeError: Expected `localeMatcher` option to be either \'lookup\' or \'best fit\', but got Map {}.',
		'should fail when `localeMatcher` option is not a string.'
	);

	t.equal(
		(await getError('a', {localeMatcher: '~'})).toString(),
		'RangeError: Value ~ out of range for collator options property localeMatcher',
		'should fail when `localeMatcher` option is not valid.'
	);

	t.equal(
		(await getError('a', {usage: [0, 1, 2]})).toString(),
		'TypeError: `usage` option is not supported, but [ 0, 1, 2 ] was provided for it.',
		'should fail when `usage` option is provided.'
	);

	t.equal(
		(await getError('a', {sensitivity: -0})).toString(),
		'TypeError: Expected `sensitivity` option to be one of ' +
    '\'base\' or \'accent\', \'case\' and \'variant\' but got -0 (number).',
		'should fail when `sensitivity` option is not a string.'
	);

	t.equal(
		(await getError('a', {sensitivity: '#'})).toString(),
		'RangeError: Value # out of range for collator options property sensitivity',
		'should fail when `sensitivity` option is not valid.'
	);

	t.equal(
		(await getError('a', {ignorePunctuation: {}})).toString(),
		'TypeError: Expected `ignorePunctuation` option to be a Boolean value, but got {} (object).',
		'should fail when `ignorePunctuation` option is not a boolean.'
	);

	t.equal(
		(await getError('a', {numeric: '\0'})).toString(),
		'TypeError: Expected `numeric` option to be a Boolean value, but got \'\\u0000\' (string).',
		'should fail when `numeric` option is not a boolean.'
	);

	t.equal(
		(await getError('a', {caseFirst: Buffer.from('a')})).toString(),
		'TypeError: Expected `caseFirst` option to be one of ' +
    '\'upper\', \'lower\', or \'false\', but got <Buffer 61>.',
		'should fail when `caseFirst` option is not valid.'
	);

	t.end();
});

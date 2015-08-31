'use strict';

/*
	Some notes:

	- Using http://www2.research.att.com/sw/download/man/man5U/groff_mdoc.html
	- This is not at all complete. Please feel free to PR any tags you need
	  added.
	- This is the module you should be using for writing function documentation.
	  It will work for most modern-day Man implementations.
*/

var util = require('util');
var os = require('os');
var isArrayish = require('is-arrayish');
var Man = require('man-api');

var volumes = {
	general: 1,
	system: 2,
	library: 3,
	lib: 3,
	kernel: 4,
	kernelInterface: 4,
	file: 5,
	format: 5,
	fileFormat: 5,
	game: 6,
	misc: 7,
	sysadmin: 8,
	admin: 8,
	kernelDev: 9,
	kernelDeveloper: 8
};

var systems = {
	darwin: 'Mac OSX',
	win32: 'Windows',
	linux: 'Linux'
};

function MDoc(fn) {
	Man.call(this, fn);
}

MDoc.volumes = volumes;
MDoc.systems = systems;

util.inherits(MDoc, Man);

var P = MDoc.prototype;

/*
	Because this version of the manpage documentation
	doesn't like all-upper case tags. Like, at all.
*/
P.put = function () {
	arguments[0] = arguments[0][0].toUpperCase() +
		arguments[0].substr(1).toLowerCase();
	return Man.prototype.put.apply(this, arguments);
};

P.date = function (date) {
	return this.put('Dd', this.formatDate(date || new Date()));
};

P.header = function (name, section, volume) {
	name = name || 'Untitled';
	section = Man.sections[section] || section || 7;
	volume = volumes[volume] || volume || section;

	return this.put('Dt', name.toUpperCase(), section, volume);
};

P.os = function (system, version) {
	system = system || os.platform();
	system = systems[system] || system;
	version = version || version === null ? undefined : os.release();
	return this.put('Os', system, version);
};

P.name = function (name, description) {
	if (!isArrayish(name)) {
		name = [name];
	}

	this.section('name');

	for (var i = 0, len = name.length; i < len; i++) {
		this.put('Nm', name[i]);
	}

	return this.writeRaw('.Nd', description);
};

P.library = function (name) {
	this.section('library');
	return this.put('Lb', name);
};

P.lib = P.library;

P.include = function (file) {
	return this.put('In', file);
};

P.fnType = function (type) {
	return this.put('Ft', type);
};

P.fn = function () {
	var args = [].slice.call(arguments);
	return this.put.apply(this, ['Fn'].concat(args));
};

P.fnArg = function (name) {
	return this.formatFont('Fa', name);
};

P.seeAlso = function (name) {
	return this.put('Xr', name);
};

P.related = P.seeAlso;
P.crossRef = P.seeAlso;

P.standard = function (name) {
	return this.put('St', '-' + name);
};

module.exports = MDoc;

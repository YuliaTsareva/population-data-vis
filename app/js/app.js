'use strict';

var loader = require('./loader');

var topCountries = require('./charts/topCountries');

var DATA_PATH = 'data/population.csv';

var YEAR = 2013;

loader.getCountries(DATA_PATH)
	.then(function (countries) {
		topCountries.show(countries, YEAR)
	});

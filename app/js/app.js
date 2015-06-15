'use strict';

var loader = require('./loader');

var topCountries = require('./charts/topCountries');

var DATA_PATH = 'data/population.csv';

var YEAR = 2013;

loader.getPopulationData(DATA_PATH)
	.then(function (data) {
		topCountries.show(data, YEAR);
	});

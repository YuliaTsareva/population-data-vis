'use strict';

var _ = require('underscore');

var loader = require('./loader');

var topCountries = require('./charts/topCountries');
var populationGrowth = require('./charts/populationGrowth');

var DATA_PATH = 'data/population.csv';

var YEAR = 2013;

loader.getPopulationData(DATA_PATH)
	.then(function (data) {
		topCountries.show(data, YEAR);
		populationGrowth.show(data.world);
	});

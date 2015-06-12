'use strict';

var loader = require('./loader');
var preprocessor = require('./preprocessor');
var visualizer = require('./visualizer');

var DATA_PATH = 'data/population.csv';

loader.getCountries(DATA_PATH)
	  .then(preprocessor.sortPopulationDesc)
	  .then(visualizer.show);

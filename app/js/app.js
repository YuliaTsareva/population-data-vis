const loader = require('./loader');

const topCountries = require('./charts/topCountries');
const populationGrowth = require('./charts/populationGrowth');

const DATA_PATH = 'data/population.csv';

const YEAR = 2013;

loader.getPopulationData(DATA_PATH)
    .then(data => {
        topCountries.show(data, YEAR);
        populationGrowth.show(data.world);
    });

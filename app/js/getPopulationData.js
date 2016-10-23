import * as d3 from 'd3';
import * as _ from 'underscore';
import {promisify} from 'bluebird';
import Country from './country';

const loadCsv = promisify(d3.csv);

const isNotCountry = {
    'World': true,
    'Low & middle income': true,
    'Middle income': true,
    'Lower middle income': true,
    'Upper middle income': true,
    'East Asia & Pacific (all income levels)': true,
    'East Asia & Pacific (developing only)': true,
    'South Asia': true,
    'High income': true,
    'OECD members': true,
    'High income: OECD': true,
    'Sub-Saharan Africa (all income levels)': true,
    'Sub-Saharan Africa (developing only)': true,
    'Europe & Central Asia (all income levels)': true,
    'Least developed countries: UN classification': true,
    'Low income': true,
    'Heavily indebted poor countries (HIPC)': true,
    'Latin America & Caribbean (all income levels)': true,
    'Latin America & Caribbean (developing only)': true,
    'European Union': true,
    'Fragile and conflict affected situations': true,
    'Middle East & North Africa (all income levels)': true,
    'Arab World': true,
    'North America': true,
    'Middle East & North Africa (developing only)': true,
    'Euro area': true,
    'Europe & Central Asia (developing only)': true,
    'High income: nonOECD': true,
    'Central Europe and the Baltics': true
};

const shortCountryNames = {
    'United States': 'USA',
    'Russian Federation': 'Russia',
    'United Kingdom': 'UK'
};

export default function getPopulationData(path) {
    return loadCsv(path)
        .then(data => processData(data))
        .catch(err => {
            console.error('Read csv failed', err);
            return [];
        });
}

function processData(data) {
    const countries = getCountriesData(data);
    const world = getWorldData(data);

    return {
        countries,
        world
    };
}

function getCountriesData(data) {
    const countriesData = filterCountriesData(data);

    return countriesData.map(createCountry);
}

function getWorldData(data) {
    const worldData = _.findWhere(data, {countryName: 'World'});

    return {
        population: createPopulationPerYear(worldData)
    };
}

function filterCountriesData(data) {
    return data.filter(d => !isNotCountry[d.countryName]);
}

function createCountry(countryDataset) {
    const name = shortCountryNames[countryDataset.countryName] || countryDataset.countryName;
    const population = createPopulationPerYear(countryDataset);

    return new Country(name, population);
}

function createPopulationPerYear(dataset) {
    const population = {};

    for (let i = 1960; i < 2014; i++) {
        const yearPopulation = parseInt(dataset[i], 10);

        population[i] = isNaN(yearPopulation) ? 0 : yearPopulation;
    }

    return population;
}

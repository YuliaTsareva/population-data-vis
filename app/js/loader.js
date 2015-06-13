var d3 = require('d3');
var _ = require('underscore');

var Promise = require("bluebird");
var csv = Promise.promisify(d3.csv);

var Country = require('./country');

var isNotCountry = {
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

var shortCountryNames = {
	'United States': 'USA',
	'Russian Federation': 'Russia',
	'United Kingdom': 'UK'
};

function getPopulationData(path) {

	return csv(path)
		.then(function (data) {

			var countriesData = filterCountriesData(data);
			var countries = countriesData.map(createCountry);

			var worldData = _.findWhere(data, {countryName: 'World'});
			var world = {
				population: createPopulationPerYear(worldData)
			};

			return {
				countries: countries,
				world: world
			}
		})
		.catch(function (err) {

			console.error("Read csv failed", err);
			return [];
		});
}

function filterCountriesData(data) {

	return data.filter(d => !isNotCountry[d.countryName]);
}

function createCountry(d) {

	var name = shortCountryNames[d.countryName] || d.countryName;
	var population = createPopulationPerYear(d);

	return new Country(name, population);
}

function createPopulationPerYear(d) {

	var population = {};

	for (var i = 1960; i < 2014; i++) {

		var yearPopulation = parseInt(d[i]);
		population[i] = isNaN(yearPopulation) ? 0 : yearPopulation;
	}

	return population;
}

module.exports.getPopulationData = getPopulationData;

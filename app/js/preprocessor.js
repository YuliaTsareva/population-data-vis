
var d3 = require('d3');

function sortPopulationDesc(countries) {

	return countries.sort(function (a, b) {
		return d3.descending(a.population, b.population);
	});

}

module.exports.sortPopulationDesc = sortPopulationDesc;

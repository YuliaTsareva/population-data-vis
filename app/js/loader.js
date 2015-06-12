
var d3 = require('d3');

var Promise = require("bluebird");
var csv = Promise.promisify(d3.csv);

var Country = require('./country');

function getCountries(path) {

	return csv(path)
		.then(function(data) {

			var countries = data.map(function(d) {
				return new Country(d.countryName, parseInt(d.year2013));
			});

			return countries;
		})
		.catch(function(err) {

			console.error("Read csv failed", err);
			return [];
		});
}

module.exports.getCountries = getCountries;

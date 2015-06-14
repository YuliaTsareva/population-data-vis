
var d3 = require('d3');

var chart = require('./common.js');

var HEADER = 'Most Populated Countries in the World (2013)';
var TOP_COUNT = 10;

var populationFormat = d3.format(".2s");
var commaFormat = d3.format(',');
var percentageFormat = d3.format('%');

function show(data, year) {

	var countries = data.countries;

	if (countries.length === 0) {
		return;
	}

	var worldPopulation = data.world.population[year];

	var temp = countries.map(function(d) {
		return {
			name: d.name,
			population: d.population[year],
			percentageOfWorld: d.population[year] * 1.0 / worldPopulation
		};
	});

	temp = temp.sort(function (a, b) {
		return d3.descending(a.population, b.population);
	});

	var topCountries = temp.slice(0, TOP_COUNT);

	showTopCountries(topCountries, worldPopulation);
}

function showTopCountries(countries, worldPopulation) {

	var width = 500;
	var height = 400;

	var topPadding = 10;
	var bottomPadding = 40;
	var padding = 40;
	var leftPadding = 60;

	chart.showHeader(HEADER);

	var svg = d3.select('body')
		.append('svg')
		.attr({
			width: width,
			height: height,
			id: 'topCountriesBarChart'
		});

	var maxPopulation = countries[0].population;

	var xScale = d3.scale.ordinal()
		.domain(countries.map(function(d) { return d.name; }))
		.rangeRoundBands([leftPadding, width - padding], 0.1);

	var yScale = d3.scale.linear()
		.domain([0, maxPopulation])
		.range([height - bottomPadding, topPadding]);

	var xAxisGen = d3.svg.axis().scale(xScale).orient('bottom');
	var yAxisGen = d3.svg.axis().scale(yScale).orient('left').tickFormat(formatPopulationLabel);

	if (countries.length > 10) {
		xAxisGen.tickValues([]);
	}

	var xAxis = svg.append('g')
		.call(xAxisGen)
		.attr({
			class: 'x-axis',
			transform: 'translate(0, ' + (height - bottomPadding) + ')'
		});

	var yAxis = svg.append('g')
		.call(yAxisGen)
		.attr({
			class: 'y-axis',
			transform: 'translate(' + padding + ', 0)'
		})
		.append("text")
		.attr({
			transform: "rotate(-90)",
			x: -10,
			y: 6,
			dy: ".71em",
			class: "axis-label"
		})
		.text("Population");

	var tooltip = d3.select('body')
		.append('div')
		.attr({
			'class': 'tooltip'
		})
		.style('opacity', 0);

	svg.append('text')
		.attr({
			x: width - padding - 20,
			y: topPadding + 20,
			class: 'total-label'
		})
		.text('Total ' + commaFormat(worldPopulation));

	svg.selectAll('rect')
		.data(countries)
		.enter()
		.append('rect')
		.attr({
			x: function(d) {
				return xScale(d.name);
			},
			y: function (d) {
				return yScale(d.population);
			},
			width: xScale.rangeBand(),
			height: function(d) {
				return height - yScale(d.population) - padding;
			},
			fill: 'steelblue'
		})
		.on('mouseover', function(d) {
			tooltip.transition()
				.duration(500)
				.style('opacity', 0.85);

			tooltip.html(getTooltip(d))
				.style('left', (d3.event.pageX) + 'px')
				.style('top', (d3.event.pageY - 28) + 'px');

			d3.select(this).transition().duration(300)
				.style("fill", "orange");
		})
		.on('mousemove', function(d) {
			tooltip
				.style('left', (d3.event.pageX) + 'px')
				.style('top', (d3.event.pageY - 40) + 'px');
		})
		.on('mouseout', function(d) {
			tooltip.transition()
				.duration(300)
				.style('opacity', 0);

			d3.select(this).transition().duration(300)
				.style("fill", "steelblue");
		});
}

function formatPopulationLabel(country) {
	return populationFormat(country).replace(/G/, 'B');
}

function getTooltip(country) {

	var population = commaFormat(country.population);
	var percentage = percentageFormat(country.percentageOfWorld);

	return `<b>${country.name}</b>
		    <br />${population} (${percentage})`;
}

module.exports.show = show;

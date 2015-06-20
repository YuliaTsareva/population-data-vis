
var d3 = require('d3');
var _ = require('underscore');

var chart = require('./common.js');

var HEADER = 'World Population Growth';

var populationFormat = d3.format(".3s");

function show(data) {

	var width = 550;
	var height = 400;

	var topPadding = 10;
	var bottomPadding = 40;
	var padding = 40;
	var leftPadding = 60;

	var container = d3.select('body')
		.append('div')
		.attr({
			width: width,
			height: height,
			id: 'populationGrowthChart',
			class: 'chart'
		});

	container.append('h1')
		.text(HEADER);

	var svg = container
		.append('svg')
		.attr({
			width: width,
			height: height
		});

	var minYear = 1960;
	var maxYear = 2013;

	var years = _.keys(data.population).sort();

	var population = [];

	_.each(years, function(year) {
		population.push(data.population[year]);
	});

	var maxPopulation = d3.max(population);

	var xScale = d3.scale.linear()
		.domain([minYear, maxYear])
		.range([leftPadding, width - padding]);

	var yScale = d3.scale.linear()
		.domain([0, maxPopulation])
		.range([height - bottomPadding, topPadding]);

	var yearLabels = _.filter(years, function(year) {
		return year % 5 === 0;
	});

	var xAxisGen = d3.svg.axis().scale(xScale).orient('bottom').tickValues(yearLabels).tickFormat(d3.format('d'));
	var yAxisGen = d3.svg.axis().scale(yScale).orient('left').tickFormat(formatPopulationLabel);

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

	var pathData = population.slice();
	pathData.push(0, 0);

	var pathYears = years.slice();
	pathYears.push(years[years.length - 1], years[0]);

	var lineFunc = d3.svg.line()
		.x(function(d, i) {return xScale(pathYears[i]);})
		.y(function(d) {return yScale(d);})
		.interpolate('linear');

	var path = svg.append('path')
		.attr({
			d: lineFunc(pathData),
			'stroke': 'steelblue',
			'stroke-width': 1,
			'fill': 'steelblue',
			'class': 'path-weight'
		});

	var horizontal = svg.append('rect')
		.attr({
			x: xScale(minYear),
			y: 0,
			width: 0,
			height: 1,
			fill: 'darkorange'
		});

	var vertical = svg.append('rect')
		.attr({
			x: 0,
			y: 0,
			width: 1,
			height: 0,
			fill: 'darkorange'
		});

	var label = svg.append('text');

	var timer;

	path
		.on('mousemove', function() {

			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			var location = d3.mouse(this);
			var year = d3.round(xScale.invert(location[0]));

			console.log(year, data.population[year]);
			vertical
				.attr({
					x: xScale(year),
					y: yScale(data.population[year]),
					height: height - yScale(data.population[year]) - bottomPadding
				});

			horizontal
				.attr({
					y: yScale(data.population[year]),
					width: xScale(year) - xScale(minYear)
				});

			label
				.text(formatPopulationLabel(data.population[year]) + ' in ' + year)
				.attr({
					x: xScale(year),
					y: yScale(data.population[year]) - 3,
					'text-anchor': 'end',
					'font-size': '12px'
				});
		})
		.on('mouseout', function() {
			timer = setTimeout(function() {
				vertical.attr({
					height: 0
				});
				horizontal.attr({
					width: 0
				});
				label.text('');
			}, 200);
		});
}

function formatPopulationLabel(country) {
	return populationFormat(country).replace(/G/, 'B');
}

module.exports.show = show;

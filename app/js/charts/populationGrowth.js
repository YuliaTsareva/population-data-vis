import * as d3 from 'd3';
import * as _ from 'underscore';

const HEADER = 'World Population Growth';

const populationFormat = d3.format('.3s');

function show(data) {
    const width = 550;
    const height = 400;

    const topPadding = 10;
    const bottomPadding = 40;
    const padding = 40;
    const leftPadding = 60;

    const container = d3.select('body')
        .append('div')
        .attr({
            width,
            height,
            id: 'populationGrowthChart',
            class: 'chart'
        });

    container.append('h1')
        .text(HEADER);

    const svg = container
        .append('svg')
        .attr({
            width,
            height
        });

    const minYear = 1960;
    const maxYear = 2013;

    const years = _.keys(data.population).sort();

    const population = [];

    _.each(years, year => {
        population.push(data.population[year]);
    });

    const maxPopulation = d3.max(population);

    const xScale = d3.scale.linear()
        .domain([minYear, maxYear])
        .range([leftPadding, width - padding]);

    const yScale = d3.scale.linear()
        .domain([0, maxPopulation])
        .range([height - bottomPadding, topPadding]);

    const yearLabels = _.filter(years, year => year % 5 === 0);

    const xAxisGen = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickValues(yearLabels)
        .tickFormat(d3.format('d'));

    const yAxisGen = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickFormat(formatPopulationLabel);

    // xAxis
    svg.append('g')
        .call(xAxisGen)
        .attr({
            class: 'x-axis',
            transform: `translate(0, ${height - bottomPadding})`
        });

    // yAxis
    svg.append('g')
        .call(yAxisGen)
        .attr({
            class: 'y-axis',
            transform: `translate(${padding}, 0)`
        })
        .append('text')
        .attr({
            transform: 'rotate(-90)',
            x: -10,
            y: 6,
            dy: '.71em',
            class: 'axis-label'
        })
        .text('Population');

    const pathData = population.slice();
    pathData.push(0, 0);

    const pathYears = years.slice();
    pathYears.push(years[years.length - 1], years[0]);

    const lineFunc = d3.svg.line()
        .x((d, i) => xScale(pathYears[i]))
        .y(d => yScale(d))
        .interpolate('linear');

    const path = svg.append('path')
        .attr({
            d: lineFunc(pathData),
            'stroke': 'steelblue',
            'stroke-width': 1,
            'fill': 'steelblue',
            'class': 'path-weight'
        });

    const horizontal = svg.append('rect')
        .attr({
            x: xScale(minYear),
            y: 0,
            width: 0,
            height: 1,
            fill: 'darkorange'
        });

    const vertical = svg.append('rect')
        .attr({
            x: 0,
            y: 0,
            width: 1,
            height: 0,
            fill: 'darkorange'
        });

    const label = svg.append('text');

    let timer;

    path
        .on('mousemove', function () {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            const location = d3.mouse(this);
            const year = d3.round(xScale.invert(location[0]));

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
                .text(`${formatPopulationLabel(data.population[year])} in ${year}`)
                .attr({
                    x: xScale(year),
                    y: yScale(data.population[year]) - 3,
                    'text-anchor': 'end',
                    'font-size': '12px'
                });
        })
        .on('mouseout', () => {
            timer = setTimeout(() => {
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

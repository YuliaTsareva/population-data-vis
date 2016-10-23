const d3 = require('d3');

const HEADER = 'Most Populated Countries in the World (2013)';
const TOP_COUNT = 10;

const populationFormat = d3.format('.2s');
const commaFormat = d3.format(',');
const percentageFormat = d3.format('%');

function show(data, year) {
    const countries = data.countries;

    if (countries.length === 0) {
        return;
    }

    const worldPopulation = data.world.population[year];

    let temp = countries.map(d => {
        return {
            name: d.name,
            population: d.population[year],
            percentageOfWorld: d.population[year] * 1.0 / worldPopulation
        };
    });

    temp = temp.sort((a, b) => d3.descending(a.population, b.population));

    const topCountries = temp.slice(0, TOP_COUNT);

    showTopCountries(topCountries, worldPopulation);
}

function showTopCountries(countries, worldPopulation) {
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
            id: 'topCountriesBarChart',
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

    const maxPopulation = countries[0].population;

    const xScale = d3.scale.ordinal()
        .domain(countries.map(d => d.name))
        .rangeRoundBands([leftPadding, width - padding], 0.1);

    const yScale = d3.scale.linear()
        .domain([0, maxPopulation])
        .range([height - bottomPadding, topPadding]);

    const xAxisGen = d3.svg.axis().scale(xScale).orient('bottom');
    const yAxisGen = d3.svg.axis().scale(yScale).orient('left').tickFormat(formatPopulationLabel);

    if (countries.length > 10) {
        xAxisGen.tickValues([]);
    }

    // xAxis
    svg.append('g')
        .call(xAxisGen)
        .attr({
            class: 'x-axis',
            transform: `translate(0, ${(height - bottomPadding)})`
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

    const tooltip = d3.select('body')
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
        .text(`Total ${commaFormat(worldPopulation)}`);

    svg.selectAll('rect')
        .data(countries)
        .enter()
        .append('rect')
        .attr({
            x: d => xScale(d.name),
            y: d => yScale(d.population),
            width: xScale.rangeBand(),
            height: d => height - yScale(d.population) - padding,
            fill: 'steelblue'
        })
        .on('mouseover', function (d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0.85);

            tooltip.html(getTooltip(d))
                .style('left', `${(d3.event.pageX)}px`)
                .style('top', `${(d3.event.pageY - 28)}px`);

            d3.select(this).transition().duration(300)
                .style('fill', 'orange');
        })
        .on('mousemove', () => {
            tooltip
                .style('left', `${(d3.event.pageX)}px`)
                .style('top', `${(d3.event.pageY - 40)}px`);
        })
        .on('mouseout', function () {
            tooltip.transition()
                .duration(300)
                .style('opacity', 0);

            d3.select(this).transition().duration(300)
                .style('fill', 'steelblue');
        });
}

function formatPopulationLabel(country) {
    return populationFormat(country).replace(/G/, 'B');
}

function getTooltip(country) {
    const population = commaFormat(country.population);
    const percentage = percentageFormat(country.percentageOfWorld);

    return `<b>${country.name}</b>
            <br />${population} (${percentage})`;
}

module.exports.show = show;

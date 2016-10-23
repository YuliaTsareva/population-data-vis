import Chart from './chart';

const d3 = require('d3');

const TOP_COUNT = 10;
const YEAR = 2013;

const populationFormat = d3.format('.2s');
const commaFormat = d3.format(',');
const percentageFormat = d3.format('%');

export default class MostPopulatedCountriesChart extends Chart {
    constructor() {
        super();
        this.header = 'Most Populated Countries in the World (2013)';
    }

    show(data) {
        const countries = data.countries;

        if (countries.length === 0) {
            return;
        }

        const worldPopulation = data.world.population[YEAR];

        let temp = countries.map(d => {
            return {
                name: d.name,
                population: d.population[YEAR],
                percentageOfWorld: d.population[YEAR] * 1.0 / worldPopulation
            };
        });

        temp = temp.sort((a, b) => d3.descending(a.population, b.population));

        const topCountries = temp.slice(0, TOP_COUNT);

        this.showTopCountries(topCountries, worldPopulation);
    }

    showTopCountries(countries, worldPopulation) {
        this.createContainer();

        const maxPopulation = countries[0].population;

        const xScale = d3.scale.ordinal()
            .domain(countries.map(d => d.name))
            .rangeRoundBands([this.leftPadding, this.width - this.padding], 0.1);

        const yScale = d3.scale.linear()
            .domain([0, maxPopulation])
            .range([this.height - this.bottomPadding, this.topPadding]);

        const xAxisGen = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        const yAxisGen = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickFormat(MostPopulatedCountriesChart.formatPopulationLabel);

        if (countries.length > 10) {
            xAxisGen.tickValues([]);
        }

        // xAxis
        this.svg.append('g')
            .call(xAxisGen)
            .attr({
                class: 'x-axis',
                transform: `translate(0, ${(this.height - this.bottomPadding)})`
            });

        // yAxis
        this.svg.append('g')
            .call(yAxisGen)
            .attr({
                class: 'y-axis',
                transform: `translate(${this.padding}, 0)`
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

        this.svg.append('text')
            .attr({
                x: this.width - this.padding - 20,
                y: this.topPadding + 20,
                class: 'total-label'
            })
            .text(`Total ${commaFormat(worldPopulation)}`);

        this.svg.selectAll('rect')
            .data(countries)
            .enter()
            .append('rect')
            .attr({
                x: d => xScale(d.name),
                y: d => yScale(d.population),
                width: xScale.rangeBand(),
                height: d => this.height - yScale(d.population) - this.padding,
                fill: 'steelblue'
            })
            .on('mouseover', function (d) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0.85);

                tooltip.html(MostPopulatedCountriesChart.getTooltip(d))
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

    static formatPopulationLabel(country) {
        return populationFormat(country).replace(/G/, 'B');
    }

    static getTooltip(country) {
        const population = commaFormat(country.population);
        const percentage = percentageFormat(country.percentageOfWorld);

        return `<b>${country.name}</b>
            <br />${population} (${percentage})`;
    }
}

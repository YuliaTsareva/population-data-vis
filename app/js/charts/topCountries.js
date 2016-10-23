/* eslint-disable import/no-duplicates */
/* eslint-disable no-duplicate-imports */
import * as d3 from 'd3';
import {event as currentEvent} from 'd3';
import Chart from './chart';
import config from './config';

const TOP_COUNT = 10;
const YEAR = 2013;

const TOTAL_LABEL_PADDING = 20;
const TOOLTIP_OPACITY = 0.85;

const commaFormat = d3.format(',');
const percentageFormat = d3.format('%');

export default class MostPopulatedCountriesChart extends Chart {
    constructor() {
        super();
        this.header = 'Most Populated Countries in the World (2013)';
    }

    show(data) {
        this.worldPopulation = data.world.population[YEAR];
        this.countries = this.getTopCountries(data);

        this.showTopCountries();
    }

    getTopCountries(data) {
        let temp = data.countries.map(d => {
            return {
                name: d.name,
                population: d.population[YEAR],
                percentageOfWorld: d.population[YEAR] * 1.0 / this.worldPopulation
            };
        });

        temp = temp.sort((a, b) => d3.descending(a.population, b.population));

        return temp.slice(0, TOP_COUNT);
    }

    showTopCountries() {
        this.createContainer();

        const xScale = this.createXScale();
        const yScale = this.createYScale();

        this.addXAxis(xScale);
        this.addYAxis(yScale);

        this.addTotalLabel();

        this.addBars(xScale, yScale);
    }

    createXScale() {
        return d3.scale.ordinal()
            .domain(this.countries.map(d => d.name))
            .rangeRoundBands([this.leftPadding, this.width - this.padding], 0.1);
    }

    createYScale() {
        const maxPopulation = this.countries[0].population;

        return d3.scale.linear()
            .domain([0, maxPopulation])
            .range([this.height - this.bottomPadding, this.topPadding]);
    }

    addXAxis(xScale) {
        const xAxisGen = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        if (this.countries.length > 10) {
            xAxisGen.tickValues([]);
        }

        this.svg.append('g')
            .call(xAxisGen)
            .attr({
                class: 'x-axis',
                transform: `translate(0, ${(this.height - this.bottomPadding)})`
            });
    }

    addYAxis(yScale) {
        const yAxisGen = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickFormat(Chart.formatPopulationLabel);

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
    }

    addTotalLabel() {
        this.svg.append('text')
            .attr({
                x: this.width - this.padding - TOTAL_LABEL_PADDING,
                y: this.topPadding + TOTAL_LABEL_PADDING,
                class: 'total-label'
            })
            .text(`Total ${commaFormat(this.worldPopulation)}`);
    }

    addBars(xScale, yScale) {
        const tooltip = MostPopulatedCountriesChart.createTooltip();

        this.svg.selectAll('rect')
            .data(this.countries)
            .enter()
            .append('rect')
            .attr({
                x: d => xScale(d.name),
                y: d => yScale(d.population),
                width: xScale.rangeBand(),
                height: d => this.height - yScale(d.population) - this.padding,
                fill: config.mainColor
            })
            .on('mouseover', function (country) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', TOOLTIP_OPACITY);

                tooltip.html(MostPopulatedCountriesChart.getTooltip(country))
                    .style('left', `${(currentEvent.pageX)}px`)
                    .style('top', `${(currentEvent.pageY - 28)}px`);

                d3.select(this).transition().duration(300)
                    .style('fill', config.secondColor);
            })
            .on('mousemove', () => {
                tooltip
                    .style('left', `${(currentEvent.pageX)}px`)
                    .style('top', `${(currentEvent.pageY - 40)}px`);
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(300)
                    .style('opacity', 0);

                d3.select(this).transition().duration(300)
                    .style('fill', config.mainColor);
            });
    }

    static createTooltip() {
        return d3.select('body')
            .append('div')
            .attr({
                'class': 'tooltip'
            })
            .style('opacity', 0);
    }

    static getTooltip(country) {
        const population = commaFormat(country.population);
        const percentage = percentageFormat(country.percentageOfWorld);

        return `<b>${country.name}</b>
            <br />${population} (${percentage})`;
    }
}

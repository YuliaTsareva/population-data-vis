import * as d3 from 'd3';
import * as _ from 'underscore';
import Chart from './chart';

const populationFormat = d3.format('.3s');

export default class WorldPopulationGrowthChart extends Chart {
    constructor() {
        super();
        this.header = 'World Population Growth';
    }

    show(data) {
        this.createContainer();

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
            .range([this.leftPadding, this.width - this.padding]);

        const yScale = d3.scale.linear()
            .domain([0, maxPopulation])
            .range([this.height - this.bottomPadding, this.topPadding]);

        const yearLabels = _.filter(years, year => year % 5 === 0);

        const xAxisGen = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickValues(yearLabels)
            .tickFormat(d3.format('d'));

        const yAxisGen = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickFormat(WorldPopulationGrowthChart.formatPopulationLabel);

        // xAxis
        this.svg.append('g')
            .call(xAxisGen)
            .attr({
                class: 'x-axis',
                transform: `translate(0, ${this.height - this.bottomPadding})`
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

        const pathData = population.slice();
        pathData.push(0, 0);

        const pathYears = years.slice();
        pathYears.push(years[years.length - 1], years[0]);

        const lineFunc = d3.svg.line()
            .x((d, i) => xScale(pathYears[i]))
            .y(d => yScale(d))
            .interpolate('linear');

        const path = this.svg.append('path')
            .attr({
                d: lineFunc(pathData),
                'stroke': 'steelblue',
                'stroke-width': 1,
                'fill': 'steelblue',
                'class': 'path-weight'
            });

        const horizontal = this.svg.append('rect')
            .attr({
                x: xScale(minYear),
                y: 0,
                width: 0,
                height: 1,
                fill: 'darkorange'
            });

        const vertical = this.svg.append('rect')
            .attr({
                x: 0,
                y: 0,
                width: 1,
                height: 0,
                fill: 'darkorange'
            });

        const label = this.svg.append('text');

        let timer;

        const that = this;
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
                        height: that.height - yScale(data.population[year]) - that.bottomPadding
                    });

                horizontal
                    .attr({
                        y: yScale(data.population[year]),
                        width: xScale(year) - xScale(minYear)
                    });

                label
                    .text(`${WorldPopulationGrowthChart.formatPopulationLabel(data.population[year])} in ${year}`)
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

    static formatPopulationLabel(country) {
        return populationFormat(country).replace(/G/, 'B');
    }
}

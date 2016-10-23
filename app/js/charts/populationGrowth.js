import * as d3 from 'd3';
import * as _ from 'underscore';
import Chart from './chart';
import config from './config';

const MIN_YEAR = 1960;
const MAX_YEAR = 2013;

export default class WorldPopulationGrowthChart extends Chart {
    constructor() {
        super();
        this.header = 'World Population Growth';
    }

    show(data) {
        this.createContainer();

        this.years = _.keys(data.population).sort();

        this.population = [];

        _.each(this.years, year => {
            this.population.push(data.population[year]);
        });

        const xScale = this.createXScale();
        const yScale = this.createYScale();

        this.addXAxis(xScale);
        this.addYAxis(yScale);

        const pathData = this.population.slice();
        pathData.push(0, 0);

        const pathYears = this.years.slice();
        pathYears.push(this.years[this.years.length - 1], this.years[0]);

        const lineFunc = d3.svg.line()
            .x((d, i) => xScale(pathYears[i]))
            .y(d => yScale(d))
            .interpolate('linear');

        const path = this.svg.append('path')
            .attr({
                d: lineFunc(pathData),
                'stroke': config.mainColor,
                'stroke-width': 1,
                'fill': config.mainColor,
                'class': 'path-weight'
            });

        const horizontal = this.svg.append('rect')
            .attr({
                x: xScale(MIN_YEAR),
                y: 0,
                width: 0,
                height: 1,
                fill: config.secondColor
            });

        const vertical = this.svg.append('rect')
            .attr({
                x: 0,
                y: 0,
                width: 1,
                height: 0,
                fill: config.secondColor
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
                        width: xScale(year) - xScale(MIN_YEAR)
                    });

                label
                    .text(`${Chart.formatPopulationLabel(data.population[year])} in ${year}`)
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

    createXScale() {
        return d3.scale.linear()
            .domain([MIN_YEAR, MAX_YEAR])
            .range([this.leftPadding, this.width - this.padding]);
    }

    createYScale() {
        const maxPopulation = d3.max(this.population);

        return d3.scale.linear()
            .domain([0, maxPopulation])
            .range([this.height - this.bottomPadding, this.topPadding]);
    }

    addXAxis(xScale) {
        const yearLabels = _.filter(this.years, year => year % 5 === 0);

        const xAxisGen = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickValues(yearLabels)
            .tickFormat(d3.format('d'));

        this.svg.append('g')
            .call(xAxisGen)
            .attr({
                class: 'x-axis',
                transform: `translate(0, ${this.height - this.bottomPadding})`
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
}

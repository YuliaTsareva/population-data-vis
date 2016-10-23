import * as d3 from 'd3';

const populationFormat = d3.format('.2s');

export default class Chart {
    constructor() {
        this.width = 550;
        this.height = 400;

        this.topPadding = 10;
        this.bottomPadding = 40;
        this.padding = 40;
        this.leftPadding = 60;
    }

    createContainer() {
        this.container = d3.select('body')
            .append('div')
            .attr({
                width: this.width,
                height: this.height,
                class: 'chart'
            });

        this.createHeader();
        this.createSvg();

        return this.container;
    }

    createHeader() {
        this.container.append('h1')
            .text(this.header);
    }

    createSvg() {
        this.svg = this.container
            .append('svg')
            .attr({
                width: this.width,
                height: this.height
            });
    }

    static formatPopulationLabel(country) {
        return populationFormat(country).replace(/G/, 'B');
    }
}

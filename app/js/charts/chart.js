import * as d3 from 'd3';

export default class Chart {
    constructor(id) {
        this.width = 550;
        this.height = 400;

        this.topPadding = 10;
        this.bottomPadding = 40;
        this.padding = 40;
        this.leftPadding = 60;

        this.id = id;
    }

    createContainer() {
        this.container = d3.select('body')
            .append('div')
            .attr({
                width: this.width,
                height: this.height,
                id: this.id,
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
}

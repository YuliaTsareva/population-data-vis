import * as d3 from 'd3';

/* eslint-disable import/prefer-default-export */
export function showHeader(header) {
    d3.select('body')
        .append('h1')
        .text(header);
}

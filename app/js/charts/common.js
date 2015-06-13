
var d3 = require('d3');

function showHeader(header) {

	d3.select('body')
		.append('h1')
		.text(header);
}

module.exports.showHeader = showHeader;
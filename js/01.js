// var pBrowser = document.querySelector('p')
var pD3 = d3.select('p')

// console.log({pBrowser, pD3})

var elm = d3.select('body')
	.append('p')
	.attr("class", "foo")
	.classed("bar", true)
	.text("Hello World")
	.style("color", "blue")


console.log({body})
var data = [10, 11, 13, 12, 14]

var elm =  d3.select('ul')
	.selectAll('li')
	.data(data)
	.text(function(d) {
		return "N" + d
	})

elm.enter()
    .append('li')
    .text(d => d)

elm.exit()
    .remove()

console.log({elm})
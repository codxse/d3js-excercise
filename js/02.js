var data = [10, 11, 13, 12, 14]

var elm =  d3.select('ul')
	.selectAll('li')
	.data(data)
	.join(
		enter => {
			return enter.append('li')
				.style("color", "red")
		},
		update => update.style("color", "blue"),
		exit => exit.remove()
	)
	.text(function(d) {
		return "N" + d
	})

console.log({elm})
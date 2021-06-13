async function draw() {
    const dataset = await d3.json('js/05.json')
    
    const dimensions = {
        width: 800,
        height: 800,
        margin: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
        }
    }

    const containerWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    const containerHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    const xAccessor = d => d.currently.humidity
    const yAccessor = d => d.currently.apparentTemperature

    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)

    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .rangeRound([0, containerWidth])
        .clamp(true)

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .rangeRound([containerHeight, 0])
        .nice()
        .clamp(true)
    
    container.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 5)
        .attr('fill', 'red')
        .attr('data-temp', yAccessor)

    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        // .tickValues([0.4, 0.5, 0.8])
        .tickFormat(d => `${d * 100}%`)
    const yAxis = d3.axisLeft(yScale)

    const xAxisGroup = container.append('g')
        .call(xAxis)
        .style('transform', `translateY(${containerHeight}px)`)
        .classed('axis', true)

    const yAxisGroup = container.append('g')
        .call(yAxis)
        .classed('axis', true)

    xAxisGroup.append('text')
        .attr('x', containerWidth / 2)
        .attr('y', dimensions.margin.bottom - 10)
        .attr('fill', 'black')
        .text('Humadity')

    yAxisGroup.append('text')
        .attr('x', -containerHeight / 2)
        .attr('y', -dimensions.margin.left + 15)
        .attr('fill', 'black')
        .html("Temperature &deg; F")
        .style('transform', `rotate(270deg)`)
        .style('text-anchor', 'middle')
}

draw()
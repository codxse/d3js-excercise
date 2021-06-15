function drawHorizontalStackedBar(selector, data, chart, option) {
    const CONFIG = {
        width: option.width,
        height: option.height,
        margin: {
            top: 10,
            bottom: 100,
            left: 50,
            right: 10,
        }
    }
    const xFactor = CONFIG.width / 600
    const yFactor = CONFIG.height / 900

    const canvas = d3.select(selector)
        .append('svg')
        .attr('style', 'background-color: white')
        .attr('width', CONFIG.width)
        .attr('height', CONFIG.height)

    const container = canvas.append('g')
        .attr('transform', `translate(${CONFIG.margin.left * xFactor}, ${CONFIG.margin.top * yFactor})`)
        .attr('width', (CONFIG.width * xFactor) - (CONFIG.margin.right * xFactor) - (CONFIG.margin.left * xFactor))
        .attr('height', (CONFIG.height * yFactor) - (CONFIG.margin.bottom * yFactor) - (CONFIG.margin.top * yFactor)) 


    // X and Y Axis
    const nextData = data.map((d) => ({
        ...d,
        total: d3.sum(chart.subjects, (k) => +d[k])
    }))

    const x = d3.scaleLinear()
        .range([(CONFIG.margin.left * xFactor), (CONFIG.width * xFactor) - (CONFIG.margin.right * xFactor) - (CONFIG.margin.left * xFactor)])
        .domain([0, d3.max(nextData, (d) => d.total)])
        .nice()
    
    const y = d3.scaleBand()
        .range([(CONFIG.margin.top * yFactor), (CONFIG.height * yFactor) - (CONFIG.margin.bottom * yFactor) - (CONFIG.margin.top * yFactor)])
        .domain(nextData.map((d) => d[chart.y]))
        .padding(0.1)
        .paddingOuter(0.2)
        .paddingInner(0.2);

    container.append('g')
        .attr('transform', `translate(${(CONFIG.margin.left * xFactor)}, 0)`)
        .classed('y-axis', true)

    container.append('g')
        .attr('transform', `translate(0, ${(CONFIG.margin.top * yFactor)})`)
        .classed('x-axis', true)

    const barColors = d3.scaleOrdinal()
        .range(chart.colors)
        .domain(chart.subjects)

    // draw x and y axis
    const xAxis = container.selectAll('.x-axis')
        // .transition()
        // .duration(1000)
        .call(d3.axisTop(x).ticks(null, "s"))

    const yAxis = container.selectAll('.y-axis')
        // .transition()
        // .duration(1000)
        .call(d3.axisLeft(y).tickSizeOuter(0))

    // stack
    const stacks = d3.stack().keys(chart.subjects)

    const group = container.selectAll('g.layer')
        .data(stacks(nextData), (d) => d.key)

    group.exit().remove()
    group.enter()
        .insert('g', '.y-axis')
        .append('g')
        .classed("layer", true)
        .attr("fill", (d) => {
            console.log(barColors(d.key))
            console.log(d)
            return barColors(d.key)
        })

    const bars = container.selectAll('g.layer')
        .selectAll('rect')
        .data(d => d, (e) => e.data[chart.y])

    bars.exit().remove()
    bars.enter()
        .append('rect')
        .attr('height', y.bandwidth())
        .merge(bars)
        // .transition()
        // .duration(1000)
        .attr('y', (d) => y(d.data[chart.y]))
        .attr('x', (d) => x(d[0]))
        .attr('width', (d) => {
            return x(d[1]) - x(d[0])
        })
        .on('mouseover', (event, d) => {

            tooltip.style("display", null)
        })
        .on("mouseout", (event, d) => {

            tooltip.style("display", 'none')
        })
        .on("mousemove", function(event, d) {
            const xPosition = event.layerX
            const yPosition = event.layerY
            const data = d.data
            console.log({d})
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text(`${JSON.stringify(data)}`);
        })

    // tooltip
    const tooltip = container.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
          
    tooltip.append("rect")
        .attr("width", 30 * xFactor)
        .attr("height", 20 * yFactor)
        .attr("fill", "white")
        .style("opacity", 0.5);
      
    tooltip.append("text")
        .attr("x", 15 * xFactor)
        .attr("dy", `${1.2 * yFactor}em`)
        .style("text-anchor", "middle")
        .attr("font-size", `${13 * yFactor}px`)
        .attr("font-weight", "bold");

    // legend
    const legend = container.selectAll('.legend')
        .data(chart.colors)
        .enter()
        .append('g')
        .classed('legend', true)
        .attr('transform', (d, i) => {
            const reset = (i+1) % 4 === 0
            const space = 20 * yFactor
            const x = reset ? space : (170 * xFactor * i) + space
            const y = space + (CONFIG.height * yFactor) - (CONFIG.margin.top * yFactor) - (CONFIG.margin.bottom * yFactor) + (reset ? (35 * yFactor) : 0)
            return `translate(${x}, ${y})`
        })
    
    legend.append('rect')
        .attr('x', 0)
        .attr('width', 20 * xFactor)
        .attr('height', 20 * yFactor)
        .attr('rx', 5 * xFactor)
        .attr('ry', 5 * yFactor)
        .style('fill', (d, i) => chart.colors.slice()[i])
    
    legend.append('text')
        .attr('x', 25 * xFactor)
        .attr('y', 15 * yFactor)
        .style("text-anchor", "start")
        .attr('fill', '#9C9C9C')
        .attr('font-size', `${1 * xFactor}em`)
        .text((d, i) => {
            return chart.subjects[i]
        })
}

const data = [
    { year: "2006", redDelicious: "10", mcintosh: "15", oranges: "9", pears: "6" },
    { year: "2007", redDelicious: "12", mcintosh: "18", oranges: "9", pears: "4" },
    { year: "2008", redDelicious: "05", mcintosh: "20", oranges: "8", pears: "2" },
    { year: "2009", redDelicious: "01", mcintosh: "15", oranges: "5", pears: "4" },
    { year: "2010", redDelicious: "02", mcintosh: "10", oranges: "4", pears: "2" },
    { year: "2011", redDelicious: "03", mcintosh: "12", oranges: "6", pears: "3" },
    { year: "2012", redDelicious: "04", mcintosh: "15", oranges: "8", pears: "1" },
    { year: "2013", redDelicious: "06", mcintosh: "11", oranges: "9", pears: "4" },
    { year: "2014", redDelicious: "10", mcintosh: "13", oranges: "9", pears: "5" },
    { year: "2015", redDelicious: "16", mcintosh: "19", oranges: "6", pears: "9" },
    { year: "2016", redDelicious: "19", mcintosh: "17", oranges: "5", pears: "7" },
  ]
const subjects = ["redDelicious", "mcintosh", "oranges", "pears"]
const colors = ["red", "tomato", "yellow", "green"]

const data2 = [
    {
      Year: 2017,
      State: "AL",
      "Under 5 Years": 552,
      "5 to 13 Years": 259,
      "14 to 17 Years": 310
    },
    {
      Year: 2017,
      State: "AK",
      "Under 5 Years": 856,
      "5 to 13 Years": 421,
      "14 to 17 Years": 520
    },
    {
      Year: 2017,
      State: "AZ",
      "Under 5 Years": 828,
      "5 to 13 Years": 362,
      "14 to 17 Years": 515
    }
  ]
const subjects2 = ["Under 5 Years", "5 to 13 Years", "14 to 17 Years"]
const colors2 = ["steelblue", "darkorange", "lightblue"]

console.log({data, subjects, colors})
drawHorizontalStackedBar("#arvis", data, {
    y: 'year',
    subjects: subjects,
    colors: colors,
    unit: 'Rp'
}, {
    width: 600,
    height: 900,
})
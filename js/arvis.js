function drawGauge(selector, revenueClosed, revenueWon, option) {
    const TOTAL_REVENUE_CLOSED = revenueClosed
    const TOTAL_REVENUE_WON = revenueWon
    const PERCENTAGE_REVENUE_WON = TOTAL_REVENUE_WON / TOTAL_REVENUE_CLOSED * 100
    const LAST_UPDATED = new Date('2021', '04', '29')
    const CANVAS_WIDTH = option.width
    const CANVAS_HEIGHT = option.height
    const VERTICAL_FACTOR = 0.75 // between 0.5 to 1
    const HORIZONTAL_FACTOR = 0.33 // between 0.33 to 0.5
    const ARC_MIN = -Math.PI / 2
    const ARC_MAX = Math.PI / 2
    const THICKNES = CANVAS_HEIGHT / 100 * 8
    const OUTER_RAD = CANVAS_HEIGHT * VERTICAL_FACTOR
    const INNER_RAD = OUTER_RAD - THICKNES
    const CONFIG = {
        textLabelColor: '#9C9C9C',
        foreground1: '#EF2525',
        textBg1: '#FFEFEF',
        foreground2: '#F6863E',
        textBg2: '#FFF0E1',
        foreground3: '#00B098',
        textBg3: '#E5FBFE',
        gaugeBackground: '#E8E8E8',
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        gaugeRadius: OUTER_RAD,
        gaugeThicknes: THICKNES,
        margin: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
        }
    }
    
    const canvas = d3.select(selector)
        .append('svg')
        .attr('style', 'background-color: white')
        .attr('width', CONFIG.width)
        .attr('height', CONFIG.height)
    
    const container = canvas.append('g')
        .attr('transform', `translate(${CONFIG.margin.top}, ${CONFIG.margin.left})`)
    
    /**
     * Gauge
     */
    const p = Math.PI * 2
    const thicknes = CONFIG.gaugeThicknes
    const background = d3.arc()
        .innerRadius(INNER_RAD)
        .outerRadius(OUTER_RAD)
        .startAngle(ARC_MIN)
        .endAngle(ARC_MAX)
        .cornerRadius(thicknes)
    
    const foreground = d3.arc()
        .innerRadius(INNER_RAD)
        .outerRadius(OUTER_RAD)
        .startAngle(ARC_MIN)
        .cornerRadius(thicknes)
    
    const horizontalPosition = CONFIG.width * HORIZONTAL_FACTOR
    const verticalPosition = CONFIG.height * VERTICAL_FACTOR
    const centerBg = container.append('g')
        .attr('transform', `translate(${horizontalPosition}, ${verticalPosition})`)
    const centerFg = container.append('g')
        .attr('transform', `translate(${horizontalPosition}, ${verticalPosition})`)
    
    centerBg.append('path')
        .attr('d', background)
        .attr('fill', CONFIG.gaugeBackground)
    
    const transformer = p => ( { endAngle: (p * 1.8 * Math.PI / 180) - (Math.PI * 0.5) } )
    const percentage = [PERCENTAGE_REVENUE_WON]
    let textFill, textBg
    centerFg.selectAll('path')
        .data(percentage.map(transformer))
        .enter()
        .append('path')
        .attr('d', foreground)
        .attr('fill', (d) => {
            const actual = d.endAngle
            const oneThird = transformer(33.33)
            const twoThird = transformer(66.66)
    
            if (actual <= oneThird.endAngle) {
                textFill = CONFIG.foreground1
                textBg = CONFIG.textBg1
                return CONFIG.foreground1
            }
            if (actual <= twoThird.endAngle) {
                textFill = CONFIG.foreground2
                textBg = CONFIG.textBg2
                return CONFIG.foreground2
            }
            textFill = CONFIG.foreground3
            textBg = CONFIG.textBg3
            return CONFIG.foreground3
        })
    
    /**
     * Percentage text
     */
    const fontFactor = CONFIG.height / 300
    const textPercentage = container.append('g')
        .attr('transform', `translate(${horizontalPosition}, ${verticalPosition * 0.8})`)
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', `${3.5 * fontFactor}em`)
        .attr('fill', textFill)
        .text(`${PERCENTAGE_REVENUE_WON.toFixed(2)}%`)
    
    /**
     * Revenue won text label
     */
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    })
    
    const labelContainer = container.append('g')
        .attr('transform', `translate(${horizontalPosition}, ${verticalPosition})`)
    
    const bgLabelWidth = CONFIG.height * 0.66
    const bgLabelHeight = CONFIG.height * 0.1
    const textLabelBg = labelContainer.append('rect')
        .attr('width', bgLabelWidth)
        .attr('height', bgLabelHeight)
        .attr('x', -bgLabelWidth * 0.5)
        .attr('y', -bgLabelHeight * 0.68)
        .attr('rx', 15)
        .attr('ry', 15)
        .attr('fill', textBg)
        
    const textLabel = labelContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', `${1 * fontFactor}em`)
        .attr('fill', textFill)
        .text(`${formatter.format(TOTAL_REVENUE_WON)}`)
    
    /**
     * Text Range unit
     */    
    const range = [0, 1, 2, 3, 4, 5]
    const gap = TOTAL_REVENUE_CLOSED / range.length
    const rangeLabels = [0, ...range.map((v, i) => (i + 1) * gap)]
    const scale = d3.scaleLinear()
        .domain([0, TOTAL_REVENUE_CLOSED/2, TOTAL_REVENUE_CLOSED])
        .range([ARC_MIN, 0, ARC_MAX])
    const labels = centerFg.selectAll('text')
        .data(rangeLabels)
        .enter()
        .append('text')
        .classed('label', true)
        .attr('x', (d) => {
            const xFactor = CONFIG.gaugeThicknes * 2.5
            const xVal = Math.cos(scale(d) + ARC_MIN) * (OUTER_RAD - xFactor) - (23 * (CONFIG.height / 300))
            return xVal
        })
        .attr('y', (d) => {
            const yFactor = CONFIG.gaugeThicknes * 2.5
            var yVal = Math.sin(scale(d) + ARC_MIN) * (OUTER_RAD - yFactor) - (5 * (CONFIG.height / 300))
            return yVal
        })
        .attr('font-size', `${1 * fontFactor}em`)
        .style('fill', CONFIG.textLabelColor)
        .text((d) => {
            const n = d / 1_000_000_000
            return d3.format('.2f')(n) + 'M'
        })
    
    /**
     * Text range sparator line
     */
    const markerLine = d3.radialLine()
        .angle(scale)
        .radius((d, i) => {
            return INNER_RAD + ((i % 2) * THICKNES * 0.2 - 5)
        })
    
    const markerLines = centerFg.selectAll('path')
        .data([0, ...scale.ticks(5).map(d => ({score: d}))])
        .enter()
        .append('path')
        .attr('class', 'lines')
        .attr('d', (d)=> {
            if (d.score > 0 && d.score < TOTAL_REVENUE_CLOSED) {
                return markerLine([d.score, d.score])
            }
        })
        .style('stroke-width', 2)
        .style('stroke', CONFIG.textLabelColor)
    
    /**
     * Legend
     */
    const legendData = [
        {name: 'High Performance', color: CONFIG.foreground3},
        {name: 'Medium Performance', color: CONFIG.foreground2},
        {name: 'Low Performance', color: CONFIG.foreground1},
    ]
    const legend = centerBg.append('g')
        .selectAll('.legendItem')
        .data(legendData)
    
    const xLegend = OUTER_RAD + 50 * fontFactor
    const yLegend = -40 * fontFactor
    const legendTick = 25 * fontFactor
    const legendRad = 5 * fontFactor
    const marginTop = -100 * fontFactor
    const colorsLegend = legend.enter()
        .append('rect')
        .attr('width', legendTick)
        .attr('height', legendTick)
        .attr('rx', legendRad)
        .attr('ry', legendRad)
        .style('fill', d => d.color)
        .attr('transform', (d, i) => {
            const y = yLegend * i + marginTop
            return `translate(${xLegend}, ${y})`   
        })
    
    const textLegend = legend.enter()
        .append('text')
        .attr('x', xLegend + legendTick * 1.5)
        .attr('y', (d, i) => {
            return yLegend * i + marginTop + 18 * fontFactor
        })
        .attr('font-size', `${1 * fontFactor}em`)
        .style('fill', CONFIG.textLabelColor)
        .text(d => d.name)
}

drawGauge('#arvis', 6_000_000_000, 4_900_000_000, {
    width: 800,
    height: 300
})
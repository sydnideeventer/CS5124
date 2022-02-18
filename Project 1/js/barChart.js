class BarChart{
    constructor(_config, _data){

        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: { top: 10, bottom: 30, right: 50, left: 50 },
            tooltipPadding: _config.tooltipPadding || 15
          }

        this.data = _data;
        this.initVis();
    }

    initVis(){

        let vis = this; 
  
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
        vis.xValue = d => d.year;
        vis.yValue = d => d.value;
        
        vis.yScale = d3.scaleLinear()
          .domain(d3.extent(vis.data, vis.yValue)) //max from sales field in the objects in the data array
          .range([vis.height, 0]);

        vis.xScale = d3.scaleBand()
            .domain(vis.data.map(vis.xValue)) //list of the month field in the objects in the data array
            .range([0, vis.width])
            .paddingInner(0.2);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);


        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        //// Draw the axis
        //// Append x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`)
            .call(vis.xAxis)

        // Append y-axis group
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis)

        // Add rectangles
        vis.chart.selectAll('.bar')
          .data(vis.data)
          .enter()
        .append('rect')
          .attr('class', 'bar')
          .style('fill', '#4db391')
          .attr('width', vis.xScale.bandwidth())
          .attr('height', function (d) {return vis.height - vis.yScale(d.value)})
          .attr('y', d => vis.yScale(d.value))
          .attr('x', d => vis.xScale(d.year));
    

    //Add Labels
    // vis.chart.append("text")
    //     .attr("transform", "translate(100,0)")
    //     .attr("x", 50)
    //     .attr("y", 20)
    //     .attr("font-size", "24px")
    //     .text("Percentage of AQI Categories from 1980-2021")
      
    }

}
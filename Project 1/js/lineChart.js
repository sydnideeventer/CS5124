class LineChart {

    constructor(_config, _data, _legendSVG, _legendKeys, _colorScheme) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 400,
        containerHeight: _config.containerHeight || 150,
        margin: { top: 10, bottom: 30, right: 10, left: 30 },
        tooltipPadding: _config.tooltipPadding || 15
      }
     
      this.data = _data;  
      this.legendSVG = d3.select(_legendSVG)
                          .attr('height', 100)
                          .attr('width', 1000);
      this.legendKeys = _legendKeys;
      this.colorScheme = _colorScheme;
      this.initVis();
    }
  
    initVis() {
        
      let vis = this; 
  
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

      vis.groups = d3.groups(vis.data, d => d.class);

      vis.xValue = d => d.year;
      vis.yValue = d => d.value;
  
      //setup scales
      vis.xScale = d3.scaleLinear()
          .domain(d3.extent(vis.data, vis.xValue)) //d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year) );
          .range([0, vis.width]);
      
      vis.yScale = d3.scaleLinear()
          .domain(d3.extent(vis.data, vis.yValue))
          .range([vis.height, 0])
          .nice(); 

        console.log("YScale is setup");

      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // Append group element that will contain our actual chart (see margin convention)
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale);
      vis.yAxis = d3.axisLeft(vis.yScale);
  
      // Append x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`)
          .call(vis.xAxis);
      
      // Append y-axis group
      vis.yAxisG = vis.chart.append('g')
          .attr('class', 'axis y-axis')
          .call(vis.yAxis);
  
 
    // Create lines

    vis.colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
    vis.colorPalette.domain(vis.legendKeys);

    vis.colors = d3.scaleOrdinal()
        .domain(vis.legendKeys)
        .range(vis.colorScheme);

    // Add one dot in the legend for each name.
    var size = 15
    vis.legendSVG.selectAll("mydots")
      .data(vis.legendKeys)
      .enter()
      .append("rect")
        .attr("x", function(d,i){ return  20 + i*(size+150)})
        .attr("y", 10)
        .attr("width", size)
        .attr("height", size)
        .style("fill", d => vis.colors(d))

    // Add one dot in the legend for each name.
    vis.legendSVG.selectAll("mylabels")
      .data(vis.legendKeys)
      .enter()
      .append("text")
        .attr("x", function(d,i){ return 32 + i*(size+150) + (size/2)})
        .attr("y", size*1.5)
        .text(function(d){ return d})
        .attr("text-anchor", "left")

    vis.chart.selectAll(".circle")
      .data(data)
      .join("path");
    
    vis.chart.selectAll(".line")
      .data(vis.groups)
      .join("path")
      .attr("stroke", (d) => vis.colors(d))
      .attr('fill', "none")
      .attr('stroke-width', 2)
      .attr('d', function (d) {
        return d3.line()
          .x(d => {return vis.xScale(d.year);})
          .y(d => {return vis.yScale(d.value);})(d[1])
      });

}
  
    //leave this empty for now
   updateVis() { 

     
  
   }
  
  
   //leave this empty for now...
   renderVis() { 

  
    }
  
    
  }
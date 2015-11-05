---
layout: post
title:  "Basic Donut Chart"
date:   2015-11-05 11:07:39 -0800
categories: d3
custom_js: 
- donutchart
custom_data:
- donut.csv
---

This is a basic donut chart. It uses d3's pie layout and arc methods. Please don't make pie charts. They are ugly and less readable.

{% highlight javascript %}

// Start by setting the basic attributes for the donut chart.
function DonutChart(file, width, height) {
  this.file = file;
  this.width = width || 500;
  this.height = height || 500;
  this.svg = d3.select("#chart").append("svg")
               .attr("width", this.width)
               .attr("height", this.height)
               .append("g")
               .attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")");

  // Once all of the properties are set, initialize data load. The chart will be drawn once
  // the data finishes loading. D3's data load methods are asynchronous, so the drawing logic
  // generally needs to happen inside the data load callback unless you use a method like
  // jQuery promises, pub/sub, etc.
  this.getData();
}

DonutChart.prototype.getData = function() {
  var donutChart = this; // Preserve the scope so the draw() method can be called from inside the d3.csv callback.

  d3.csv(this.file, function(error, data) {
    if(error) throw error;

    // Now that the data is properly formatted, draw the chart
    donutChart.draw(data);
  });
}

DonutChart.prototype.draw = function(data) {
  // Define basic layout settings for the donut chart. The radius is used to determine placement of the
  // different slices, while d3.svg.arc() defines a curve with outer and inner edges. Leave innerRadius off
  // to create a donut chart instead (except actually don't)
  var svg = this.svg,
      width = this.width,
      height = this.height,
      radius = Math.min(width, height) / 2,
      arc = d3.svg.arc()
              .outerRadius(radius * 0.9)
              .innerRadius(radius * 0.5);

 // d3's basic color scale is pretty ugly, so we are defining custom colors here. If you wanted to get really modular, 
 // you could make the color range an argument.
 var color = d3.scale.ordinal()
        .range(['#DADFE7', '#B2C3D1', '#7699B0', '#3a6f8f']);

  var pie = d3.layout.pie()
              .startAngle(1.1 * Math.PI)
              .endAngle(3.1 * Math.PI)
              .value(function(d) { return d.val })
              .sort(null);

  // Append a slice for each item in the dataset
  var slice = svg.selectAll('.slice')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'slice');

  slice.append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) { 
        return color(d.data.fruit);
      });

  slice.append('text')
      .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d,i) { return d.data.fruit; });
}

{% endhighlight %}
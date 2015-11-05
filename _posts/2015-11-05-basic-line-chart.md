---
layout: post
title:  "Basic Line Chart"
date:   2015-11-05 11:07:39 -0800
categories: d3
custom_js: 
- linechart
custom_data:
- linechart.csv
---

This line chart is based on the data from D3 Tips and Tricks; the original can be seen
[here](http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5).

The big difference is that the code is split into a few different functions. This line chart is written as an extensible module rather than a loose, global script, so you can use it as the basis for different variations on a line chart.

The chart is called at the end of the script with 

`var lineChart = new LineChart("/data/linechart.csv", 600, 270);`, 

but that could occur anywhere in your application.

{% highlight javascript %}

/*
 BASIC LINE CHART

 This file implements a basic line chart using D3.js.
*/

function LineChart(file, width, height) {
  this.file = file;
  this.margin = {top: 20, right: 20, bottom: 30, left: 50};
  this.width = width || 900;
  this.height = height || 500;
  this.svg = d3.select("#chart").append("svg")
               .attr("width", this.width + this.margin.left + this.margin.right)
               .attr("height", this.height + this.margin.top + this.margin.bottom)
               .append("g")
               .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  // Once all of the properties are set, initialize data load. The chart will be drawn once
  // the data finishes loading. D3's data load methods are asynchronous, so the drawing logic
  // generally needs to happen inside the data load callback unless you use a method like
  // jQuery promises, pub/sub, etc.
  this.getData();
}

LineChart.prototype.getData = function() {
  var lineChart = this, // Preserve the scope so the draw() method can be called from inside the d3.csv callback.
      parseDate = d3.time.format("%d-%b-%y").parse;

  d3.csv(this.file, function(error, data) {
    if(error) throw error;

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    // Now that the data is properly formatted, draw the chart
    lineChart.draw(data);
  });
}

LineChart.prototype.draw = function(data) {
  var svg = this.svg;

  // Set the ranges
  var x = d3.time.scale().range([0, this.width]);
  var y = d3.scale.linear().range([this.height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5);

  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

  // Define the line
  var valueline = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  // Add the valueline path.
  svg.append("path")
      .attr("class", "line")
      .attr("d", valueline(data));

  // Add the X Axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis);

  // Add the Y Axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
}

{% endhighlight %}
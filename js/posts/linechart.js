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

var lineChart = new LineChart("/data/linechart.csv", 600, 270);
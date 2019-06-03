// -- GROUPED BAR CHART on level of highest school qualifactions --
// Colours of the different categories of mental illnesses
var coloursSchool = d3v3.scale.ordinal()
.range(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"]);

// Size of graph
// Margin is the space between the top, right, bottom and left
// Top = how long the graph is
// Bottom = moves the x axis up or down
// Left = how far the graph is from the left side of the screen
var margin = {top: 20, right: 50, bottom: 145, left: 50},
width = 650 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// Responsible for drawing out the levels of school qualifications
var x0 = d3v3.scale.ordinal()
.rangeRoundBands([0, width], .1);

// Responsible for drawing out the 4 types of mental disorders
var x1 = d3v3.scale.ordinal();

// Responsible for drawing out the number of people it affects ('000')
var y = d3v3.scale.linear()
.range([height, 0]);

// Draws out the x Axis on the bottom
var xAxis = d3v3.svg.axis()
.scale(x0)
.orient("bottom");

// Draws out the y Axis on the left
var yAxis = d3v3.svg.axis()
.scale(y)
.orient("left");

// Create SVG element
var svg = d3v3.select('#graph').append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Loads in json file
d3v3.json("data.json", function(error, data) {
  var rateNames = data[0].values.map(function(d) { return d.rate; });
  var characteristicNames = data.map(function(d) { return d.characteristic; });

  x0.domain(characteristicNames);
  x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3v3.max(data, function(characteristic) { return d3v3.max(characteristic.values, function(d) { return d.value; }); })]);

  // Draw the x axis
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  // Draw the y axis
  svg.append("g")
  .attr("class", "y axis")
  .style('opacity','0')
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .style('font-weight','bold')
  .text("Number ('000)");

  // Animation for Y Axis
  svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

  // Seperates each characteristic (level of school qualifications)
  var sliceSchool = svg.selectAll(".sliceSchool")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "g")
  .attr("transform",function(d) { return "translate(" + x0(d.characteristic) + ",0)"; });

  // Draws the bars
  sliceSchool.selectAll("rect")
  .data(function(d) { return d.values; })
  .enter().append("rect")
  // rangeBand allows evenly divided space on the x axis
  .attr("width", x1.rangeBand())
  .attr("x", function(d) { return x1(d.rate); })
  .style("fill", function(d) { return coloursSchool(d.rate) })
  .attr("y", function(d) { return y(0); })
  .attr("height", function(d) { return height - y(0); })

  // When mouse hovers over a bar...
  .on("mouseover", function(d) {
    // Make the colour of the bar darker
    d3v3.select(this).style("fill", d3v3.rgb(coloursSchool(d.rate)).darker(1))
    // Simple Browser Tool Tip
    .append("title")
    .text(function(d){
      // Returns number of people ('000')
      return "Number of People ('000): " + d.value;
    });
  })

  // When mouse hovers outside of a bar...
  .on("mouseout", function(d) {
    // Changes the colour back to the original colour
    d3v3.select(this).style("fill", coloursSchool(d.rate));
  });

  // Transitions the bars
  sliceSchool.selectAll("rect")
  .transition()
  // Randomly chooses which bars appear first and the time it takes to finish this calculation
  .delay(function (d) {return Math.random()*2000;})
  // Duration of the animation
  .duration(1000)
  // What is transitioned...
  .attr("y", function(d) { return y(d.value); })
  .attr("height", function(d) { return height - y(d.value); });

  //Legend
  var legend = svg.selectAll(".legend")
  .data(data[0].values.map(function(d) { return d.rate; }))
  .enter().append("g")
  .attr("class", "legend")
  // How spaced out the legend is
  .attr("transform", function(d,i) { return "translate(0," + i * 25 + ")"; })
  .style("opacity","0");

  // Draws out the legend as rectangles
  legend.append("rect")
  // Where the rectanges are drawn on the screen
  .attr("x", width)
  // width and height of the squares for legends
  .attr("width", 18)
  .attr("height", 18)
  .attr("id", "legendSchool")
  // Returns the colours of the bars
  .style("fill", function(d) { return coloursSchool(d); });

  // Draws out the text of Mental Disorders next to the rectangles
  legend.append("text")
  // How close the text is to the rectangles
  .attr("x", width - 5)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .style("text-align", "left")
  .text(function(d) {return d; });

  // Title for X Axis - School Qualifications
  svg.append("text")
  .attr("class", "label")
  .attr("x", width / 2)
  .attr("y", height + 40)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .text("School Qualifications");

  // Title for School Qualifications Graph --
  svg.append("text")
  .attr("class", "title")
  .attr("id", "schoolGraphTitle")
  // lines up the title to the centre of the graph
  .attr("x", width / 2)
  // changes the Y positioning of the title
  .attr("y", height - 340)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  // What the text displays
  .text("- MENTAL DISORDERS BASED ON SCHOOL QUALIFICATIONS -");

  // Sets a transition for the legend to take 500 but delay it so it comes after the graph animation
  legend.transition().duration(500).delay(function(d,i){ return 2000 + 100 * i; }).style("opacity","1");

});


// -- GROUPED BAR CHART on smoker status --

// Colours of the different categories of mental illnesses
var coloursSmoker = d3v3.scale.ordinal()
.range(["#e41a1c", "#377eb8", "#984ea3", "#ff7f00"]);

// Size of graph
// Margin is the space between the top, right, bottom and left
var marginSmoker = {topSmoker: 20, rightSmoker: 30, bottomSmoker: 145, leftSmoker: 50},
widthSmoker = 650 - marginSmoker.leftSmoker - marginSmoker.rightSmoker,
heightSmoker = 500 - marginSmoker.topSmoker - marginSmoker.bottomSmoker;

// Responsible for drawing out the levels of smoking status
var x0Smoker = d3v3.scale.ordinal()
.rangeRoundBands([0, widthSmoker], .1);

// Responsible for drawing out the 4 types of mental disorders
var x1SmokerDis = d3v3.scale.ordinal();

// Responsible for drawing out the number of people it affects ('000')
var ySmokerPeople = d3v3.scale.linear()
.range([heightSmoker, 0]);

// Draws out the x Axis on the bottom
var xAxisSmoker = d3v3.svg.axis()
.scale(x0Smoker)
.tickSize(0)
.orient("bottom");

// Draws out the y Axis on the left
var yAxisSmoker = d3v3.svg.axis()
.scale(ySmokerPeople)
.orient("left");

// Create SVG element
var svgSmoker = d3v3.select('#graph2').append("svg")
.attr("width", widthSmoker + marginSmoker.leftSmoker + marginSmoker.rightSmoker)
.attr("height", heightSmoker + marginSmoker.topSmoker + marginSmoker.bottomSmoker)
.append("g")
.attr("transform", "translate(" + marginSmoker.leftSmoker + "," + marginSmoker.topSmoker + ")");

// Loads in json file
d3v3.json("data2.json", function(error, data) {

  var characteristicNames = data.map(function(d) { return d.characteristic; });
  var rateNames = data[0].values.map(function(d) { return d.rate; });

  x0Smoker.domain(characteristicNames);
  x1SmokerDis.domain(rateNames).rangeRoundBands([0, x0Smoker.rangeBand()]);
  ySmokerPeople.domain([0, d3v3.max(data, function(characteristic) { return d3v3.max(characteristic.values, function(d) { return d.value; }); })]);

  // Draw the x axis
  svgSmoker.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + heightSmoker + ")")
  .call(xAxisSmoker);

  // Draw the y axis
  svgSmoker.append("g")
  .attr("class", "y axis")
  .style('opacity','0')
  .call(yAxisSmoker)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .style('font-weight','bold')
  .text("Number ('000)");

  // Animation of Y Axis
  svgSmoker.select('.y').transition().duration(500).delay(1300).style('opacity','1');

  // Returns the bars in the group based on their characteristic
  var sliceSmoker = svgSmoker.selectAll(".sliceSmoker")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "g")
  // Draws the other groups of bars to the graph
  .attr("transform",function(d) { return "translate(" + x0Smoker(d.characteristic) + ",0)"; });

  sliceSmoker.selectAll("rect")
  .data(function(d) { return d.values; })
  .enter()
  .append("rect")
  .attr("width", x1SmokerDis.rangeBand())
  .attr("x", function(d) { return x1SmokerDis(d.rate); })
  .style("fill", function(d) { return coloursSmoker(d.rate) })
  .attr("y", function(d) { return ySmokerPeople(0); })
  .attr("height", function(d) { return heightSmoker - ySmokerPeople(0); })

  // When mouse hovers over a bar...
  .on("mouseover", function(d) {
    // Make the colour of the bar darker
    d3v3.select(this).style("fill", d3v3.rgb(coloursSmoker(d.rate)).darker(1))
    // Simple Browser Tool Tip
    .append("title")
    .text(function(d){
      // Returns number of people ('000')
      return "Number of People ('000): " + d.value;
    });
  })
  // When mouse hovers outside of a bar...
  .on("mouseout", function(d) {
    // Changes the colour back to the original colour
    d3v3.select(this).style("fill", coloursSmoker(d.rate));
  });

  // Transitions the bars
  sliceSmoker.selectAll("rect")
  .transition()
  .delay(function (d) {return Math.random()*2000;})
  .duration(1000)
  .attr("y", function(d) { return ySmokerPeople(d.value); })
  .attr("height", function(d) { return heightSmoker - ySmokerPeople(d.value); });

  // LEGEND FOR SMOKING STATUS ---
  var legendSmoker = svgSmoker.selectAll(".legendSmoker")
  .data(data[0].values.map(function(d) { return d.rate; }))
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d,i) { return "translate(0," + i * 25 + ")"; })
  .style("opacity","0");
  // Draws out the legend as rectangles
  legendSmoker.append("rect")
  .attr("x", widthSmoker - 18)
  .attr("width", 18)
  .attr("height", 18)
  .attr("id", "legendSmoking")
  .style("fill", function(d) { return coloursSmoker(d); });
  // Draws out the text of Mental Disorders next to the rectangles
  legendSmoker.append("text")
  .attr("x", widthSmoker - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) {return d; });

  // Title for X Axis - Smoking Status
  svgSmoker.append("text")
  .attr("class", "label")
  .attr("x", widthSmoker / 2)
  .attr("y", heightSmoker + 40)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .text("Smoking Status");

  // Title for Smoking Status --
  svgSmoker.append("text")
  .attr("class", "title")
  .attr("id", "smokingGraphTitle")
  // lines up the title to the centre of the graph
  .attr("x", widthSmoker / 2)
  // changes the Y positioning of the title
  .attr("y", heightSmoker - 340)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .text("- MENTAL DISORDERS BASED ON SMOKING STATUS -");

  // Sets a transition for the legend to take 500 but delay it so it comes after the graph animation
  legendSmoker.transition().duration(500).delay(function(d,i){ return 2000 + 100 * i; }).style("opacity","1");
});

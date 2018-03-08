// D3 Scatterplot Assignment
// Set up chart
var svgWidth = 960;
var svgHeight = 500;
var margin = { top: 20, right: 40, bottom: 80, left: 100 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create SVG wrapper and append SVG element to hold chart
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  // .append("g") ***********************************************************
  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append a div to the bodyj to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
// Retrieve data from the CSV file and execute everything below
d3.csv("data/fullset.csv", function(err, ownEd) {
  if (err) throw err;
  ownEd.forEach(function(data) {
  	data.id = +data.id;
  	data.state = data.state;
  	data.abbr = data.abbr;
    // data.college = +data.college;
    // data.own = +data.own;
    // data.divorced = +data.divorced;
    // data.smokers = +data.smokers;
    data.obese = +data.obese;
    data.income = +data.income;
  });
  
// Create axis scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);
  var xLinearScale = d3.scaleLinear()
    .range([0, width]);
  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  // Scale the domain
  xLinearScale.domain([15000, d3.max(ownEd, function(data) {
    return +data.income * 1.1;
  })]);
  yLinearScale.domain([20, d3.max(ownEd, function(data) {
    return +data.obese * 1.05;
  })]);
  // Append an SVG group
  // var chart = svg.append("g"); **********************************
  var chart = svg.selectAll("g")
    .data(ownEd) // note data is mated one element level higher than taught in class
  var Nchart = chart.enter()
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// setup tooltip to show details on click
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([100, -60])
    .html(function(data) {
      var stateName = data.state;
      // var percOwn = +data.own;
      // var percCol = +data.college;
      // var percDiv = +data.divorced;
      // var percsmk = +data.smokers;
      var percObe = +data.obese;
      var medInc = +data.income;
      return (stateName + "<br> Obesity (%): " + percObe + "<br> Median Income: " + medInc);
    });

  Nchart.call(toolTip);
// append circle svg elements
  // chart.selectAll("circle")
    // .data(ownEd)
    // .enter().append("circle")
      // .attr("class", "abrev") *********************
  Nchart.append("circle")
    .attr("cx", function(data, index) {
      // console.log(data.college);
      return xLinearScale(data.income);
    })
    .attr("cy", function(data, index) {
      return yLinearScale(data.obese*1.01);
    })
    .attr("r", "15")
    .attr("fill", "purple")
    .attr("opacity", ".7")
    .on("click", function(data) {
      toolTip.show(data);
    })
    // on mouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    })
  // append text to place abbr in circle
  Nchart.append("text")
    .attr("dx", function(data, index) {
      return xLinearScale(data.income);
    })
    .attr("dy", function(data, index) {
      return yLinearScale(data.obese);
    })
    .text(function(data, index) {
      return data.abbr;
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", "white")
    .on("click", function(data) {
      toolTip.show(data);
    })
    // on mouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    })  
  Nchart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  Nchart.append("g")
    .call(leftAxis);
  Nchart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Median Income USD");
// Append x-axis labels
  Nchart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Percent Obese");

});
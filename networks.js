console.log("In networks.js");

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'dataset/network.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
          console.log("good");
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

function init() {
var data = [];
 loadJSON(function(response) {
  // Parse JSON string into object
  var actual_JSON = JSON.parse(response);
  for (i in actual_JSON){
  data.push(actual_JSON[i]);
  }
 });
return data;
}
var networkData = init();



function filterGraph(networkData){
var date1 = new Date(date1Handle.value);
var date2 = new Date(date2Handle.value);
var airportCode = depAirportHandle.value;
//console.log(date1);
//console.log(date2);
//console.log("in date filter function");
//console.log(networkData);

var filteredNetwork1 = networkData.filter(function(d) {
    //console.log(d.Date);
    var date= d.Date.split("/");
    var dateTime = new Date("20".concat(date[2]), date[0] - 1, date[1]);
    console.log(dateTime);
    return (dateTime.getTime() >= date1.getTime() && dateTime.getTime() <= date2.getTime());
});


var filteredNetwork2 = filteredNetwork1.filter(function(d) {
    return (d.Dep == airportCode);
});

return filteredNetwork2;

console.log("done filtering");
}

console.log(networkData);
var FilteredNetwork = filterGraph(networkData);
console.log(FilteredNetwork); // filter by date and departure airport



/*
var nodes = {}

// Compute the distinct nodes from the links.
FilteredNetwork.forEach(function(link) {
    link.Dep = nodes[link.Dep] ||
        (nodes[link.Dep] = {name: link.Dep});
    link.Arr = nodes[link.Arr] ||
        (nodes[link.Arr] = {name: link.Arr});
});

console.log("NODES");
console.log(nodes);

var width = 1200,
    height = 700;

var force = d3.forceSimulation()
    .nodes(d3.values(nodes))
    .force("link", d3.forceLink(links).distance(100))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("charge", d3.forceManyBody().strength(-250))
    .alphaTarget(1)
    .on("tick", tick);

var svg = d3.select("networkViz").append("svg")
    .attr("width", width)
    .attr("height", height);

// add the links and the arrows

var path = svg.append("g")
.selectAll("path")
.data(links)
.enter()
.append("path")
.attr("class", function(d) { return "link " + d.type; })
.style("stroke", linkColor)
.style("stroke-width", strokeType)
.style("stroke-dasharray", dashedCont);
console.log(force.nodes());
// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .classed("fixed", function(d){return d.fixed = false;})
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
      .on("dblclick", dblclick);



// add the nodes
node.append("circle")
    .attr("r", function(d) {
     //console.log(links);
     var filtered_array = links.filter(function(l) {
       return l.source.index == d.index || l.target.index == d.index
     });
     d.weight = filtered_array.length;
     var radScale = d3.scaleLinear().domain([d3.min(force.nodes(), function(d) { return d.weight;}),d3.max(force.nodes(), function(d) { return d.weight;})]).range([5, 15]);
     return radScale(d.weight);
   })
   .style("fill", function(d) {
     var maxDegree = d3.max(force.nodes(), function(d){return d.weight;});
     return perc2color(100*(d.weight/maxDegree));
   });

node.append("text")
    .attr("dx", 9)
    .attr("dy", -8)
    .text(function(d) {return d.name});


consolePrint(force.nodes());



// Percent node degree --> node color
function perc2color(perc) {
	var r, g, b = 0;
	if(perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	}
	else {
		g = 255;
		r = Math.round(510 - 5.10 * perc);
	}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}


function consolePrint(data){
  for (let d of Object.values(data)){
      console.log(d.name);
  }
}


function linkColor(d){
  return (d.value == 0) ? "black" : "green";
};

function strokeType(d){
  return (d.value == 0) ? "1.5" : "3";
};

function dashedCont(d){
  return (d.value == 0) ? 4 : 0;
};

// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
    });

    node
        .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"; })
};

function dragstarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
};

function dragended(d) {
  if (!d3.event.active) force.alphaTarget(0);
  if (d.fixed == true){
     d.fx = d.x;
     d.fy = d.y;
  }
  else{
    d.fx = null;
    d.fy = null;
  }

};

function dblclick(d){
  //this.on("click", singleclick)
  if(!d.fixed) {
   d3.select(this).classed("fixed", d.fixed=true).style("stroke","pink");
 }
  else if(d.fixed) {
     d3.select(this).classed("fixed", d.fixed=false).style("stroke","none");
   }
};

function singleclick(d){
  d.fixed = !d.fixed;
}

*/
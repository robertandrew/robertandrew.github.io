//set global variables
var duration = 2000;
var delay = 50;
var ports;
var chartWidth = 100;
var svgMargin = 50;
var w = window.innerWidth - svgMargin * 2;
var h = (window.innerHeight) - svgMargin * 2;
var radius = w/10;

//set up the furniture
//declare scales and axes

var scaleX = d3.time.scale().range([0 + radius,w - radius]);
	
var scaleY = d3.scale.linear().range([h, 0]);

var scaleR = d3.scale.sqrt().range([0,radius]);

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('top');

var colors = d3.scale.ordinal()
	.domain(['Russians','Ukrainians','CrimeanTatars'])
	.range(['red','steelblue','orange']);	


var parseDate = d3.time.format('%Y').parse;

var svg = d3.select('div.viz').append('svg')
	.attr('width',w + svgMargin * 2)
	.attr('height',h + svgMargin * 2);

var visCon = svg.append('g')
	.attr('transform','translate(' + svgMargin + "," + svgMargin + ")");

function porter(){
	visCon.selectAll('circle')
		.data(ports)
		.enter()
		.append('circle')
		.attr('opacity','0.5')
		.attr('cx',function(d){return scaleX(d.year)})
		.attr('cy',function(d){return scaleY(d.lat)})
		.attr('r',function(d){return scaleR(d.share)})
		.attr('fill',function(d){return colors(d.nationality)})
		
		.append('title')
		.text(function(d){return d.nationality + " " + d.share});		
	
	visCon.selectAll('text')
		.data(ports)
		.enter()
		.append('text')
		.attr('x',0)
		.attr('text-anchor','end')
		.attr('y',function(d){return scaleY(d.lat)})
		.text(function(d){return d.nationality})
		.attr('class','dek');
			
	}

//DATA DEPENDENT
//load the csv
d3.tsv('krim3.tsv',function(error,data){		
	data.forEach(function(d){
		d.year = parseDate(d.year);
		d.share = +d.share;
		d.lat = +d.lat;
		});//CLOSE ports forEach				
	ports = data;
	scaleY.domain(d3.extent(ports,function(d){return d.lat}));
	scaleX.domain(d3.extent(ports,function(d){return d.year}));
	scaleR.domain([0, d3.max(ports,function(d){return d.share})]);
	
	visCon.append('g').attr('class','axis')
		.call(xAxis);

	visCon.append('g').attr('class','axis')
		.call(xAxis)
		.attr('transform','translate(0,' + (h + svgMargin) + ')');


	porter();

});//CLOSE ports csv


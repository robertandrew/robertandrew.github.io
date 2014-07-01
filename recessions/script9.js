//set global variables
var duration = 2000;
var delay = 50;
var ports;
var chartWidth = 100;
var svgMargin = 50;
var w = window.innerWidth - svgMargin * 2;
var h = (window.innerHeight) - svgMargin * 2;
var radius = w/15;

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
	
	pGroups = visCon.append('g').selectAll('g')
		.data(ports)
		.enter()
		.append('g');
	
	pGroups.append('text')
		.attr('text-anchor','end')
		.attr('x',0)
		.attr('y',function(d){return scaleY(d.values[0].lat)})
		.attr('dy','0.5em')
		.text(function(d){return d.key});

	var circler = pGroups.selectAll('circle')
		.data(function(d,i){		
			return d.values;})
		.enter()
		.append('circle')
		.style('opacity','0.5')
		.attr('cx',function(d){return scaleX(d.year)})
		.attr('cy',function(d){return scaleY(d.lat)})
		.attr('r',0)
		.style('fill',function(d){return colors(d.nationality)})
		
		.append('title')
		.text(function(d){return d.nationality + " " + d.share});
		
	var flasher = pGroups.selectAll('text')
		.data(function(d,i){
			return d.values;})
		.enter()
		.append('text')
		.attr('x',function(d){return scaleX(d.year)})
		.attr('y',function(d){return scaleY(d.lat)})
		.style('text-anchor','middle')
		.style('fill','black')
		.style('opacity',0.5)
		.style('dy','0.5em')
		.attr('class','flash');
		
	d3.selectAll('div.viz g text.flash')
		.transition()
		.duration(duration)		
		.delay(function(d){return scaleX(d.year) * 10})
		.text(function(d){return d.share + "%"});
		
	
	d3.selectAll('div.viz g circle').transition()
		.duration(duration)
		.delay(function(d){return scaleX(d.year) * 10})
		.attr('r',function(d){return scaleR(d.share)});		
	
	visCon.append('g').attr('id','labels')
		.selectAll('text')
		.data(ports)
		.enter()
		.append('text')
		.attr('class','dek')
		.attr('x',0)
		.attr('text-anchor','end')
		.attr('y',function(d){return scaleY(d.lat)})
		.text(function(d){return d.nationality});
			
	}

//DATA DEPENDENT
//load the csv
d3.tsv('krim3.tsv',function(error,data){		
	data.forEach(function(d){
		d.year = parseDate(d.year);
		d.share = +d.share;
		d.lat = +d.lat;
		});//CLOSE ports forEach				
	
	scaleY.domain(d3.extent(data,function(d){return d.lat}));
	scaleX.domain(d3.extent(data,function(d){return d.year}));
	scaleR.domain([0, d3.max(data,function(d){return d.share})]);
		
	ports = d3.nest()
		.key(function(d){return d.nationality})
		.entries(data);
	
	visCon.append('g').attr('class','axis')
		.call(xAxis);

	visCon.append('g').attr('class','axis')
		.call(xAxis)
		.attr('transform','translate(0,' + (h + svgMargin) + ')');


	porter();

});//CLOSE ports csv


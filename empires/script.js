//declare global variables
var duration = 2000;
var delay = 50;
var chartHeight = 70;
var pad = 20;
var paddingMultiplier = 1.5;
var emps;
var sYear = 0;
var w = window.innerWidth - pad * 2;
var h = (window.innerHeight * 0.6) - pad * 2;

	
var scaleY = d3.scale.linear().range([chartHeight, 0]);

var scaleX = d3.scale.linear().range([0,w]);

var keyer = d3.scale.ordinal();

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom');

var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left');
	
var colorize = d3.scale.category20();
	
var colors = d3.scale.ordinal()
	.range(['red','orange','blue','steelblue','purple','gray','green']);	

var parseDate = d3.time.format('%x').parse;

//Window/HTML functions

d3.select('#sYear').on('input',function(){
	sYear = +this.value;
	console.log(sYear);
	update()	
	bars();	
	});

var svg = d3.select('div.viz')
	.append('svg')
	.attr('width',w + pad + pad)
	.attr('height',h + pad * pad);
	
var viz = svg.append('g')
	.attr('transform', 'translate(' + pad + ',' + pad + ')');
	
	viz.append('g').attr('class','axis').attr('id','y');		
	viz.append('g').attr('class','axis').attr('id','x')
		.attr('transform','translate(0,' + (h) + ')');
	

function update(){

	d3.select('#sYear-value').text(sYear);
	d3.select('#sYear').property('value',sYear);
	
		
	
	}	
	
function bars(){
	var filtered = emps.filter(function(d){return d.peak >= sYear});
	console.log(filtered);	
	
	scaleX.domain(d3.extent(filtered,function(d){return d.peak}));
	scaleY.domain([0, d3.max(filtered, function(d){return d.km})]);
	
	var radius = w / filtered.length;	
	
	viz.select('g#y').call(yAxis);		
	viz.select('g#x').call(xAxis)
		.attr('transform','translate(0,' + (h) + ')');
	
	var circles = viz.selectAll('circle');
	
	circles.data(filtered)
		.enter()
		.append('circle');
		
	circles
		.attr('r',radius)
		.attr('cx',function(d){return scaleX(d.peak)})
		.attr('cy',function(d){return scaleY(d.km)})
		.attr('fill',function(d){return colors(d.empire)});	
	
	circles.exit().remove();	
		
	
	
	}

//DATA DEPENDENT
d3.tsv('empires.tsv',function(error,data){
	data.forEach(function(d){
		d.peak = +d.peak;
		d.percent = +d.percent;
		d.km = +d.km;
				
		})//close empires foreach
		
				
		emps = data;
		
		update(sYear);
	})//end empires tsv

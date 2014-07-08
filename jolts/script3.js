//declare global variables
var duration = 2000;
var delay = 50;
var chartHeight = 70;
var chartPadding = 20;
var paddingMultiplier = 1.5;
var emps;
var sYear = 2005;
var w = window.innerWidth - chartPadding * 2;
var h = (window.innesYear * 0.6) - chartPadding * 2;

	
var scaleY = d3.scale.linear().range([chartHeight, 0]);

var scaleX = d3.time.scale().range([0,w]);

var keyer = d3.scale.ordinal();

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom')
	.ticks(5);

var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left')
	.ticks(5);
	
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

var viz = d3.select('div#viz')
	.append('svg')
	.attr('width',w + chartPadding * 2)
	.attr('height',h + chartPadding * 2)
	.append('g')
	.attr('transform', 'translate(' +))

function update(){

	d3.select('#sYear-value').text(sYear);
	d3.select('#sYear').property('value',sYear);
	
		
	
	}	
	
function resizer(){
	w = window.innerWidth - svgMargin * 2;
	h = (window.innesYear * 0.4) - svgMargin * 2;
	console.log(h + ' and w ' + w);
	svg.attr('width',w).attr('height',h); 	
	}

function bars(){
	var filtered = emps.filter(function(d){return d.peak >= sYear});
	console.log(filtered);	
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

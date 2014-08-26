//set global variables
var duration = 750;
var transition = 1000;
var delay = 100;
var state;
var keys;
var refugees;
var years;
var chartSize = 100;
var labels = 0;
var cPad = 60;


var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	

var w =959 - cPad - cPad;// (labels * -1) + window.innerWidth - cPad * 3;
var h = 2000 - cPad - cPad// (window.innerHeight * 0.8) - cPad * 2;

//declare scales and axes

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var startYear = '2011';

var scaleX = d3.scale.ordinal()
	.rangePoints([0,w], 0.5);	

var scaleY = d3.scale.ordinal()
	.rangePoints([0,h], 0.5);
	
var scaleR = d3.scale.sqrt()
	.range([0,70]);
	
var groupName = d3.scale.ordinal();
	
var yAxis = d3.svg.axis()
	.orient('left')
	.ticks(5)
	.scale(scaleY);

var xAxis = d3.svg.axis()
	.orient('top')
	.ticks(5)
	.scale(scaleX);
	
var svg = d3.select('div.viz').append('svg')
	.attr('height',h + cPad + cPad)
	.attr('width',w + cPad + cPad);

var visCon = svg.append('g')
	.attr('transform','translate(' + cPad + ',' + cPad + ')');

	visCon.append('g').attr('id','x').attr('class','axis');
	visCon.append('g').attr('id','y').attr('class','axis');
	
var keySvg = d3.select('div.key').append('svg')
	.attr('height',30)
	.attr('width',w + cPad + cPad);
	
var keyCon = keySvg.append('g')
	.attr('transform','translate(' + cPad + ',' + 0 + ')');

var piv = [];

var scaleKey = d3.scale.ordinal()
	

//declare global functions

function key(){
	}


function circler(){
	}
//DATA DEPENDENT

var nest;

d3.csv('refugeeKey.csv', function(error, data1){
	keys = data1;				
				
	groupName.domain(keys.map(function(d){return d.label}));
	groupName.range(keys.map(function(d){return d.summary}));			

	d3.csv('stateRefugees.csv',function(error,data){
		data.forEach(function(d){
			d.value = +d.value;	
			d.year = +d.year.substring(3,7);
			d.continent = groupName(d.country);	
				})//close refugeesForeach
			
			state = data;		
			
			nest = d3.nest()
				.key(function(d){
					return d.state})
				.rollup(function(d){
					return {d}
					
					})
				.key(function(d){return d.year})
				.rollup(function(d){return d.value})
				.entries(state);			
			
			
			
			key();
			circler();
			

	});//CLOSE refugees	
})//close key CSV

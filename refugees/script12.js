//set global variables
var duration = 750;
var transition = 1000;
var delay = 100;
var keys;
var refugees;
var years;
var chartSize = 100;
var labels = 0;
var cPad = 10;
var ch = 120;


var colorize = d3.scale.category10();

var colors = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	

var w =959 - cPad - cPad;// (labels * -1) + window.innerWidth - cPad * 3;
var h = 2000 - cPad - cPad// (window.innerHeight * 0.8) - cPad * 2;

//declare scales and axes

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var startYear = '2011';

var scaleX = d3.scale.ordinal()
	.rangePoints([0,ch], 0.5);	

var scaleY = d3.scale.linear()
	.range([0,ch]);
	
var yAxis = d3.svg.axis()
	.orient('left')
	.ticks(5)
	.scale(scaleY);

var xAxis = d3.svg.axis()
	.orient('top')
	.ticks(5)
	.scale(scaleX);

var keySvg = d3.select('div.key').append('svg')
	.attr('height',30)
	.attr('width',w + cPad + cPad);
	
var keyCon = keySvg.append('g')
	.attr('transform','translate(' + cPad + ',' + 0 + ')');

var piv = [];

var scaleKey = d3.scale.ordinal()
	

//declare global functions

function key(){

	};


function bars(){
	
	var stateDivs =	d3.select('div.viz')
		.append('g')
		.selectAll('div')
		.data(pivNest)
		.enter()
		.append('div');	
	
	var stateSvg = stateDivs.append('svg')
		.attr('height',ch + cPad + cPad)
		.attr('width',ch + cPad + cPad);
		
	var stateCon = stateSvg.append('g')
		.attr('transform','translate(' + cPad + 'm' + cPad + ')');	
		
	stateCon.append('text')
		.attr('x',0)
		.attr('y',10)
		.attr('class','axis')
		.text(function(d){return d.key});
	
	stateCon.selectAll('rect')
		.data(function(d){return d.values})
		.enter()
		.append('rect')
		.attr('x',function(d,i){return scaleX(d.year) })
		.attr('y',function(d,i){return ch - scaleY(d.value) })
		.attr('width',ch/13)
		.attr('height',function(d){return scaleY(d.value)});
		
	};

var continents = [];
var piv = [];
var pivNest;
var countries;
//DATA DEPENDENT

d3.csv('refugeeKey.csv', function(error, data1){
	
	d3.csv('frosch.csv',function(error,data2){
		var subSet = d3.keys(data2[0])
				.filter(function(d2){return d2.substring(0,1) == 'y'});
		
		console.log(subSet);		
						
		data2.forEach(function(d1,i1){
				subSet.forEach(function(d2,i2){
					piv.push({
						'state': d1.state,
						'year': +d2.substring(5,1),
						'value': +d1[d2],					
						})					
					})			
			
			})//close refugeesForeach			
			
			scaleY.domain(d3.extent(piv,function(d){return d.value}));
			scaleX.domain(d3.extent(piv,function(d){return d.year}))			
			
			
			pivNest = d3.nest()
				.key(function(d){return d.state})
				.sortKeys(d3.ascending)
				.entries(piv);
						
			refugees = data2;					
			key();
			bars();
			

	});//CLOSE refugees	
})//close key CSV

//set global variables
var duration = 500;
var transition = 1000;
var delay = 100;
var detail;
var items;
var dates;
var chartSize = 100;
var labels = 0;
var cPad = 60;


var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	

var w = (labels * -1) + window.innerWidth - cPad * 3;
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
	.range([0,70])
	
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

var piv = [];



//declare global functions

function key(){
	var keyData = [];
	\;kjmkkklklkj	
	
	}


function circler(startYear){
	var liveSet = refugees.filter(function(d){return d.year == startYear});
	var xDomain = [];
	var yDomain = [];	
	liveSet.forEach(function(d){
		if(xDomain.indexOf(d.religion) < 0 && d.value > 0){
			xDomain.push(d.religion)			
			};
		if(yDomain.indexOf(d.country) < 0 && d.value > 0){
			yDomain.push(d.country)			
			};
			})//close forEach

		xDomain = xDomain.sort(d3.ascending);
		yDomain = yDomain.sort(d3.ascending);
		
	scaleR.domain(d3.extent(liveSet,function(d){return d.value}));
	scaleX.domain(xDomain);
	scaleY.domain(yDomain);	
	
	visCon.append('g')
		.attr('class','axis')		
		.call(xAxis)
		.selectAll('text')
		.style('text-anchor','end')
		.attr('transform','rotate(90)')
		//.attr('transform','translate(0,-3)')
		.style('dy','0.5em');
	visCon.append('g')
		.attr('class','axis')		
		.call(yAxis);
	
	var circleData = visCon.selectAll('circle')
		.data(liveSet,function(d){return d.country + d.religion});
	
		circleData.enter()
			.append('circle')
			.attr('class','circle')			
			.attr('cx',function(d){return scaleX(d.religion)})
			.attr('cy',function(d){return scaleY(d.country)})
			.attr('r',function(d){return scaleR(d.value)})
			.attr('fill',function(d){return colors(d.country)})
			
			.append('title')
			.text(function(d){return d.value + " " + d.religion + " from " + d.country });
	}


var refugees;
//DATA DEPENDENT
d3.csv('refugees.csv',function(error,data){
		data.forEach(function(d){
			d.value = +d.value;	
			d.year = d.year.substring(3,7);	
			})
			
	refugees = data;	
	circler(startYear);

		});//CLOSE contribs	

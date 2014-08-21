//set global variables
var duration = 500;
var transition = 1000;
var delay = 100;
var detail;
var items;
var dates;
var chartSize = 100;
var labels = 0;
var cPad = 30;


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
	.rangePoints([0,w]);

var scaleY = d3.scale.ordinal()
	.rangePoints([0,h]);
	
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
	
	scaleX.domain(xDomain);
	scaleY.domain(yDomain);	
	
	visCon.append('g').call(xAxis).selectAll('text').attr('transform','rotate(90)');
	visCon.append('g').call(yAxis);
	
	var circleData = visCon.selectAll('circle')
		.data(liveSet,function(d){return d.country + d.religion});
	
		circleData.enter()
			.append('circle')
			.attr('cx',function(d){return scaleX(d.religion)})
			.attr('cy',function(d){return scaleY(d.country)})
			.attr('r',function(d){return (d.value/300)})
			.attr('fill',function(d){return colors(d.country)});
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

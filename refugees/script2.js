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
var h = (window.innerHeight * 0.8) - cPad * 2;

//declare scales and axes

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var defaultYear = parseYear('2001');


var wRange = [0,w/2];

var scaleX = d3.time.scale()
	.range(wRange);

var scaleY = d3.scale.linear()
	.range([chartSize,0]);
	
var barPoints = d3.scale.ordinal()
	.rangePoints(wRange);
	
var barWidth = d3.scale.ordinal()
	.rangeRoundBands(wRange,0.2);
	
var yAxis = d3.svg.axis()
	.orient('left')
	.ticks(5)
	.scale(scaleY);

var xAxis = d3.svg.axis()
	.orient('bottom')
	.ticks(5)
	.scale(scaleX);

var piv = [];

var refugees;
//DATA DEPENDENT
d3.csv('refugees.csv',function(error,data){
	refugees = data;	
	console.log(refugees);
		});//CLOSE contribs	

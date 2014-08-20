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

var startYear = '2011';


var scaleX = d3.scale.ordinal()
	.range([0,w]);

var scaleY = d3.scale.ordinal()
	.range([0,h]);
	
var yAxis = d3.svg.axis()
	.orient('left')
	.ticks(5)
	.scale(scaleY);

var xAxis = d3.svg.axis()
	.orient('bottom')
	.ticks(5)
	.scale(scaleX);

var piv = [];

//declare global functions
function circler(startYear){
	var liveSet = refugees.filter(function(d){return d.year == startYear});

	scaleX.domain(liveSet.map(function(d,i){return d.religion}));
	scaleY.domain(liveSet.map(function(d,i){return d.country}));
		
	console.log(scaleY.domain() + " " + scaleX.domain() + " " );
	console.log(liveSet);		
		
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

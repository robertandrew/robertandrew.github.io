//set global variables
var duration = 500;
var delay = 1;
var claims;
var recessions;
var filterClaims;
var filterRecessions;
var claimYears;
var start = 1980;
var offPacity = 0.8;

var defaultYear = '1970';

var svgMargin = 40;
var w = window.innerWidth - svgMargin * 2;
var h = (window.innerHeight * 0.6) - svgMargin * 2;


//set up the furniture
var svg = d3.select('div.viz').append('svg')
	.attr('height', h + svgMargin * 2)
	.attr('width',w  + svgMargin * 2);
	
var visCon = svg.append('g').attr('id','visCon')
	.attr('height', h)
	.attr('width', w)
	.attr('transform','translate(' + svgMargin + ',' + svgMargin + ')' );

//declare scales and axes

var scaleX = d3.time.scale()
	.range([0,w]);
	
var scaleY = d3.scale.linear()
	.range([h,0]);

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom');

var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left');

var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	
	
var labeler = d3.scale.ordinal()
	.domain([6,7,8,9,0,1])
	.range(['1960s','1970s','1980s','1990s','2000s','2010s']);	

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var barWidth = d3.scale.ordinal()
	.rangeBands([0,w]);	

var barPos = d3.scale.ordinal()
	.rangePoints([0,w]);
	
	
//Window/HTML functions

d3.select('#start').on('input',function(){
	start = +(this.value);
	update();

	console.log(start);
	});

function update(){

	d3.select('#start-value').text(start);
	d3.select('#start').property('value',start);
	}	
	
function resizer(){
	w = window.innerWidth - svgMargin * 2;
	h = (window.innerHeight * 0.4) - svgMargin * 2;
	console.log(h + ' and w ' + w);
	svg.attr('width',w).attr('height',h); 	
	}

function bars(){
	
	var filt = claims.filter(function(d){return d.date > })
	
	}//close bars

//DATA DEPENDENT
//load the csv
d3.csv('claims.csv',function(error,data){		
	data.forEach(function(d){
		d.realDate = parseDate(d.realDate);
//		d.iNSA = + d.iNSA;
//		d.iSeasonality = +d.iSeasonality;
//		d.deviation = d.iSeasonality - (+d.avgSeasonality)
		d.iSA = +d.iSA;
//		d.iMonth = +d.iMonth;		
		});//CLOSE claims forEach
	
	claims = data.filter(function(d){return d.iNSA > 0});	
	
	

	//set domain
	
	//append axes
	visCon.append('g').attr('class','axis').attr('id','x')
		.attr('transform','translate(0,' + h + ')');
		
	visCon.append('g').attr('id','y')
		.attr('class','axis');
			
	//call functions
	
	//load another useful CSV which will also contain the function calls
	d3.csv('recessions.csv',function(error,data2){
		data2.forEach(function(d){
			d.peak = parseDate(d.peak);
			d.trough = parseDate(d.trough);			
			})//CLOSE recessions forEach
		recessions = data2;
		
		bars();
		update();
		
		});// CLOSE recessions CSV	

});//CLOSE claims CSV


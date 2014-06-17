//set global variables
var duration = 2000;
var delay = 10;
var claims;
var claimYears;

var svgMargin = 20;
var w = window.innerWidth - svgMargin * 2;
var h = (window.innerHeight * 0.85) - svgMargin * 2;


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

var barWidth = d3.scale.ordinal()
	.rangeBands([0,w]);	

var barPos = d3.scale.ordinal()
	.rangePoints([0,w]);

//global functions

function bars(){
	var recter = visCon.append('g').attr('id','bars').selectAll('rect')
		.data(claims)
		.enter()
		.append('rect')
		.attr('width',barWidth.rangeBand())
		.attr('height',0)
		.attr('x',function(d){return scaleX(d.realDate)})
		.attr('y',function(d){return h - scaleY(d.iSA)})
		.style('fill',colorize(function(d){
			console.log(d[0].year.substring(2,3));
			
			return d[0].year.substring(2,3)}
			))
		
		.append('title')
		.text(function(d){return d.realDate});
	
	visCon.selectAll('rect')
		.transition()
		.duration(duration)
		.delay(function(d,i){return i * delay})
		.style('fill',colorize(function(d){
			console.log(d[0].year.substring(2,3));
			
			return d[0].year.substring(2,3)}
			))

		.attr('height',function(d){return scaleY(d.iSA)});
	
	
	
	};

function pctChg(start,end){
	return (end - start) / start * 100;
	};
	
function resizer(){
	w = window.innerWidth - svgMargin * 2;
	h = (window.innerHeight * 0.85) - svgMargin * 2;
	console.log(h + ' and w ' + w);
	svg.attr('width',w).attr('height',h); 	
	}


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
	scaleX.domain(d3.extent(claims, function(d){return d.realDate;}));
	scaleY.domain([0,d3.max(claims, function(d){return d.iSA})]);

	barPos.domain(d3.extent(claims, function(d){return d.realDate;}));
	barWidth.domain(claims.map(function(d){return d.realDate}));

	
	//append axes
	visCon.append('g').attr('class','axis')
		.call(xAxis)
		.attr('transform','translate(0,' + h + ')');
		
	visCon.append('g').attr('id','y')
		.call(yAxis)
		.attr('class','axis');

	//call functions
	
	bars();
//	resizer();
});//CLOSE claims tsv


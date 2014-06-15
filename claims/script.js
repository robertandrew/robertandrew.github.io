//set global variables
var duration = 2000;
var delay = 500;
var claims;
var claimYears;

var svgMargin = 50;
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
	.orient('bottom')
	.tickFormat(d3.time.format('%b'));

var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left');

var colorize = d3.scale.category10();
//	.range(['red','orange','green','blue','purple','black']);	

var parseDate = d3.time.format('%x').parse;


//global functions



function pctChg(start,end){
	return (end - start) / start * 100;
	};
	
function drawLines(eachData, order, subSet){

	scaleY.domain(d3.extent(claims, function(d){return d[subSet];}));
	
	visCon.select('g#y').attr('class','axis')
		.call(yAxis);
	

	var lineGen = d3.svg.line()
		.x(function(d){return scaleX(d.date)})
		.y(function(d,i){return scaleY(d[subSet])})
		.interpolate('cardinal');
	
	var drawPaths = visCon.append('g').append('path')
		.datum(eachData)
		.attr('d',lineGen)
		.attr('class','path')
		.attr('id',function(d){return 'y' + d[0].year})
		.style('stroke',function(d){return colorize(d[0].year.substring(3,1))})
		.append('title')
		.text(function(d){return d[0].year});		
	}


//DATA DEPENDENT
//load the csv
d3.csv('claims/claims.csv',function(error,data){		
	data.forEach(function(d){
		d.date = parseDate(d.date);
//		d.iNSA = + d.iNSA;
		d.iSeasonality = +d.iSeasonality;
		d.deviation = d.iSeasonality - (+d.avgSeasonality)
//		d.iSA = +d.iSA;
//		d.iMonth = +d.iMonth;		
		});//CLOSE claims forEach
	
	claims = data;	
	
	claimYears = d3.nest()
		.key(function(d){return d.year})
		.sortKeys(d3.ascending)
		.entries(data);	
	

	//set domain
	scaleX.domain(d3.extent(claims, function(d){return d.date;}));
	
	//append axes
	visCon.append('g').attr('class','axis')
		.call(xAxis)
		.attr('transform','translate(0,' + h + ')')
		.selectAll('text')
		.style('text-anchor','start');
	
	
	visCon.append('g').attr('id','y');

	//call functions
	claimYears.forEach(function(d,i){drawLines(d.values,i,'deviation')});
	
});//CLOSE claims tsv




//set global variables
var duration = 500;
var transition = 1000;
var delay = 100;
var detail;
var items;
var dates;
var gdp;
var smart = [];
var chartSize = 200;
var cPad = 40;
var labels = 0;

var defaultYear = '1970';


var colorize = d3.scale.category10();

var colors = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	


var svgMargin = 15;
var w = (labels * -1) + window.innerWidth - cPad - cPad;
var w3 = (window.innerWidth / 3 ) - cPad - cPad;
var h = (window.innerHeight * 0.8) - svgMargin * 2;

//set up the furniture

//declare scales and axes

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var barWidth = d3.scale.ordinal()
	.rangeRoundBands([0,w],0.2);

var barPoints = d3.scale.ordinal()
	.rangePoints([0,w]);

var scaleY = d3.scale.linear()
	.range([0,chartSize]);

var scaleYpct = d3.scale.linear()
	.range([0,chartSize])
	
var scaleX = d3.time.scale()
	.range([0,w]);

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom')
	.ticks(5);


var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left')
	.ticks(5);

function bars(){

	//enter
	var selection = d3.select('div.viz')
		.selectAll('div')
		.data(smart)
		.enter();
	
	//update
	var svg = selection.append('svg')
		.attr('height',chartSize + cPad + cPad)
		.attr('width', w + cPad + cPad);
			
	var visCon = svg.append('g')
		.attr('transform','translate(' + cPad + ',' + cPad + ')');
			
	visCon.append('text')
		.attr('class','dek')
		.attr('x',0)
		.attr('y',0)
		.text(function(d){return d.key});
	
	visCon.append('g')
		.attr('class','axis')
		.attr('transform','translate(0,' + (chartSize) + ')')
		.attr('id','x')
		.call(xAxis);

	visCon.append('g')
		.attr('class','axis')
		.attr('id','y')
		.call(yAxis)	
		
	var barz = visCon.append('g')
		.selectAll('rect')
		.data(function(d){return d.values});
		
	barz.enter()
		.append('rect')
		.attr('x',function(d){return barPoints(d.date)})
		.attr('y',function(d){
			if(d.value>0){return chartSize - scaleY(d.value)}
			else if(d.value<0){			
				return chartSize}
			})
		.attr('width',barWidth.rangeBand())
		.attr('fill',function(d){return colors(d.id)})
		
		.append('title')
		.text(function(d){return d.label + " " + d.value});
		
	visCon.selectAll('rect')
		.transition()
		.duration(duration)
		.delay(function(d,i){return i * delay})
		
		.attr('height',function(d){
			if(d.value>0){
				return scaleY(d.value)}
			else if (d.value < 0){
				return scaleY(d.value * -1)};});
				
		
}//end BARS
		
		
//DATA DEPENDENT
d3.tsv('valueDetail.tsv',function(error,data){
	gdp = data;
	gdp.filter(function(d,i){return i != 0})
		.forEach(function(d,i){
			d3.range(1,62).forEach(function(d2,i2){
				smart.push({
					
					"date": parseDate(data[0]["d" + d2]),
					"id":d.ident,
					"label":d.label,
					"value": +d["d" + d2]})
				})//CLOSE foreach temp range
			})//CLOSE foreach filtered item
	
	//remove GDP from the equation		
	smart = smart.filter(function(d){return d.id != "dd1"});	
	scaleY.domain([0,d3.max(smart,function(d){return d.value})]);
	scaleX.domain(d3.extent(smart,function(d){return (d.date)}));	
	var dateMap = d3.range(1,62).map(function(d1){
		return parseDate(gdp[0]["d" + d1])});	
	barWidth.domain(dateMap);
	barPoints.domain(dateMap);
		
	smart = d3.nest()
		.key(function(d){return d.label})
		.entries(smart);
	
	
	bars();
	});//CLOSE contribs	

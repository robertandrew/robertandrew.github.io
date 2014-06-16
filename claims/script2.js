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

var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	
	
var labeler = d3.scale.ordinal()
	.domain([6,7,8,9,0,1])
	.range(['1960s','1970s','1980s','1990s','2000s','2010s']);	



var parseDate = d3.time.format('%x').parse;

//add permanent SVG furniture
visCon.append('text')
	.attr('x',w)
	.attr('y',0)
	.attr('class','dek')	
	.style('text-anchor','end')
	.attr('id','flag');
	

//global functions

function keyer(){
	keys = d3.select('div.key').append('g').selectAll('div')
		.data(labeler.range())
		.enter()
		.append('div')
		.attr('id',function(d){return  "d" +  d})
		.style('background-color',function(d){return colorize(d);})
		.style('opacity','0.5')
		.attr('width',w / labeler.range().length)
		.attr('height','20px')		
		.append('span')
		.style('','white')
		.style('font-weight','bold')
		.text(function(d){return d});
		
	keys.on('mouseover',function(d){
		console.log(d);
		d3.select(this)
			.transition()
			.duration(duration)
			.style('opacity',1);
			
		visCon.selectAll('path.' + "d" + d3.select(this).text())
			.transition()
			.duration(duration)			
			.style('opacity',0.2)
			.style('stroke-width','2.5px');		
		})	
		.on('mouseout',function(d){
		
		d3.select(this)
			.transition()
			.duration(duration)
			.style('opacity',1);


		visCon.selectAll('path.' + "d" +  d3.select(this).text())
			.transition()
			.duration(duration)			
			.style('opacity','0.2')
			.style('stroke-width','1px');		
		})	
	}
function lightYears(){
	var lighter = d3.selectAll('path.pathOff')
		.transition()
		.duration(duration)
		.delay(function(d,i){return i * delay})
		.style('stroke-width', '2.5px');	
		
	lighter.each('end',function(d){
		d3.select('text#flag')
			.text(d3.select(this).text());
			
		d3.select(this).transition()
			.duration(duration/2)
			.delay(400)			
			.style('stroke-width','0.5px')
			.style('opacity', '0.2');		
		})
	}

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
		.attr('class','pathOff')
		.attr('id',function(d){return  "d" + labeler(d[0].year.substring(3,1))})
		.style('stroke',function(d){return colorize(d[0].year.substring(3,1))})
		.append('title')
		.text(function(d){return d[0].year});			
	}
	
	function resizer(){
		w = window.innerWidth - svgMargin * 2;
		h = (window.innerHeight * 0.85) - svgMargin * 2;
		console.log(h + ' and w ' + w);
//		svg.attr('width',w).attr('height',h); 	
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
//	d3.select('window').on('resize',console.log('resize'));
	lightYears();
	keyer();
});//CLOSE claims tsv


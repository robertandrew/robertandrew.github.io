//declare global variables
var duration = 2000;
var delay = 50;
var chartHeight = 70;
var chartPadding = 20;
var paddingMultiplier = 1.5;
var keys;
var jolts;		
var newJolts;
var barWidth;
var rHeight = 2005
var fSize = 10;
var w = window.innerWidth - chartPadding * 2;
var h = (window.innerHeight * 0.6) - chartPadding * 2;

	
var scaleY = d3.scale.linear().range([chartHeight, 0]);

var scaleX = d3.time.scale().range([0,w]);

var keyer = d3.scale.ordinal();

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom')
	.ticks(5);

var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left')
	.ticks(5);
	
var colorize = d3.scale.category20();
	
var colors = d3.scale.ordinal()
	.range(['red','orange','blue','steelblue','purple','gray','green']);	

var parseDate = d3.time.format('%x').parse;

function draw(){
	var divver = d3.select('div.viz')
		.selectAll('div')
		.data(jolts)
		.enter()
		.append('div')
		.attr('id',function(d){return d.key});	

	function hires(){	
		scaleY.range([chartHeight,0]);
		xAxis.orient('top');
	
	
		var hiresSvg = divver.append('svg')
			.attr('height',(chartPadding) + chartHeight)	
			.attr('width',w);
		
		var hiresViz = hiresSvg.append('g').attr('id','hiresViz')
			.attr('transform','translate(' + chartPadding + ',' + chartPadding + ')');
		
			
		hiresViz.append('g').attr('class','axis').call(yAxis);
		hiresViz.append('g').attr('class','axis').call(xAxis);
		
		hiresViz.append('g').selectAll('rect')
			.data(function(d){
				return d.values[0].values;
				})
			.enter()
			.append('rect')
			.attr('x',function(d){
				return scaleX(d.date)				
				})
			.attr('y',chartHeight)	
			.attr('class','posRect')
			.attr('width',barWidth)
			.attr('height',0)
	
			.append('title')
			.text(function(d){return d.value + ",000"});
					
			
		hiresViz.selectAll('rect')	
			.transition()
			.duration(duration)
			.delay(function(d,i){return i * delay})
			.attr('y', function(d){return chartHeight - scaleY(d.value)})
			.attr('height',function(d){return scaleY(d.value)});						
		
		hiresViz.append('text')
			.attr('x',3)
			.attr('y',0 + fSize)
			.style('text-anchor','start')
			.attr('class','dek')
			.text('hires')
			.attr('dy','0.5em');
			
			
		}//end fires
		
	
	function fires(){	
		scaleY.range([0, chartHeight]);
		xAxis.orient('bottom');
		
		var firesSvg = divver.append('svg')
			.attr('height',(chartPadding) + chartHeight)	
			.attr('width',w);
			
		var firesViz = firesSvg.append('g').attr('id','firesViz')
			.attr('transform','translate(' + chartPadding + ',' + 0 + ')');
			
		firesViz.append('g').attr('class','axis').call(yAxis);
		firesViz.append('g').attr('class','axis').call(xAxis)	
			.attr('transform','translate(0,' + chartHeight + ')');
		
		firesViz.append('g').selectAll('rect')
			.data(function(d){
					return d.values[1].values;
				})
			.enter()
			.append('rect')
			.attr('x',function(d){
				return scaleX(d.date)				
				})
			.attr('y', 0)			
			.attr('class','negRect')
			.attr('width',barWidth)
			.attr('height',0)

			.append('title')
			.text(function(d){return d.value + ",000"});
			
		firesViz.selectAll('rect')
			.transition()
			.duration(duration)
			.delay(function(d,i){return i * delay})
			.attr('width',barWidth)
			.attr('height',function(d){return scaleY(d.value)});
			
		firesViz.append('text')
			.attr('x',3)
			.attr('y',chartHeight - (fSize * 1.3))
			.style('text-anchor','start')
			.attr('class','dek')
			.text('separations')
			.attr('dy','0.5em');
		
		
		
		}//end fires

	var label = divver.append('h2').text(function(d){return keyer(d.key)});	
	
	hires();	
	fires();

	
	}

	
//Window/HTML functions

d3.select('#rHeight').on('input',function(){
	});

function update(rHeight){

	d3.select('#rHeight-value').text(rHeight);
	d3.select('#rHeight').property('value',rHeight);
	}	
	
function resizer(){
	w = window.innerWidth - svgMargin * 2;
	h = (window.innerHeight * 0.4) - svgMargin * 2;
	console.log(h + ' and w ' + w);
	svg.attr('width',w).attr('height',h); 	
	}

//DATA DEPENDENT
d3.tsv('key.tsv',function(error, keyData){
		keys = keyData;
		
		keyer.domain(keys.map(function(d){return d.industry}))
			.range(keys.map(function(d){return d.label}));		
		
		d3.tsv('jolts.tsv',function(error,jData){
			jData.forEach(function(d){
				d.date = parseDate(d.date);
				d.value = +d.value;				
				})			
			scaleY.domain([0,d3.max(jData,function(d){return d.value})]);
			scaleX.domain(d3.extent(jData,function(d){return d.date}));
								
			jolts = d3.nest()
				.key(function(d){return d.industry})
				.sortKeys(d3.ascending)
				.key(function(d){return d.type})
				.sortKeys(d3.ascending)
				.entries(jData);
	
				barWidth = (w / jolts[0].values[0].values.length) * 0.9;				
				
				draw();	
				
				});// close jolts.tsv			
	
			
	});//CLOSE key.tsv

//draw boxes d3 style for all the years
	//within years, call forEach on the imports
//Put it all in one massive function that can take a csv and output a series of charts with a subhed	

//set global variables
var duration = 2000;
var delay = 50;
var cpi;
var recessions;
var chartWidth = 100;
var chartPadding = 20;
var paddingMultiplier = 1.5;

var svgMargin = 50;
var w = window.innerWidth - svgMargin * 2;
var h = (window.innerHeight * 0.85) - svgMargin * 2;


//set up the furniture
//declare scales and axes

var scaleX = d3.scale.linear();
	
var scaleY = d3.scale.linear()
	.range([h,0]);

var recScale = d3.scale.quantize();

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom')
	.ticks(5);

var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left')
	.ticks(5);
	
var colors = d3.scale.category20();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black']);	

var parseDate = d3.time.format('%x').parse;

//global functions

function drawLines(dataSet, order, chartWidth){
	
	var svg = d3.select('div.viz').append('div')
		.attr('class','box')
		.append('svg')
		.attr('width',chartWidth * paddingMultiplier)
		.attr('height',chartWidth * paddingMultiplier)
		.attr('id',function(d){return dataSet[0].recession});

	var lineBox = svg.append('g')
		.attr('transform','translate(' + (chartWidth * ((paddingMultiplier - 1 )/2)) + ',' + (chartWidth * ((paddingMultiplier - 1) /2)) + ')')
			
	lineBox.append('g').attr('class','axis')
		.call(yAxis).attr('id','y');
				
	lineBox.append('g').attr('class','axis')
		.call(xAxis)
		.attr('id','x')
		.attr('transform','translate(0,' + chartWidth + ')');	
		
	lineBox.append('text').attr('class','title')
		.attr('y',0)
		.attr('x',0)
		.style('fill',function(d){return colors(dataSet[0].recession)})
		.text(function(d){return dataSet[0].recession.substring(1,5)});



	var lineGen = d3.svg.line()
		.x(function(d,i){return scaleX(i)})
		.y(function(d,i){return scaleY(d.pct)})
		.interpolate('cardinal');
	
	var drawPaths = lineBox.append('g').append('path')
		.datum(dataSet)
		.attr('d',lineGen)
		.attr('class','pathOff')
		.style('stroke',function(d){return colors(d[0].recession)})
		.append('title')
		.text(function(d){return d[0].recession});	
		
				
	};

	
//label and nest each dataset
function recessionizer(inputSet, subSet){
	inputSet.forEach(function(d1,i1){
		recessions.forEach(function(d2,i2){
			if(d1.date < recessions[0].peak){
				d1.recession = 'aprev';				
				}
			else if(d1.date >= d2.peak && d1.date <= d2.nextPeak ){
				d1.recession = d2.recession;							
				}
			})//CLOSE recessions forEach
		})//CLOSE inputSet forEach
	
		
	var nestedInput = d3.nest()
		.key(function(d){
			{
			return d.recession
			};//close conditional
				})
		.sortKeys(d3.ascending)		
		.entries(inputSet.filter(function(d){return d.recession != "aprev"}));
	
	
	
	var longest = d3.max(nestedInput,function(d){return d.values.length});
	var pctMax = 0;	
	var pctMin = 0;
		
		
	function pctChg(inputSet, subSet){
	inputSet.forEach(function(d,i){
		d.pct = (d[subSet] - inputSet[0][subSet]) / inputSet[0][subSet] * 100;
		if(d.pct > pctMax){
			pctMax = d.pct;			
			}
		if(d.pct < pctMin){
			pctMin = d.pct;
			}
		})
	};//CLOSE pctChg
	
	
	//Iterate through just to get the universal domains/ranges		
	nestedInput.forEach(function(d){
		pctChg(d.values,subSet);
		})//CLOSE nested forEach
		
		
		//set the universal domains and ranges		
		chartWidth = 100; //w / nestedInput.length;
			
		
		scaleX.range([0,chartWidth])
			.domain([0,longest]);
		
		scaleY.range([chartWidth, 0])
			.domain([pctMin,pctMax]);
		nestedInput.forEach(function(d,i){
			drawLines(d.values,i,chartWidth);			
			});//CLOSE second nested forEach	
		
		
			
	};//CLOSE recessionizer

function labelFirst(){
	d3.select('axis#x')
		.append('text')
		.attr('x',0)
		.attr('y',0)
		.text('axis');	
	}


//DATA DEPENDENT
//load the csv
d3.csv('recessions.csv',function(error,data){		
	data.forEach(function(d){
		d.peak = parseDate(d.peak);
		d.nextPeak = parseDate(d.nextPeak)
		d.trough = parseDate(d.trough);
		});//CLOSE recessions forEach
	
	recessions = data;	
	
	d3.csv('cpi.csv',function(error,data){
		data.forEach(function(d){
			d.cpi = +d.cpi;
			d.date = parseDate(d.date);
			})//CLOSE cpi forEach
		
			cpi = data;
			
			//set domains and ranges
			recScale.domain(d3.extent(cpi,function(d){return d.date}))
				.range(recessions.map(function(d){return d.peak}));			

			
			//call data-dependent functions			
			recessionizer(cpi,'payrolls');
			
			
			
			
		})//CLOSE cpi csv
	
});//CLOSE recessions csv


//set global variables
var duration = 2000;
var delay = 50;
var dataColumn;
var recessions;
var chartWidth = 100;
var chartPadding = 20;
var paddingMultiplier = 1.5;
var pctMax = 0;	
var pctMin = 0;
var longest;
var longestTime;

//set up the furniture
//declare scales and axes

var scaleX = d3.time.scale();
	
var scaleY = d3.scale.linear();

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom')
	.ticks(5);

var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left')
	.ticks(5);
	
var colors = d3.scale.ordinal()
	.range(['gray','orange','green','blue','purple','red']);	

var parseDate = d3.time.format('%x').parse;
var parseMilliseconds = d3.time.format('%L').parse;

function year(year){ return year / 31556926279.7 };

//global functions

function drawLines(dataSet, order, chartWidth){
	
	scaleX.range([0,chartWidth])
		.domain([dataSet[0].date, dataSet[dataSet.length-1].date]);// longestTime]);
	
	console.log(scaleX.domain());
	
	var svg = d3.select('div.viz').append('div')
		.attr('class','box')
		.append('svg')
		.attr('width',chartWidth * paddingMultiplier)
		.attr('height',chartWidth * paddingMultiplier)
		.attr('id',function(d){return dataSet[0].recession});

	var lineBox = svg.append('g')
		.attr('transform','translate(' + (chartWidth * ((paddingMultiplier - 1 )/2)) + ',' + (chartWidth * ((paddingMultiplier - 1) /2)) + ')')
	
	//Call the axes		
	lineBox.append('g').attr('class','axis')
		.call(yAxis).attr('id','y');
				
	lineBox.append('g').attr('class','axis')
		.call(xAxis)
		.attr('id','x')
		.attr('transform','translate(0,' + chartWidth + ')');	
		
	
	//Label each recession
	lineBox.append('text').attr('class','title')
		.attr('y',0)
		.attr('x',0)
		.style('fill',function(d){return colors(dataSet[0].recession)})
		.text(function(d){return dataSet[0].recession.substring(1,5)})
		.attr('transform','translate(0, -5)');

	var lineGen = d3.svg.line()
		.x(function(d,i){return scaleX(d.date)})
		.y(function(d,i){return scaleY(d.pct)})
		.interpolate('cardinal');
	
	var drawPaths = lineBox.append('g').append('path')
		.datum(dataSet)
		.attr('d',lineGen)
		.attr('class','pathOff')
		.style('stroke',function(d){return colors(d[0].recession)})
		.append('title')
		.text(function(d){return d[0].recession});	
		
	//add a zero line
	lineBox.append('rect')
		.attr('width',chartWidth)
		.attr('height','0.75px')
		.attr('class','axis')
		.attr('x',0)
		.attr('y',scaleY(0));
				
	};

	
//Set all the parameters and draw everything within this one, ephemeral dataset
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
	
	
	
		longest = d3.max(nestedInput,function(d){return d.values.length});
		longestTime = d3.max(nestedInput,function(d){
	//		return parseMilliseconds(d.values[d.values.length - 1].date - d.values[0].date);
		
		});
		console.log(longestTime);
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
			
		
		scaleY.range([chartWidth, 0])
			.domain([pctMin,pctMax]);
		
		console.log(scaleY.domain())
		nestedInput.forEach(function(d,i){
			drawLines(d.values,i,chartWidth);			
			});//CLOSE second nested forEach	
	
	
	};//CLOSE recessionizer

//label the first chart
function labelFirst(){
	d3.select('.axis#y')
		.append('text')
		.attr('x',0)
		.attr('y',0)
		.text('pct. change')
		.style('font-weight', 'light')
		.style('text-anchor','end')
		.attr('transform','rotate(270)')
		.attr('dy','1em')
		.style('font-size', '10px')
		;	
	
	d3.select('.axis#x')
		.append('text')
		.attr('x',chartWidth)
		.attr('y',-2)
		.attr('dy','0em')
		.text('months in')
		.style('font-weight', 'light')
		.style('font-size', '10px')
		.style('text-anchor','end');	
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
			d.dataColumn = +d.dataColumn;
			d.date = parseDate(d.date);
			})//CLOSE dataColumn forEach
		
			dataColumn = data;
			
			//call data-dependent functions			
			recessionizer(dataColumn,'dataColumn');
			labelFirst();
			
			
			
			
		})//CLOSE dataColumn csv
	
});//CLOSE recessions csv


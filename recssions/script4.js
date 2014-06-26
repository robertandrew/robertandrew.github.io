//set global variables
var duration = 2000;
var delay = 50;
var recessions;
var chartWidth = 100;
var chartPadding = 20;
var paddingMultiplier = 1.5;
var pctMax = 100;	
var pctMin = -40;
var longestTime;
var nestCheck = 0;
var dataSets = [
	{'label' : 'consumer prices' , 
	 'sheet' : 'monthly', 
	 'subSet' : 'cpi', 
	 'color' : 'red'},
	
	{'label' : 'total wages paid' ,
	 'sheet' : 'yearly',
	 'subSet' : 'wages',
	 'color' : 'orange'}
	];

//set up the furniture
//declare scales and axes

var scaleX = d3.time.scale().range([0,chartWidth]);
	
var scaleY = d3.scale.linear().range([chartWidth, 0]);

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

//shade all the reecssions on the page
function rShader(){
	recessions.forEach(function(d,i){
		d3.select('svg#' + d.recession + " g")
			.append('rect')
			.attr('class','recession')
			.attr('height',chartWidth)
			.attr('x',0)
			.attr('y',0)
			.attr('width',(scaleX(d.trough) - scaleX(d.peak)));		
		
		})	
	
	}

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

	
//Set all the parameters and draw everything within this one, ephemeral dataset
function recessionizer(inputSet, subSet, lineColor){
	
	//Label all the recessions within the dataset
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
	
	//nests the dataset based on the newly formed column	
	var nestedInput = d3.nest()
		.key(function(d){
			{
			return d.recession
			};//close conditional
				})
		.sortKeys(d3.ascending)		
		.entries(inputSet.filter(function(d){return d.recession != "aprev"}));
	
	
	//adds a percentage change value to everything in the usable array	
	function pctChg(inputSet, subSet){
		
	inputSet.forEach(function(d,i){
		d.pct = (d[subSet] - inputSet[0][subSet]) / inputSet[0][subSet] * 100;

		//finds the max percentges
		if(d.pct > pctMax){
			pctMax = d.pct;			
			}
		if(d.pct < pctMin){
			pctMin = d.pct;
			}
		})
	};//CLOSE pctChg
		
	//Calls the pctChg function on everything to get the domains for the y axis		
	nestedInput.forEach(function(d){
		pctChg(d.values,subSet);
		})//CLOSE nested forEach
		
	//finds the longest recession to get the upper limit for X axis
	longestTime = d3.max(nestedInput,function(d){
		return (d.values[d.values.length - 1].date - d.values[0].date);
		});//close longestTime
					
		//set the y domain	
		scaleY.domain([-50,150]);//.domain([pctMin,pctMax]);
		
		//call all the relevant functions 

		if(d3.selectAll('div.box')[0].length < 2){														
			nestedInput.forEach(function(d,i){			
				drawBoxes(d.values,i,chartWidth);	
				drawLines(d.values,lineColor);
	
				console.log('if');
							
			});//CLOSE forEach for the boxes don't exist condition	
			}//CLOSE first conditional box check
		else{nestedInput.forEach(function(d2,i){
			drawLines(d2.values, lineColor);			
			console.log('else');	
			});//CLOSE forEach for the box exists condition	
			};
			//always draw lines
	nestCheck = nestedInput;
	
	};//CLOSE recessionizer
	

//global functions
function drawBoxes(dataSet, order, chartWidth){
	
	//set a custom year domain for each chart
	var startMs = (+dataSet[0].date);
	var endMs = ((+dataSet[0].date) + longestTime);
	scaleX.domain([startMs,endMs]);
	
	var svg = d3.select('div.viz').append('div')
		.attr('class','box')
		.append('svg')
		.attr('width',chartWidth * paddingMultiplier)
		.attr('height',chartWidth * paddingMultiplier)
		.attr('id',function(d){return dataSet[0].recession});

	var lineBox = svg.append('g')
		.attr('class','lineBox')
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
//		.style('fill',function(d){return colors(dataSet[0].recession)})
		.text(function(d){return dataSet[0].recession.substring(1,5)})
		.attr('transform','translate(0, -5)');
		
				
	};

	
//global functions
function drawLines(dataSet,lineColor){

	//always set an x axis	
	var startMs = (+dataSet[0].date);
	var endMs = ((+dataSet[0].date) + longestTime);
	scaleX.domain([startMs,endMs]);

	//select the correct box
	var thisBox = d3.selectAll('svg#' + dataSet[0].recession + ' g.lineBox' );
	
	//Update the Y axis if it's bigger than what I have		
	thisBox.select('g#y').call(yAxis);
						
	//Set up the line generator
	var lineGen = d3.svg.line()
		.x(function(d,i){return scaleX(d.date)})
		.y(function(d,i){return scaleY(d.pct)})
		.interpolate('cardinal');
	
	var drawPaths = thisBox.append('g').append('path')
		.datum(dataSet)
		.attr('d',lineGen)
		.attr('class','pathOff')
		.style('stroke',lineColor) //function(d){return colors(d[0].recession)})
		.append('title')
		.text(function(d){return d[0].recession});	
		
	//add a zero line
	if(thisBox.selectAll('rect.zero') < 1){
	thisBox.append('rect')
		.attr('width',chartWidth)
		.attr('height','0.75px')
		.attr('class','zero')
		.attr('x',0)
		.attr('y',scaleY(0))
		};//close conditional rect append
				
	};

function keyer(){
	
	var keyDivs = d3.select('div.key')
		.selectAll('div')
		.data(dataSets)
		.enter()
		.append('div')
		.attr('class','buttOn');
		
	keyDivs.append('span')
		.text(function(d){return d.label})
		.style('background-color',function(d){return d.color;})
		.style('fill','white');	
		
	keyDivs.on('click',function(d){
		console.log(d);
		recessionizer(dataM,d.subSet,d.color);
		
		});//CLOSE key event listener
	}//CLOSE keyer function


//DATA DEPENDENT
//load the csv
d3.csv('recessions.csv',function(error,data){		
	data.forEach(function(d){
		d.peak = parseDate(d.peak);
		d.nextPeak = parseDate(d.nextPeak)
		d.trough = parseDate(d.trough);
		});//CLOSE recessions forEach
	recessions = data;	
		//load the annual csv
		d3.csv('annual.csv',function(error,dataY){
			dataY.forEach(function(d){
				d.date = parseDate(d.date);
				d.employees = +d.employees;			
				});//CLOSE the forEach for annual csv
			
			//load the monthly csv
			d3.csv('monthly.csv',function(error,dataM){
			dataM.forEach(function(d){
				d.date = parseDate(d.date);
				d.dataColumn = +d.dataColumn;			
				});//CLOSE the forEach for monthly csv
				//draw one line once everything is loaded
					recessionizer(dataY,'employees','red');
					recessionizer(dataY,'farmComp','yellow');
					recessionizer(dataY,'allComp','green');
												
					recessionizer(dataM,'dataColumn','orange');
						
				//add the shadings and labels once all lines are drawn		
				rShader();
				labelFirst();
				keyer();


				
			});//CLOSE the monthly csv read
	
		});//CLOSE the annual csv read
	
				
	
});//CLOSE recessions csv


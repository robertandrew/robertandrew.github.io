//declare global variables
var duration = 2000;
var rec;
var yearly;
var monthly;
var delay = 50;
var chartWidth = 100;
var chartPadding = 20;
var paddingMultiplier = 1.5;
var pctMax = 0;	
var pctMin = 0;
var dataM;
var dataY;
var longestTime;
var nestCheck = 0;
var dataSets = [

	//monthly subset
	{'label' : 'consumer prices' , 
	 'sheet' : 'monthly', 
	 'subSet' : 'cpi', 
	 'color' : 'red'},
	//yearly subset
	{'label' : 'total wages paid' ,
	 'sheet' : 'yearly',
	 'subSet' : 'allComp',
	 'color' : 'orange'},
	{'label' : 'farm wages',
 	 'sheet' : 'yearly',
	 'subSet' : 'farmComp',
	 'color' : 'yellow'},
	{'label' : 'total employees',
 	 'sheet' : 'yearly',
	 'subSet' : 'employees',
	 'color' : 'blue'}
	];

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

//drawGroups: Make a group based on each recession in recessions.csv
	//Bind the recession dates to div.rBox

function drawGroups(){
d3.select('div.viz')
	//.append('g').attr('id','recessions')
	.selectAll('div')
	.data(rec)
	.enter()
	.append('div')
	.attr('class','rBox');	
	}//CLOSE drawGroups
	
//recess: Nest each dataset into recessions and bind it into each drawgroup
	//Attach each group to g.recession#r1950, etc.	

function recess(){
	dataSets.forEach(function(d){
		
		})//CLOSE dataSets forEach
	}//CLOSE recess
		
//keyer: Draw keys based on every dataset, turn one on by default
	//Hand-build a variable that stores all datasets

//setDomains: Select all that are turned on linegroups
	//iterate through every single one to find the max and min percentages
	//iterate through every nested group to find the longest avialable recession

//drawFurniture: Shade recessions, add axes to every drawGroup
	//shade recessions
	//draw x and y axes
	//draw zero lines

//drawLines: function that accesses the linegroups
	//use the new scale to create a line generator
	//draw lines based on which keys are lit
	
	
//DATA DEPENDENT
d3.csv('recessions.csv', function(error,data){		
	data.forEach(function(d){
		d.peak = parseDate(d.peak);
		d.nextPeak = parseDate(d.nextPeak)
		d.trough = parseDate(d.trough);
		});//CLOSE recessions forEach
		rec = data;	
		console.log(rec);
	
		//load the annual csv
		d3.csv('annual.csv',function(error,dataY){
			dataY.forEach(function(d){
				d.date = parseDate(d.date);
				d.employees = +d.employees;
				d.farmComp = +d.farmComp;
				d.allComp = +d.allComp			
				});//CLOSE the forEach for annual csv
				yearly = dataY;			
			//load the monthly csv
			d3.csv('monthly.csv',function(error,dataM){
			dataM.forEach(function(d){
				d.date = parseDate(d.date);
				d.dataColumn = +d.dataColumn;			
				});//CLOSE the forEach for monthly csv
				monthly = dataM;
	
		//CALL FUNCTIONS
			drawGroups();	
	
	
			});//CLOSE the monthly csv read
	
		});//CLOSE the annual csv read
	
	});//CLOSE recessions csv read

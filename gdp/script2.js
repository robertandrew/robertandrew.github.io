//Show the prices of everything as bars
//with the option to choose what month and year prices start on
//three levels: decade, year, and month
//it filters everything that's not priced in that year
//and sorts by current price, start price, and percent change
//percent change is just a label -- bar is based on price
//default sorting is by percent change
//bars are colored based on major sector

//set global variables
var duration = 500;
var transition = 1000;
var delay = 100;
var detail;
var items;
var dates;
var chartSize = 100;
var labels = 0;
var cPad = 30;




var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	

var w = (labels * -1) + window.innerWidth - cPad * 3;
var h = (window.innerHeight * 0.8) - cPad * 2;

//declare scales and axes

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var defaultYear = parseYear('2001');


var wRange = [0,w/2];

var scaleX = d3.time.scale()
	.range(wRange);

var scaleY = d3.scale.linear()
	.range([chartSize,0]);
	
var barPoints = d3.scale.ordinal()
	.rangePoints(wRange);
	
var barWidth = d3.scale.ordinal()
	.rangeRoundBands(wRange,0.2);
	
var yAxis = d3.svg.axis()
	.orient('left')
	.ticks(5)
	.scale(scaleY);

var xAxis = d3.svg.axis()
	.orient('bottom')
	.ticks(5)
	.scale(scaleX);

var piv = [];

function bars(){
	var enter = d3.select('div.viz')
		.append('g')		
		.selectAll('div')
		.data(piv)
		.enter()
		.append('div');

	var svg = enter.append('svg')
		.attr('width',w + cPad + cPad)
		.attr('height',chartSize + cPad + cPad);
	
	var vis1 = svg.append('g')
		.attr('transform','translate(' + cPad + ',' + cPad + ')');
		
	vis1.append('g')
		.attr('id','x')
		.attr('class','axis')
		.call(xAxis)
		.attr('transform','translate(0,' + chartSize + ')');	

	vis1.append('g')
		.attr('id','y')
		.attr('class','axis')
		.call(yAxis);

	var enterRect = vis1.append('g')
		.selectAll('rect')
		.data(function(d){return d.values})
		.enter();
	
	var item;
	enterRect.append('rect')
		.attr('x',function(d){return barPoints(d.date)})
		.attr('y',function(d){
			item = scaleY(d.value) - scaleY(0);
			if(d.value < 0){
				return scaleY(0);
				}
			else if (d.value >= 0){
				return scaleY(d.value);
				};
		
			})//CLOSE Y
		.attr('width',barWidth.rangeBand())
		.attr('height',function(d){
			item = scaleY(d.value) - scaleY(0);		
			if(d.value < 0){
				return item;
				}
			else if(d.value >= 0){
				return item * -1;
				};
		
			})//CLOSE height
		
		.attr('class',function(d){
			if(d.value < 0){
				return'downRect'				
				}			
			else if(d.value >= 0){
				return 'upRect'}});
	
	

		
	};//CLOSEbars


//DATA DEPENDENT
d3.tsv('contribDetail.tsv',function(error,data){
	
	details = data;
	details.filter(function(d,i){return i != 0})
		.forEach(function(d,i){
			d3.range(1,62).forEach(function(d2,i2){
				piv.push({"date":parseDate(details[0]["d" + d2]),
							"id":d.ident,
							"label": d.label,
							"value": +d["d" + d2]})				
				})
			})

	piv = piv.filter(function(d){return d.date >= defaultYear});	
	scaleY.domain(d3.extent(piv,function(d){return d.value}));
	scaleX.domain(d3.extent(piv,function(d){return d.date}));
	
	piv = d3.nest()
		.key(function(d){return d.label})
		.entries(piv);
	
	barPoints.domain(piv[0].values.map(function(d){return d.date}));
	barWidth.domain(piv[0].values.map(function(d){return d.date}));
	
	bars();
	});//CLOSE contribs	

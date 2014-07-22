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
var delay = 1;
var prices;
var items;
var dates;
var keyset;

var defaultYear = '1970';

var svgMargin = 15;
var w = window.innerWidth - svgMargin * 2;
var h = (window.innerHeight * 0.8) - svgMargin * 2;


//set up the furniture
var svg = d3.select('div.viz').append('svg')
	.attr('height', h + svgMargin * 2)
	.attr('width',w  + svgMargin * 2);
	
var visCon = svg.append('g').attr('id','visCon')
	.attr('height', h)
	.attr('width', w)
	.attr('transform','translate(' + svgMargin + ',' + svgMargin + ')' );

//Draw a key that is heavily date-based
function key(){
	keyset = prices[0].values.map(function(d){return d.date})
	};//CLOSE key




//declare scales and axes

var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var barWidth = d3.scale.ordinal();

var itemize = d3.scale.ordinal();



//DATA DEPENDENT
d3.tsv('items.tsv',function(error,data){
	items = data;	
	
	itemize.domain(items.map(function(d){return d.item_code}))
		.range(items.map(function(d){return d.item_name}));	
	
	d3.tsv('prices.tsv',function(error,data2){
		data2.forEach(function(d){
			d.date = parseDate(d.date);
			d.value = +d.value;		
			})//CLOSE prices forEach
		
		console.log(data2);
		prices = d3.nest()
			.key(function(d){return d.series })
			.entries(data2);		
			
		console.log(data2);
		
		dates = d3.nest()
			.key(function(d){return d.year.substring(3,4)})
			.entries(data2);
		
});//CLOSE prices.tsv
});//CLOSE items.tsv	
	

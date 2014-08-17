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
var prices;
var items;
var dates;
var keyset;
var labels = 60;

var defaultYear = '1970';

var decader = d3.scale.ordinal()
	.domain(['194','195','196','197','198','199','200','201'])
	.range([1940,1950,1960,1970,1980,1990,2000,2010]);


var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	


var svgMargin = 15;
var w = (labels * -1) + window.innerWidth - svgMargin * 2;
var h = (window.innerHeight * 0.8) - svgMargin * 2;
var bw = w/12 - 5;
var bh = 14;

//set up the furniture
var svg = d3.select('div.viz').append('svg')
	.attr('height', h + svgMargin * 2)
	.attr('width',labels + w  + svgMargin * 2);
	
var visCon = svg.append('g').attr('id','visCon')
	.attr('height', h)
	.attr('width', w)
	.attr('transform','translate(' + svgMargin + ',' + svgMargin + ')' );



//declare scales and axes

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var barWidth = d3.scale.ordinal();

var itemize = d3.scale.ordinal();


//select item one, select item two
	//group items by type if possible
		//use expanding trees to select each
		//color each group based on color, then carry that color through to the barsgf		
	//Display XXXX in terms of YYYY
	
	
//Display all years for the two items
	//In 1992, one apple was worth six socks, in 1995 it was halved
	//Big set of vertical bars than can also be used as nav
	//


//match in serving sizes where possible?

function cats(){
	visCon.append('g')
		.attr('id','cats')
		.selectAll('text')
		.data(prices.filter(function(d,i){return i > 0}),function(d){return d.key})
		.enter()
		.append('text')
		.attr('x',0)
		.attr('y',function(d,i){return i *(h/prices.length + 2)})
		.text(function(d){return d.key})
		.attr('class','key')
		.attr('fill',function(d){return colorize(d.key)});
			
	}

var labels;

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
		
		d3.tsv('cpiItems.tsv',function(error,data3){
			console.log(data3);			
			labels = data3;	
			
		
		prices = d3.nest()
			.key(function(d){return itemize(d.series) })
			.entries(data2);		
		
		dates = d3.nest()
			.key(function(d){return decader(d.year.substring(0,3))})
			.key(function(d){return d.year})
			.sortKeys(d3.ascending)			
			.key(function(d){return d.month})
			.sortKeys(d3.ascending)			
			.entries(prices[0].values);
			
		cats();
		});//closeSeries.tsv
});//CLOSE prices.tsv
});//CLOSE items.tsv	
	

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

var decader = d3.scale.ordinal()
	.domain(['194','195','196','197','198','199','200','201'])
	.range([1940,1950,1960,1970,1980,1990,2000,2010]);

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
	var keyGroup = visCon.selectAll('g').data(dates).enter().append('g')
		.attr('id',function(d){return d.key});
	
	keyGroup.append('text').attr('class','dek').attr('x',function(d,i){return (i-1) *(w/12)}).attr('y',0)
		.text(function(d){return d.key});	
		
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
		
		prices = d3.nest()
			.key(function(d){return d.series })
			.entries(data2);		
		
		dates = d3.nest()
			.key(function(d){return decader(d.year.substring(0,3))})
			.key(function(d){return d.year})
			.sortKeys(d3.ascending)			
			.key(function(d){return d.month})
			.sortKeys(d3.ascending)			
			.entries(prices[0].values);
		
		key();
});//CLOSE prices.tsv
});//CLOSE items.tsv	
	

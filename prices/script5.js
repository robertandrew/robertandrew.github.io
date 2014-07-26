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


//Draw a key that is heavily date-based
function key(){
	
	function draw(ident,vOffset){
		var banana = d3.selectAll('g#' + ident)
			.append('rect')
			.attr('x',0)
			.attr('y',bh * vOffset)
			
		banana.attr('x',function(d,i){return (i) *(w/12)})
			.attr('height',bh)
			.attr('width',bw)
			.attr('fill',function(d){return colors(d.key)})
			.attr('rx',bh/4)
			.attr('ry',bh/4);	
	
					
		}
	
	//DRAW DECADES
	visCon.append('text')
		.text('DECADES')
		.style('text-anchor','end')
		.attr('x',labels - 5)
		.attr('y',0)
		.attr('id','decades')
		.attr('dy','1em')
		.attr('class','dek');
		
	var keyGroup = visCon.append('g')
		.attr('transform','translate(' + labels + ',0)')
		.selectAll('g')
		.data(dates)
		.enter()
		.append('g')
		.attr('id','decades')
		.attr('class','buttOff');

	
	keyGroup.append('text')
		.attr('class','dek')
		.attr('x',function(d,i){return (i) *(w/12) + (bw/2)})
		.attr('y',0)
		.text(function(d){return d.key})
		.attr('dy','1em');	
	
	
	//CLICK decades	
	d3.selectAll('g#decades').on('click', function(d,i){
		d3.selectAll('g.buttOn').attr('class','buttOff');
		d3.select(this).attr('class','buttOn');
		
		//get rid of excess furniture		
		d3.selectAll('#years').remove();		
		d3.selectAll('#months').remove();
							
		//DRAW YEARS
		
		visCon.append('text')
			.text('YEARS')
			.style('text-anchor','end')
			.attr('x',labels - 5)
			.attr('y',bh * 1.5)
			.attr('id','years')
			.attr('dy','1em')
			.attr('class','dek');
							
							
		var groupColor = colors(d.key);
		var yearGroup = visCon.append('g')
			.attr('transform','translate(' + labels + ',0)')
			.selectAll('g')
			.data(d.values)
			.enter()
			.append('g')
			.attr('id','years')
			.attr('class','buttOff');
		
		yearGroup.append('rect')
			.attr('y',bh * 1.5)
			.attr('x',function(d,i){return i * (w/12)})
			.attr('width', bw)
			.attr('height',bh)			
			.attr('fill',groupColor)
			.attr('rx',bh/4)
			.attr('ry',bh/4);		
		
		yearGroup.append('text')
			.attr('y',bh * 1.5)
			.attr('x',function(d,i){return i * (w/12) + (bw/2)})
			.text(function(d){return d.key})
			.attr('class','dek')
			.attr('dy','1em');
		
			
		//CLICK YEARS	
	d3.selectAll('g#years').on('click',function(d,i){
			d3.selectAll('g#years').attr('class','buttOff');
			d3.select(this).attr('class','buttOn');
			//remove excess furniture
			d3.selectAll('#months')
				.remove();
			
			//DRAW MONTHS
			visCon.append('text')
				.text('MONTHS')
				.style('text-anchor','end')
				.attr('x',labels - 5)
				.attr('y',bh * 3)
				.attr('id','months')
				.attr('dy','1em')
				.attr('class','dek');

			var monthGroup = visCon.append('g')
				.attr('transform','translate(' + labels + ',0)')
				.selectAll('g')
				.data(d.values)
				.enter()
				.append('g')
				.attr('class','buttOff')
				.attr('id','months');
				
				monthGroup.append('rect')
					.attr('x',function(d,i){return i * (w/12)})
					.attr('fill',groupColor)
				;
				monthGroup.select('rect')
					.transition()
					.duration(duration)
					.delay(function(d,i){return i * delay})
					.attr('y',bh * 3)
					.attr('width', bw)
					.attr('height',bh)			
					.attr('rx',bh/4)
					.attr('ry',bh/4);		
				
				monthGroup.append('text')
					.attr('y',bh * 3)
					.attr('x',function(d,i){return i * (w/12) + (bw/2)})
					.text(function(d){return d.key})
					.attr('class','dek')
					.attr('dy','1em');
					
		d3.selectAll('g#months').on('click',function(d,i){
			d3.selectAll('g#months').attr('class','buttOff');
			d3.select(this).attr('class','buttOn');
			console.log(d.values[0].date);
						
			})//CLOSE months click
						
			
			});//CLOSE DECADES click
			
			
						
			});//yearGroup
			
	};//CLOSE keyfunction




//declare scales and axes

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
	

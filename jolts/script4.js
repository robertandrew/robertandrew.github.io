	//set global variables
var duration = 500;
var delay = 1;
var jolts;
var start = '2007';
var offPacity = 0.8;
var findYear;

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

//declare scales and axes

var scaleX = d3.time.scale()
	.range([0,w]);
	
var scaleY = d3.scale.linear()
	.range([h,0]);

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom');

var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left');

var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var barWidth = d3.scale.ordinal()
	.rangeBands([0,w]);	

var barPos = d3.scale.ordinal()
	.rangePoints([0,w]);
	
viz = d3.select('div.viz').append('svg')
	.attr('height',h + (svgMargin * 2) )
	.attr('width', w + (svgMargin * 2))
	.append('g')
	.attr('transform','translate(' + svgMargin + ',' + svgMargin + ')');

	
//Window/HTML functions

d3.select('#start').on('input',function(){
	start = (this.value);
	update();

	});

function update(){

	d3.select('#start-value').text(start);
	d3.select('#start').property('value',start);
	}	
	
function resizer(){
	w = window.innerWidth - svgMargin * 2;
	h = (window.innerHeight * 0.4) - svgMargin * 2;
	svg.attr('width',w).attr('height',h); 	
	}

function lines(){
	
	pctMin = 0;
	pctMax = 0;
	jolts.forEach(function(d){
		findYear = d3.scale.ordinal()
			.range(d3.range(0,d.values.length))		
			.domain(d.values.map(function(d){return d.date}));
		
		var base = d.values[findYear(parseYear(start))].value;
		
	
		d.values.forEach(function(d){
			d.pct = (d.value - base)/base * 100;	
			if(d.pct > pctMax){pctMax = d.pct;};
			if(d.pct < pctMin){pctMin = d.pct;};
			
						
			})	
		;})	//close categorical forEach
	scaleY.domain([pctMin,pctMax]);
				
	visCon.append('g').attr('class','axis').call(yAxis);
	visCon.append('g').attr('class','axis').call(xAxis)
		.attr('transform','translate(0,' + h + ')');
		
		var lineGen = d3.svg.line()
			.x(function(d){return scaleX(d.date)})
			.y(function(d){return scaleY(d.pct)})
			.interpolate('cardinal');
		
		var pGroups = visCon.append('g').selectAll('g').data(jolts, function(d){return d.key});
		
		pGroups.enter().append('g').append('path').datum(function(d){return d.values})
			.attr('d',lineGen)
			.attr('stroke',function(d){
				return colors(d[0].category)})
			.attr('fill','none')
			.attr('stroke-width',2);
			
			
			
		
		
	}//close lines

function keys(dats){
	console.log(dats);
	d3.select('div.key')
		.append('g')
		.selectAll('span')
		.data(dats)
		.enter()
		.append('span')
		.text(function(d){return d + " "})
		.style('color',function(d){return colors(d)});
		
	}

//DATA DEPENDENT
	
	d3.tsv('jolts2.tsv',function(error,data2){
		data2.forEach(function(d){
			d.date = parseDate(d.date);
			d.value = +d.value;			
			})//CLOSE recessions forEach
		jolts = data2.filter(function(d){return d.type != 'rate'});
		
		scaleX.domain(d3.extent(jolts,function(d){return d.date}));		
		
		jolts = d3.nest()
			.key(function(d){return d.category})
			.sortKeys(d3.ascending)
			.entries(jolts);
		update();
		lines();
		keys(colors.domain());
});//CLOSE jolts TSV


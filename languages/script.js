//data independent
var margin = {
	'top': 15,
	'bottom': 20,
	'left': 50,
	'right': 150,
	'hed': 30,
	'key': 30},
	height = (2000 - margin.top - margin.bottom - margin.key - margin.hed),
	width = (700 - margin.right - margin.left);	

//set global variables
var duration = 2000;
var lett;

//draw containers
var svg = d3.select('body').append('svg')
	.attr('height',height + margin.top + margin.bottom +margin.key + margin.hed)
	.attr('width',width + margin.right + margin.left);
	
var hedcon = svg.append('g')
	.attr('id','hed')
	.attr('transform','translate(' + margin.left + ',' + margin.top + ')');

var keycon = svg.append('g')
	.attr('id','key')
	.attr('transform','translate(' + margin.left + ',' + (margin.top + margin.hed) + ')');

var viscon = svg.append('g')
	.attr('id','vis')
	.attr('transform','translate(' + margin.left + ',' + (margin.hed + margin.top + margin.key) + ')');
	

//declare scales

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black']);
	

var scaley = d3.scale.ordinal()
	.rangePoints([0,height]);

var letterheight = d3.scale.ordinal()
	.rangeRoundBands([0,height]);

var letterwidth = d3.scale.ordinal()
	.rangeRoundBands([0,width])	
	.domain(colorize.domain());
	
var scalex = d3.scale.ordinal()
	.rangePoints([0,width])
	.domain(colorize.domain());


function letterer(){
	
	var scaleText = d3.scale.sqrt()
		.domain([0,20])
		.range([0,d3.min(letterwidth.rangeBand(),letterheight.rangeBand())])	
	
	var lettergroups = viscon.append('g')
			.selectAll('g')
			.data(lett)
			.enter()
			.append('g');
			
	lettergroups.append('g')
		.selectAll('text')
		.data(function(d){return d.values})
		.enter()		
		.append('text')
		.text(function(d){return d.letter})
		.attr('font-size',function(d){return d.frequency})
		.attr('x',function(d){return scalex(d.language)})
		.attr('y',function(d){return scaley(d.letter)});
		
	lettergroups.append('g')
		.selectAll('text')
		.data(colorize.domain())
		.enter()
		.append('text')
		.text(function(d){return d})
		.attr('x',function(d){return scalex(d)})
		.attr('y',0)
		.attr('class','topLabel')
		.attr('dy','0em')
		.attr('transform','translate(0,-20)')
		.attr('fill',function(d){return colorize(d)});
	};

//DATA DEPENDENT
//load the tsv
d3.tsv('languages.tsv',function(error,data){
	data.forEach(function(d){
		d.frequency = +d.frequency;
			});		
		
	
	lett = data;
	
	lett = d3.nest()
		.key(function(d){return d.language})
		.entries(lett);
	//set all the domains
	scaley.domain(lett[0].values.map(function(d){return d.letter}));
	letterheight.domain(lett[0].values.map(function(d){return d.letter}));
	colorize.domain(lett.map(function(d){return d.key}));
	letterwidth.domain(lett.map(function(d){return d.key}));
	scalex.domain(lett.map(function(d){return d.key}));
	
		
	//call functions	
	letterer();
	

});

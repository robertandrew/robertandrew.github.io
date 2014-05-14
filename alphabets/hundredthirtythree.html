//data independent
var margin = {
	'top': 15,
	'bottom': 20,
	'left': 50,
	'right': 150,
	'hed': 20,
	'key': 60},
	height = (2000 - margin.top - margin.bottom - margin.key - margin.hed),
	width = (700 - margin.right - margin.left);	

//set global variables
var duration = 2000;
var lett;
var lettLive;

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

var scaleText = d3.scale.sqrt();

function letterer(){
	
		scaleText.range([0,letterwidth.rangeBand()])	
	
	var lettergroups = viscon.append('g')
			.selectAll('g')
			.data(lett)
			.enter()
			.append('g');
			
	lettergroups.append('g').attr('id','text')
		.selectAll('text')
		.data(function(d){return d.values})
		.enter()		
		.append('text')
		.attr('class','letters')
		.text(function(d){return d.letter})
		.attr('font-size',function(d){return scaleText(d.frequency)})
		.attr('x',function(d){return scalex(d.language)})
		.attr('y',function(d){return scaley(d.letter)})
		.style('fill',function(d){return colorize(d.language)})
		
		.append('title')
		.text(function(d){return d.frequency + "%"});
		
	lettergroups.append('g').attr('id','topLabel')
		.append('text')
		.text(function(d){return d.key})
		.attr('x',function(d){return scalex(d.key)})
		.attr('y',0)
		.attr('class','topLabel')
		.attr('dy','0em')
		.attr('transform','translate(0,-30)')
		.attr('fill',function(d){return colorize(d.key)});

	
	var rectWidth = letterheight.rangeBand() * 1.25;
	var rects = lettergroups.append('g').attr('id','rects')
		.append('rect')
		.attr('x',function(d){return scalex(d.key) - rectWidth/2})
		.attr('y',0)
		.attr('class','buttOn')
		.attr('width',rectWidth)
		.attr('height',4)
		.attr('transform','translate(0,-45)')
		.attr('fill',function(d){return colorize(d.key)});

	rects.on('click',function(d){
		var classy = d3.select(this).attr('class');
		console.log(classy);
		if (classy == 'buttOn') {
			d3.select(this).attr('class','buttOff')		
		}
		else{		
			d3.select(this).attr('class','buttOn')
		}		
		})

	};
	
function keyer(){
	var keySizes = ([2,4,6, 8, 10, 12, 16, 20]);
	
	keycon.append('g')
		.selectAll('text')
		.data(keySizes)
		.enter()
		.append('text')
		.attr('class','letters')
		.attr('x',function(d,i){return (keySizes.length - i -1) * (width / (keySizes.length-1)) })
		.attr('y',0)
		.text(function(d){return d + "%"})
		.attr('font-size',function(d){return scaleText(d)});
	
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
	
	lettLive = lett;	
	
	//set all the domains
	scaley.domain(lett[0].values.map(function(d){return d.letter}));
	scaleText.range([0,letterwidth.rangeBand()])
		.domain([0,d3.max(data,function(d){return d.frequency;})]);	

	letterheight.domain(lett[0].values.map(function(d){return d.letter}));
	colorize.domain(lett.map(function(d){return d.key}));
	letterwidth.domain(lett.map(function(d){return d.key}));
	scalex.domain(lett.map(function(d){return d.key}));
	
		
	//call functions	
	letterer();
	keyer();
	

});

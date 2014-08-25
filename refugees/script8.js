//set global variables
var duration = 750;
var transition = 1000;
var delay = 100;
var keys;
var refugees;
var years;
var chartSize = 100;
var labels = 0;
var cPad = 60;


var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	

var w =959 - cPad - cPad;// (labels * -1) + window.innerWidth - cPad * 3;
var h = 2000 - cPad - cPad// (window.innerHeight * 0.8) - cPad * 2;

//declare scales and axes

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var startYear = '2011';

var scaleX = d3.scale.ordinal()
	.rangePoints([0,w], 0.5);	

var scaleY = d3.scale.ordinal()
	.rangePoints([0,h], 0.5);
	
var scaleR = d3.scale.sqrt()
	.range([0,70]);
	
var groupName = d3.scale.ordinal();
	
var yAxis = d3.svg.axis()
	.orient('left')
	.ticks(5)
	.scale(scaleY);

var xAxis = d3.svg.axis()
	.orient('top')
	.ticks(5)
	.scale(scaleX);
	
var svg = d3.select('div.viz').append('svg')
	.attr('height',h + cPad + cPad)
	.attr('width',w + cPad + cPad);

var visCon = svg.append('g')
	.attr('transform','translate(' + cPad + ',' + cPad + ')');

	visCon.append('g').attr('id','x').attr('class','axis');
	visCon.append('g').attr('id','y').attr('class','axis');
	
var keySvg = d3.select('div.key').append('svg')
	.attr('height',30)
	.attr('width',w + cPad + cPad);
	
var keyCon = keySvg.append('g')
	.attr('transform','translate(' + cPad + ',' + 0 + ')');

var piv = [];

var scaleKey = d3.scale.ordinal()
	

//declare global functions

function key(){
		scaleKey.rangePoints([0,w])
		.domain(years);//d3.map(years, function(d){return d}));
		
	var buttG = keyCon.selectAll('g')
		.data(years)
		.enter()
		.append('g')
		.attr('class','buttOff');
	
	buttG.append('text')
		.attr('y',d3.select('div.key svg').attr('height') * 0.8)
		.attr('x',function(d){return scaleKey(d)})
		.text(function(d){return d});
		
	buttG.on('click',function(d){
		d3.selectAll('div.key g').attr('class','buttOff');
		d3.select(this).attr('class','buttOn');
			
		circler(d)});
	}


function circler(startYear){
	var liveSet = refugees.filter(function(d){return d.year == startYear});
	var xDomain = [];
	var yDomain = [];	
	liveSet.forEach(function(d){
		if(xDomain.indexOf(d.religion) < 0 && d.value > 0){
			xDomain.push(d.religion)			
			};
		if(yDomain.indexOf(d.country) < 0 && d.value > 0){
			yDomain.push(d.country)			
			};
			})//close forEach

		xDomain = xDomain.sort(d3.ascending);
		yDomain = yDomain.sort(d3.ascending);
		
	scaleR.domain(d3.extent(liveSet,function(d){return d.value}));
	scaleX.domain(xDomain);
	scaleY.domain(yDomain);	
	
	visCon.select('g#x')
		.transition()
		.duration(duration)
		.call(xAxis)
		.selectAll('text')
		.style('text-anchor','end')
		.attr('transform','rotate(90)')
		//.attr('transform','translate(0,-3)')
		.attr('dy','1em');
	visCon.select('g#y')
		.transition()
		.duration(duration)
		.call(yAxis);
	
	var circleData = visCon.selectAll('circle')
		.data(liveSet,function(d){return d.country + d.religion});
	
		var circleAppend = circleData.enter()
			.append('circle')
			.attr('class','circle')			
		
		circleData
			.transition()
			.duration(duration)
			.attr('cx',function(d){return scaleX(d.religion)})
			.attr('cy',function(d){return scaleY(d.country)})
			.attr('r',0)//function(d){return scaleR(d.value)})
			.attr('fill',function(d){return colors(d.country)})
			.transition()
			.duration(duration)
			.attr('r',function(d){return scaleR(d.value)});	
			
		circleData.exit()	
			.transition()
			.duration(duration)
			.attr('r',0)
			.remove();
			
		circleAppend.append('title')
			.text(function(d){return d.value + " " + d.religion + " from " + d.country });
		
	}
//DATA DEPENDENT

d3.csv('refugeeKey.csv', function(error, data1){
	keys = data1;				
				
	groupName.domain(keys.map(function(d){return d.label}));
	groupName.range(keys.map(function(d){return d.summary}));			

	d3.csv('refugees.csv',function(error,data){
		data.forEach(function(d){
			d.value = +d.value;	
			d.year = +d.year.substring(3,7);
			d.religionGroup = groupName(d.religion);
			d.continent = groupName(d.country);	
			})//close refugeesForeach
			
				refugees = data;	
				
				years = d3.range(d3.min(refugees,function(d){return d.year}),d3.max(refugees,function(d){return d.year}))		
				console.log(years);	
		
				
			key();
			circler(startYear);
			

	});//CLOSE refugees	
})//close key CSV

//set global variables
var duration = 500;
var delay = 1;
var claims;
var recessions;
var filterClaims;
var filterRecessions;
var claimYears;
var offPacity = 0.8;

var defaultYear = '1970';

var svgMargin = 40;
var w = window.innerWidth - svgMargin * 2;
var h = (window.innerHeight * 0.6) - svgMargin * 2;


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
	
var labeler = d3.scale.ordinal()
	.domain([6,7,8,9,0,1])
	.range(['1960s','1970s','1980s','1990s','2000s','2010s']);	

var parseDate = d3.time.format('%x').parse;

var parseYear = d3.time.format('%Y').parse;

var barWidth = d3.scale.ordinal()
	.rangeBands([0,w]);	

var barPos = d3.scale.ordinal()
	.rangePoints([0,w]);
	
//drop in some furniture
	var flag = visCon.append('text')
		.attr('x',0)
		.attr('y',0)
		.attr('id','flag')
		.style('text-anchor','middle')
		.attr('class','dek');
	

//global functions
	var rKey = function(d){
			return d.recession;		
		};	

	var cKey = function(d){
			return d.realDate;		
		};	


function updateBars(startYear){
	
	//define datasets based on input year
	var yearly = parseYear(startYear);

	filterClaims = claims.filter(function(d){return d.realDate >= yearly});
	filterRecessions = recessions.filter(function(d){return d.peak >= yearly});	

	console.log(filterClaims.length + " vs " + claims.length + " and " + filterRecessions.length + " vs " + recessions.length)

	//set all scales based on said input year
	scaleX.domain([yearly,d3.max(filterClaims, function(d){return d.realDate})]);
	scaleY.domain([0,d3.max(filterClaims, function(d){return d.iSA})]);

	barPos.domain(d3.extent(filterClaims, function(d){return d.realDate;}));
	barWidth.domain(filterClaims.map(function(d){return d.realDate}));
		
	//update the axes with the new scale		
	d3.select('g#x').call(xAxis);	
	d3.select('g#y').call(yAxis);	
	
	var rBind = visCon.select('g.recessions').selectAll('rect.recessions')
		.data(filterRecessions, cKey);
	
	rBind.enter()
		.append('rect')
		.attr('class','claims')
		.transition()
		.duration(duration)
		.attr('y',0)
		.attr('x',function(d){return 
			console.log(d);
			scaleX(d.peak)})
		.attr('height',h)
		.attr('width',function(d){return scaleX(d.trough - d.peak)})
		.style('opacity',offPacity);

	rBind.exit()
		.transition()
		.duration(duration)
		.style('opacity',0)
		.remove();


	var cBind = visCon.select('g.claims').selectAll('rect.claims')
		.data(filterClaims, cKey);
		
	cBind.enter()
		.append('rect')
		.attr('class','claims');

	cBind.transition()
		.duration()
		.attr('width',barWidth.rangeBand())
		.attr('x',function(d){return scaleX(d.realDate)})		
		.attr('height',function(d){return scaleY(d.iSA)})
		.attr('y',function(d){return h - scaleY(d.iSA)})
		.style('fill',function(d,i){
			return colorize(d.year.substring(2,3))
			});
	
	cBind.exit()
		.transition()
		.duration(duration)
		.style('opacity',0)
		.remove();
		
	}//close updatebars

	//set up tooltips
	function tooltips() {
		visCon.select('g.claims').selectAll('rect')
		.on('mouseover',function(d){
			
			tempH = d3.select(this).attr('height');
			
			tempW = d3.select(this).attr('width');
			
			d3.select('text#flag')
				.text(function(d1){return d.year + ": " + d.iSA})
				.attr('x',function(d1){return scaleX(d.realDate)})
				.style('fill',function(d2,i2){
					return colorize(d.year.substring(2,3));					
					});
			d3.select(this)
				.style('opacity',1)
				.attr('height',h)
				.attr('y',0)
				.attr('width', tempW * 5)
		
			})//close mouseover
		.on('mouseout',function(d){
			d3.select(this)
				.style('opacity',offPacity)
				.attr('height',tempH)
				.attr('y', h - tempH)
				.attr('width', tempW);			
			});//close mouseout
	
	};//CLOSE tooltips
	

function pctChg(start,end){
	return (end - start) / start * 100;
	};
	
//Window/HTML functions

d3.select('#rHeight').on('input',function(){
	update(+this.value)
	updateBars(this.value);	
	});

function update(rHeight){

	d3.select('#rHeight-value').text(rHeight);
	d3.select('#rHeight').property('value',rHeight);
	}	
	
function resizer(){
	w = window.innerWidth - svgMargin * 2;
	h = (window.innerHeight * 0.4) - svgMargin * 2;
	console.log(h + ' and w ' + w);
	svg.attr('width',w).attr('height',h); 	
	}

//DATA DEPENDENT
//load the csv
d3.csv('claims/claims.csv',function(error,data){		
	data.forEach(function(d){
		d.realDate = parseDate(d.realDate);
//		d.iNSA = + d.iNSA;
//		d.iSeasonality = +d.iSeasonality;
//		d.deviation = d.iSeasonality - (+d.avgSeasonality)
		d.iSA = +d.iSA;
//		d.iMonth = +d.iMonth;		
		});//CLOSE claims forEach
	
	claims = data.filter(function(d){return d.iNSA > 0});	
	
	

	//set domain
	
	//append axes
	visCon.append('g').attr('class','axis').attr('id','x')
		.attr('transform','translate(0,' + h + ')');
		
	visCon.append('g').attr('id','y')
		.attr('class','axis');
		
	visCon.append('g').attr('class','recessions');
	visCon.append('g').attr('class','claims');
	
	//call functions
	
	//load another useful CSV which will also contain the function calls
	d3.csv('recessions.csv',function(error,data2){
		data2.forEach(function(d){
			d.peak = parseDate(d.peak);
			d.trough = parseDate(d.trough);			
			})//CLOSE recessions forEach
		recessions = data2;
	
	updateBars(defaultYear);		
	update(+defaultYear);
	tooltips();

//	resizer();

		});// CLOSE recessions CSV	

});//CLOSE claims CSV


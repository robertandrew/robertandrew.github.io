//set global variables
var duration = 2000;
var eiSeries;
var eiCurrent;
var eiLocality;
var eiPeriod;
var eiHarmonize;
var harm;

//declare scales

var colorize = d3.scale.category20();
//	.range(['red','orange','green','blue','purple','black']);	

var parseDate = d3.time.format('%B%Y').parse;

var seriesLabeler = d3.scale.ordinal();
var monthLabeler = d3.scale.ordinal();

var scalex = d3.scale.linear()


//global functions

function changeBars(startYear,endYear){
	
	var winSize = window.innerWidth;
	var barHeight = winSize * 0.03;
	console.log(barHeight);
	scalex.domain([0,winSize * 0.7]);
	
		//append a full-width div
	var barCon = d3.select('div.viz')
			.selectAll('div')
			.data(harm)
			.enter()
			.append('div')
			.attr('class','barCon');
			
		//set the scale for the width within this particular div
		
		//float a 30% div right with a paragraph tag inside
		barCon.append('div')
			.attr()
			.attr('class','labelCon')
		//	.append('p')
			.text(function(d){return seriesLabeler(d.key) + d.values.length});
		//float a 70% div left with the dynamically sized svg inside
		var bars = barCon.append('div')
			.attr('class','bars')
			.style('height',barHeight *1.5);
		
		var svg = bars.append('svg')
			.attr('width', winSize * 0.7)
			.attr('height', barHeight * 1.5);
		
		svg.append('rect')
			.attr('x',0)
			.attr('y', barHeight * 0.25)
			.attr('width', function(d,i){
				
				var monthTranslator = d3.scale.ordinal()
					.domain(['m0'])					
					.range(d3.range(0,d.values.length));
					
				var w = scalex(d.values[d.values.length-1].value);
				
				console.log(monthTranslator.domain());				
				
				return w;
								
				})
			.attr('height', barHeight)
			.attr('fill',function(d){return colorize(d.key)});
					
	}

//DATA DEPENDENT
//load the tsv
d3.tsv('eiSeries.tsv',function(error,data){		
	eiSeries = data;		
	seriesLabeler
		.domain(eiSeries.map(function(d){return d.series_id}))
		.range(eiSeries.map(function(d){return d.series_name}));
		
	d3.tsv('eiPeriod.tsv', function(error1,data1){		
		eiPeriod = data1;
		monthLabeler
			.domain(eiPeriod.map(function(d){return d.period}))	
			.range(eiPeriod.map(function(d){return d.period_name}));
		
		d3.tsv('eiHarmoniz.tsv', function(error2, data2){
					
			data2.forEach(function(d){
				d.value = + d.value;
				d.month = d.period + '_' + d.year;
				//d.period = monthLabeler(d.period);
			//	d.time = parseDate(monthLabeler(d.period) + d.year);
			//	d.series_id = seriesLabeler(d.series_id);
				
				});//CLOSE forEach	
						
			eiHarmonize	= data2;
			
			//set ranges dependent upon full dataset
			scalex.range(d3.extent(eiHarmonize, function(d){return d.value}));				
			
			harm = d3.nest()
				.key(function(d){return d.series_id})
				.sortKeys(d3.ascending)
				.entries(eiHarmonize);
				
			//call functions
				changeBars();
									
						
						
			});//CLOSE eiHARMONIZE
			
		});//CLOSE eiPERIOD

	});//CLOSE eiSERIES


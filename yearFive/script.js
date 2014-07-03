//declare global variables
var duration = 2000;
var delay = 50;
var chartWidth = 100;
var chartPadding = 20;
var paddingMultiplier = 1.5;
var years;
var imports;
var longestTime;

var scaleX = d3.scale.ordinal()
	.rangePoints([0,chartWidth])
	.domain(['M07','M08','M09','M10','M11','M12',
		'M01','M02','M03','M04','M05','M06']);
					
	
var scaleY = d3.scale.linear().range([chartWidth, 0]);

var barHeight = d3.scale.ordinal()
	.rangeRoundBands([0,chartWidth],0.7);
	
var barPlace = d3.scale.ordinal()
	.rangeRoundBands([0,chartWidth],0.7);

var xAxis = d3.svg.axis()
	.scale(scaleX)
	.orient('bottom')
	.ticks(5);

var yAxis = d3.svg.axis()
	.scale(scaleY)
	.orient('left')
	.ticks(5);
	
var colors = d3.scale.ordinal()
	.range(['red','orange','blue','steelblue','purple','gray','green']);	

var parseDate = d3.time.format('%x').parse;

	//import everything
	//nest it based on year
	//nest it based on type
	//add percent change

//GLOBAL FUNCTIONS


function dataImport(tsv){
	
	var thisSet;	
	var pMax = 0;
	var pMin = 0;

	//IMPORT tsv
	d3.tsv(tsv + '.tsv',function(error, vData){
		vData.forEach(function(d1,i1){
			d1.date = parseDate(d1.date);
			d1.value = +d1.value;			
			
			years.forEach(function(d2,i2){
				if(d1.date < years[0].start){
					d1.year = 'early';					
					}
				else if(d1.date >= d2.start && d1.date <= d2.end){
					d1.year = d2.year;					
					}				
				
				})//close years forEach
			
			})//CLOSE vData forEach
			thisSet = d3.nest()
				.key(function(d){
					return d.year;})
				.sortKeys(d3.ascending)
				.key(function(d){return d.type})
				.entries(vData.filter(function(d){return d.year != 'early'}));
			thisSet.forEach(function(d1,i1){
				d1.values.forEach(function(d2,i2){
					d2.values.forEach(function(d4, i4){
						var base = d2.values[0].value;
						var pct =  (d4.value - base) / base * 100;
						d4.pct = pct;
						
						if(pct > pMax){
							pMax = pct;			
							}
						if(pct < pMin){
							pMin = pct;
							}
						
					})//close d2 forEach 
				
				})//close d1 forEach	
				
				})//close thisSet forEach		
			
			imports = thisSet;	 		
		
		//DIV for each TSV
		var setter = d3.select('div.viz').append('div')
			.attr('id',thisSet.key)			
			.attr('class','fullSet');
		
		colors.domain(thisSet[0].values.map(function(d){return d.key}));
		barHeight.domain(thisSet[0].values.map(function(d){return d.key}));
		barPlace.domain(thisSet[0].values.map(function(d){return d.key}));
				
		
		//HED for each TSV div
		setter.append('h3').attr('class','dek')
			.text(function(d){return tsv + ' by year';});
		
		//KEY for each TSV div
		var keyDiv = setter.append('div').attr('class','key')
			.selectAll('div')
			.data(thisSet[0].values)
			.enter()
			.append('div');		
		
		keyDiv.append('span')
			.text(function(d1){				
				return d1.key})		
			.attr('class','buttOn')
			.style('color',function(d,i){
				return colors(d.key)});
			
		//Add lineboxes to each TSV DIV	
		var boxer = setter.append('div').attr('class','boxers')
			.selectAll('div')
			.data(thisSet)
			.enter()
			.append('div')
			.attr('class','rCon');	
	
		var svg = boxer.append('svg')
			.attr('width',chartWidth * paddingMultiplier)
			.attr('height',chartWidth * paddingMultiplier * 2)
			.attr('id',"svg");
		
		var barBox = svg.append('g')
			.attr('class','lineBox')
			.attr('transform','translate(' + (chartWidth * ((paddingMultiplier -1)/2)) 
				+ ',' + (chartWidth * ((paddingMultiplier -1)/2)) + ')');

		barBox.append('text').attr('class','dek')
			.attr('x',0)
			.attr('y',0)
			.text(function(d){
				return d.key});
		
	//	barBox.selectAll('rect').data(\fd)
		
		
		//add lines
		var lineBox = svg.append('g')
			.attr('class','lineBox')
			.attr('transform','translate(' + 
				(chartWidth * ((paddingMultiplier - 1 )/2)) 
				+ ',' + (chartWidth * ((paddingMultiplier ))) + ')');
	
		//set the domains and ranges	
		
		scaleY.domain([pMin,pMax]);
		
		//add a zero line
		lineBox.append('rect')
			.attr('width',chartWidth)
			.attr('height','0.75px')
			.attr('class','axis')
			.attr('x',0)
			.attr('y',scaleY(0));
			
		
		//Call the axes		
		lineBox.append('g').attr('class','axis')
			.call(yAxis).attr('id','y');
				
		lineBox.append('g').attr('class','axis')
			.call(xAxis)
			.attr('id','x')
			.attr('transform','translate(0,' + chartWidth + ')');	
			
		var grouper = lineBox.append('g').selectAll('g')
			.data(function(d){
				return d.values;})
			.enter()
			.append('g')
			.attr('class','pathOff');
			
		grouper.transition()
			.duration(0)
			.each(function(d5,i5){
			//Set up the line generator
		
			var lineGen = d3.svg.line()
				.x(function(d,i){					
					return scaleX(d.month)})
				.y(function(d,i){return scaleY(d.pct)})
				.interpolate('cardinal');
			
			var drawPaths = d3.select(this).append('path')
				.datum(d5.values)
				.attr('d',lineGen)
				.attr('class','pathOff')
				.style('stroke',colors(d5.key))
				.append('title')
				.text(d5.key);	
		
			});//close each.end	
			
				
		})//CLOSE tsv	
		
				
		


		
	}//CLOSE dataImport





//prep data

//DATA DEPENDENT
d3.tsv('years.tsv',function(error, yData){
	yData.forEach(function(d){
		d.start = parseDate(d.start);
		d.end = parseDate(d.end);
		});	
		years = yData;
		dataImport('employedType');
		dataImport('unemployedType');
	});//CLOSE years.tsv

//draw boxes d3 style for all the years
	//within years, call forEach on the imports
//Put it all in one massive function that can take a csv and output a series of charts with a subhed	

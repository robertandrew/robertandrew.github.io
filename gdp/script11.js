//set global variables
var delay = 3;
var detail;
var items;
var dates = [];
var chartSize = 100;
var labels = 150;
var cPad = 30;
var duration = 500;
var startDate = "II2014";
var neg = "red";
var pos = "steelblue";	
var keyPiv = [];	
var gdp;

var shortLabeler = d3.scale.ordinal();
var longLabeler = d3.scale.ordinal();

var decader = d3.scale.ordinal()
	.domain(['194','195','196','197','198','199','200','201'])
	.range(['1940','1950','1960','1970','1980','1990','2000','2010']);

var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['orange','red','black','green','blue','purple'])
	.domain(['1940','1950','1960','1970','1980','1990','2000','2010']);

var w = (labels * -1) + window.innerWidth - cPad *2;
var h = 500;// (window.innerHeight * 0.8) - cPad * 2;
var bh = 40;
var bw = 60;
//declare scales and axes

var wRange = [0,w];

var scaleX = d3.scale.linear()
	.range(wRange);
	
var barPoints = d3.scale.ordinal()
	.rangePoints([0,h]);
	
var barHeight = d3.scale.ordinal()
	.rangeBands([0,h],0);
	
var xAxis = d3.svg.axis()
	.orient('top')
	.scale(scaleX);
	
var gdpAxis = d3.svg.axis()
	.orient('bottom')
	.scale(scaleX);

var piv = [];
var valueSet;
var keySet;
var tempest;

//set up the furniture for the main SVG
var svg = d3.select('div.viz').append('svg')
	.attr('width',w + cPad + cPad + labels)
	.attr('height',h + cPad + cPad);
	
var visCon = svg.append('g')
	.attr('transform','translate(' + cPad + ',' + cPad + ')');
	
var labelCon = visCon.append('g');

var barCon = visCon.append('g')
	.attr('transform','translate(' + labels + ',0)')
	.append('g').attr('id','barCon');

var furnCon = visCon.append('g')
	.attr('transform','translate(' + labels + ',0)')
	.append('g').attr('id','furnCon');
	
var xAxisSpot = barCon.append('g')
	.attr('class','axis')
	.attr('id','x')
	.call(xAxis);


	//set up the furniture for the GDP SVG	
	var gdpSvg = d3.select('div.gdp').append('svg')
		.attr('width',w + cPad + cPad + labels);	
	
	var gdpCon = gdpSvg.append('g')
		.attr('transform','translate(' + cPad + ',' + cPad + ')');
	
	var gdpBarCon = gdpCon.append('g')
		.attr('transform','translate(' + labels + ',0)');
	
	var gdpAxisSpot = gdpBarCon.append('g')
		.attr('class','axis')
		.attr('id','x')
		.call(gdpAxis);

//global functions
function ab(d){
	if(d>=0){return d}
	else if(d<0){return d * -1}
	};

function keys(){ 
	
	keySvg = d3.select('div.key')
		.append('svg')
		.attr('height',bh * dates.length + 2)
		.attr('width',w + cPad + cPad + labels);
		
	var keyCon = keySvg.append('g')
		.attr('transform','translate(' + (bh/3) + ',' + (0) + ')');
	
	dates.forEach(function(d,i){
		var decade = keyCon.append('g')
			.attr('transform','translate(' + (0) + ',' + (i * bh) + ')');
		
		var year = decade.selectAll('g')
			.data(d.values)			
			.enter()		
			.append('g')
			.attr('transform',function(d1,i1){ 	
				var place = d1.key.substring(3,4);
				return 'translate(' + (place * bw) + ',0)'})
			.attr('class','buttOff');
			
		year.append('text')
			.text(function(g){return g.key})
			.attr('x',bw * 0.5)
			.attr('y',0)
			.attr('dy','1em')
			.attr('font-size',bw * 0.3);
		
		var quarter = year.append('g')
			.selectAll('circle')
			.data(function(g){				
				return g.values})
			.enter();
		
		var quarterCircles = quarter.append('circle')
			.attr('class','qOff')
			.attr('cy',bh * 0.65)
			.attr('cx',function(d,i){return (i + 1.5) * bw/6})
			.attr('r',bw/16);		
		
		//add event listeners		

			quarterCircles.on('click',function(d){
				d3.selectAll('circle')
					.style('fill','white');				
				
				d3.select(this)
					.style('fill','red');
				
				console.log(d.date);				
				bars(d.date);			
				})	//close QUARTER listener	

			year.on('click',function(d1,i1){
				d3.selectAll('g.buttOn')
					.attr('class','buttOff');
				d3.selectAll('circle.qOn')
					.attr('class','qOff');
					
				d3.select(this)
					.transition()
					.duration(duration)
					.attr('class','buttOn');	
				
							
					
				})//close YEAR listener		
			
						
					
		
		});//end decadegroup forEach
		
		
	};//CLOSE keys
	

function bars(dater){
	
	//filter and nest dataset based on clicked date
	var temper = piv.filter(function(d){return d.date == dater });//&& d.id != "gdp"});
		
	var temper = d3.nest()
		.rollup(function(d){
			return {
				value:d3.sum(d,function(g){return g.value}),
				label:d[0].label,
				shortLabel:d[0].shortLabel,
				};
				})//close rollup
		.key(function(d){return d.id})
		.entries(temper);	
	
	tempest = temper;	
	
	var gdp = temper.filter(function(d){return d.key == "gdp"})
	
		
	temper = temper.filter(function(d){return d.key != "gdp"})
		.sort(function(a,b){
			return d3.ascending(a.values.value,b.values.value)});	
	
		
	
	//set domains
	//set max and min for x so we can set a domain
	
	var minx = 0;
	var maxx = 0;	
	
	temper.forEach(function(d,i){
		var chex = d.values.value;
		if (chex<0){minx = minx + chex};
		if (chex>0){maxx = maxx + chex};		
		})	
	
	if(maxx + minx <= 0){maxx = 0}
	else if(maxx + minx > 0){
		maxx = maxx + minx};
	
	var xExtent = ([minx,maxx]);
	scaleX.domain(xExtent);
	barPoints.domain(temper.map(function(d){return d.key}));
	barHeight.domain(temper.map(function(d){return d.key}));
	bh = barHeight.rangeBand();
	
	//add furniture 	
	xAxisSpot.call(xAxis);

	
	//Add xPos and width to everything in temp set	
	var stagger = 0;
	temper.forEach(function(d,i){
		d.w = scaleX(d.values.value) - scaleX(0);
		d.yPos = barPoints(d.key);
		d.stagger = stagger;
		stagger = stagger + ab(d.w);
		
		if(i==0){d.xPos = scaleX(0);
			if(d.w <= 0){d.fill = neg}
			else if(d.w > 0){d.fill = pos}}
		else if(i != 0 && temper[i-1].w <= 0 && d.w <= 0){
			d.fill = neg;
			d.xPos = +temper[i-1].xPos + temper[i-1].w;
			}//end negative if		
		else if(i != 0 && temper[i-1].w <= 0 && d.w > 0){
			d.fill = pos;
			d.xPos = +temper[i-1].xPos + temper[i-1].w;
			}//end mixed if		
		else if(i != 0 && temper[i-1].w > 0 && d.w > 0){
			d.fill = pos;
			d.xPos = +temper[i-1].xPos + temper[i-1].w; 			
			}//end positive if
		;//end conditionals
		});//close temper foreach	
	
	//add labels to the right for everything
	var textDrop = labelCon.selectAll('text')
		.data(temper)
		.enter()
		.append('text')
		.attr('x',labels)//function(g){return d.xPos + d.w + 10})
		.attr('y',function(d){return d.yPos})
		.text(function(d,i){
			return d.values.shortLabel})
		.attr('class','dek')
		.attr('text-anchor',"end")
		.attr('dy','0em')
		.style('font-size','70%')//barHeight.rangeBand() - 1)
		.attr('transform','translate(-4,' + (barHeight.rangeBand() - 1) + ')')
		.style('opacity',0)
		.attr('id',function(d){return d.key});
		
	//draw the bars using enter, update, exit
	var barData = barCon.selectAll('rect',function(d){return d.key})
		.data(temper,function(d){return d.key});
	
	var barEnter = barData.enter().append('rect');
	
	barEnter.attr('x',function(d){return d.xPos})
		.attr('y',function(d){return d.yPos})
		.attr('height',barHeight.rangeBand())
		.attr('width',0)
		.attr('fill',function(d){return d.fill});
	
	var barExit = barData.exit()
		.transition()
		.duration(1000)
		.attr('opacity',0)
		.remove();	
	
	//transition the bars so that they grow in order
	var grower = barCon.selectAll('rect',function(d){return d.key})
		.transition()
		.delay(function(d,i){return d.stagger * delay})
		
		.duration(function(d){return ab(d.w) * delay;})
		.attr('transform',function(d){
			if(d.w<=0){			
			return 'translate(' + d.w + ',0)'}
			else if(d.w>0){
			return 'translate(0,0)'	}
			})//end transform Anonymous
		.attr('x',function(d){return d.xPos})
		.attr('y',function(d){return d.yPos})
		.attr('height',barHeight.rangeBand())
		.attr('fill',function(d){return d.fill})
		.attr('width',function(d){
			return ab(d.w)})
		.each('end',function(d){
			stagger = stagger + ab(d.w) * delay;
			labelCon.select('text#' + d.key)
				.transition()
				.duration(200)
				.attr('y',d.yPos)
				.style('opacity',1)
								
			});
			
		//add event listener for bar mouseover
		barEnter.on('mouseover',function(d){
			barCon.append('text')
				.attr('y',d.yPos + barHeight.rangeBand())
				.attr('x',function(d1,i1){
					if(d.w<=0){return d.xPos + d.w -4} 
					else if(d.w>0){return d.xPos + d.w + 4};})
				.attr('class','tooltip')
				.text((d.values.label) + " " + d.values.value + " pp.")
				.style('text-anchor',function(g){
					if(d.w<=0){return 'end'}
					else if(d.w>0){return 'start'};					
					})
					
				.style('dy','0.9em')
				.style('font-size',barHeight.rangeBand() * 1);
							
			})//CLOSE mouseover
			.on('mouseout',function(d){
				d3.selectAll('text.tooltip').remove();				
				})	
		
		//Handle the zero line and other furniture
		furnCon.selectAll('rect#zero').remove();	
	
		furnCon.append('rect')
			.attr('width',1)
			.attr('height',h + barHeight.rangeBand())
			.attr('x',scaleX(0) - 0.5)
			.attr('y',0)
			.attr('id','zero')
			.attr('opacity',0.5)
			
	//add a GDP bar to the GDP div		
	
	gdpSvg.attr('height',bh + cPad + cPad);
		
	gdpAxisSpot.call(gdpAxis)
		.attr('transform','translate(0,' + (gdpSvg.attr('height') - cPad - cPad) + ')');

	var gdpBar = gdpBarCon.selectAll('rect')
		.data(gdp);
		
	gdpBar.enter()
		.append('rect');
	
	var gdpW;	
		
	gdpBar.attr('height',barHeight.rangeBand())
		.attr('width',function(d){
			gdpW = (scaleX(d.values.value) - scaleX(0))
			return ab(gdpW);})
		
		.attr('x',function(d,i){
			if(gdpW<=0){
				return scaleX(0) + gdpW}			
			else if(gdpW>=0)
				{return scaleX(0)}
				})
		.attr('fill',function(d,i){
			if(gdpW<=0){
				return neg}			
			else if(gdpW>=0)
				{return pos}
				});

	
		
	
		};//CLOSE bars


//DATA DEPENDENT
d3.tsv('gdpq2.tsv',function(error,data){
	
	
	keySet = data.filter(function(d,i){return d.quarter == "dummy"});
	
	
	valueSet = data.filter(function(d,i){return d.quarter != "dummy"});
	
	var setLength = valueSet.length;
	
	valueSet.forEach(function(d,i){
			dates.push({
				"y" : d.year,
				"q" : d.quarter,
				'date' : d.quarter + d.year,
				'decade': decader(d.year.substring(0,3)),
				});//closedatepush
			d3.range(1,setLength-1).forEach(function(d2,i2){
				var dumbId = "d" + d2;
				if(keySet[0][dumbId] != "exclude"){
					piv.push({"date":d.quarter + d.year,
								"id": keySet[0][dumbId],
								"label": keySet[2][dumbId],
								"shortLabel": keySet[1][dumbId],																
								"value": +d[dumbId]})				
					}//close conditional
				})//close forEach
			});//close valueSet forEach
	
	
	//manually nest keys in order to set up a labeling scale	
	d3.range(1,60).forEach(function(d3,i3){
		var dumbId = "d" + d3;
		keyPiv.push({
			'code': keySet[0][dumbId],
			'short': keySet[1][dumbId],
			'long': keySet[2][dumbId]})			
			})//close the keyPivot		
		
	//nest dates
	dates = d3.nest()
		.key(function(d){return d.decade})
		.sortKeys(d3.ascending)
		.key(function(d){return d.y})
		.sortKeys(d3.ascending)
		.entries(dates);	
	
	//call functions	
	keys();	
	bars(startDate);
	});//CLOSE contribs	

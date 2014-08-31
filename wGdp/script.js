//General plan 
 //Build a new nav based on the overall quarterly change
 //Change the animation style
 	//shrink and move all at once, then grow and label
 //Improve the tooltips
 //


//declare a grip of global variables
var delay = 3;
var detail;
var items;
var dates = [];
var labels = 150;
var cPad = 30;
var duration = 500;
var startDate = "Q1_2014";
var neg = "red";
var pos = "steelblue";	
var keyPiv = [];	
var piv = [];
var valueSet;
var keySet;
var labelOffset = 5;

var w = 959 - labels - cPad - cPad; // (labels * -1) + window.innerWidth - cPad *2;
var h = 400;
var navH = 120;
//var h = (window.innerHeight * 0.8) - cPad * 2;
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

var decader = d3.scale.ordinal()
	.domain(['194','195','196','197','198','199','200','201'])
	.range(['1940','1950','1960','1970','1980','1990','2000','2010']);

//set up the window furniture

	//for the nav
	
	var navSvg = d3.select('div.nav').append('svg')
		.attr('width',w + cPad + cPad + labels)
		.attr('height',navH + cPad + cPad);	
	
	var navCon = navSvg.append('g')
		.attr('transform','translate(' + cPad + ',' + cPad + ')');
	
	var navX = d3.scale.ordinal()
		.rangePoints([0, w + labels]);
	
	var navBarWidth = d3.scale.ordinal()
		.rangeRoundBands([0, w + labels], 0.2);	
	
		
	var navY = d3.scale.linear()
		.range([navH,0]);
	
//for the main visual
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

//global functions

//get the absolute value of whatever you pass into it

function ab(d){
	if(d>=0){return d}
	else if(d<0){return d * -1}
	};

//draw the old-school year/dots keys

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
	
//Draw the waterfall for everything\


function bars(dater){
	
	//filter and nest dataset based on clicked date
	var currentSet = piv.filter(function(d){return d.date == dater && d.id != "gdp"});
		
	var currentSet = d3.nest()
		.rollup(function(d){
			return {
				value:d3.sum(d,function(g){return g.value}),
				label:d[0].label,
				shortLabel:d[0].shortLabel,
				code:d[0].id,
				};
				})//close rollup
		.key(function(d){return d.id})
		.entries(currentSet);	
		
	currentSet = currentSet.filter(function(d){return d.id != "gdp"})
		.sort(function(a,b){
			return d3.ascending(a.values.value,b.values.value)});	
	
		
	
	//set domains
	//set max and min for x so we can set a domain
	
	var minx = 0;
	var maxx = 0;	
	
	currentSet.forEach(function(d,i){
		var chex = d.values.value;
		if (chex<0){minx = minx + chex};
		if (chex>0){maxx = maxx + chex};		
		})	
	
	if(maxx + minx <= 0){maxx = 0}
	else if(maxx + minx > 0){
		maxx = maxx + minx};
	
	var xExtent = ([minx,maxx]);
	scaleX.domain(xExtent);
	barPoints.domain(currentSet.map(function(d){return d.key}));
	barHeight.domain(currentSet.map(function(d){return d.key}));
	bh = barHeight.rangeBand();
	
	//add furniture 	
	xAxisSpot.call(xAxis);
	
	//Add xPos and width to everything in temp set	
	var stagger = 0;
	currentSet.forEach(function(d,i){
		d.w = scaleX(d.values.value) - scaleX(0);
		d.yPos = barPoints(d.key);
		d.stagger = stagger;
		stagger = stagger + ab(d.w);
		
		if(i==0){d.xPos = scaleX(0);
			if(d.w <= 0){d.fill = neg}
			else if(d.w > 0){d.fill = pos}}
		else if(i != 0 && currentSet[i-1].w <= 0 && d.w <= 0){
			d.fill = neg;
			d.xPos = +currentSet[i-1].xPos + currentSet[i-1].w;
			}//end negative if		
		else if(i != 0 && currentSet[i-1].w <= 0 && d.w > 0){
			d.fill = pos;
			d.xPos = +currentSet[i-1].xPos + currentSet[i-1].w;
			}//end mixed if		
		else if(i != 0 && currentSet[i-1].w > 0 && d.w > 0){
			d.fill = pos;
			d.xPos = +currentSet[i-1].xPos + currentSet[i-1].w; 			
			}//end positive if
		;//end conditionals
		});//close currentSet foreach	

	//add labels to the right for everything
	var textDrop = labelCon.selectAll('text')
		.data(currentSet)
		.enter()
		.append('text')
		.attr('x',labels)//function(g){return d.xPos + d.w + 10})
		.attr('y',function(d){return d.yPos - labelOffset})
		.text(function(d,i){
			return d.values.shortLabel})
		.attr('class','label')
		.attr('text-anchor',"end")
		.attr('dy','0.9em')
		.attr('transform','translate(-4,' + (barHeight.rangeBand() - 1) + ')')
		.style('opacity',0)
		.attr('id',function(d){return d.key});
		
	//draw the bars using enter, update, exit
	var barData = barCon.selectAll('rect',function(d){return d.key})
		.data(currentSet,function(d){return d.key});
	
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
				.attr('y',d.yPos + barHeight.rangeBand() - labelOffset)
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
				.style('font-size','10px');//barHeight.rangeBand() * 1);
							
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
	
			
		};//CLOSE bars

function nav(){
	var navSet = piv.filter(function(d){return d.id == "gdp"});
	navX.domain(navSet.map(function(d){return d.date}));
	navY.domain(d3.extent(navSet,function(d){return d.value}));
	navBarWidth.domain(navX.domain());
	
	var navXaxis = d3.svg.axis()
		.orient('bottom')
		.scale(navX);
	
	var navYaxis = d3.svg.axis()
		.orient('left')
		.scale(navY);

	navCon.append('g').attr('id','navX').attr('class','axis')
//		.call(navXaxis)
		.attr('transform','translate(0,' + navH + ')');
	
	navCon.append('g').attr('id','navY').attr('class','axis')
		.call(navYaxis);		
		
	
	//draw horizontal lines
	
	//draw zero line
	navCon.append('rect')
		.attr('width',w+labels)
		.attr('height',1)
		.attr('x',0)
		.attr('y',navY(0))
		.style('fill','black');
	
	//draw the GDP bars
	var navG = navCon.append('g')
		.selectAll('g')
		.data(navSet)
		.enter()
		.append('g')
		.attr('class','navBars');
	
	navG.append('rect')
		.attr('x',function(d,i){return navX(d.date)})
		.attr('y',function(d,i){
			if(d.value <= 0){
				return (navY(0))
				}//close negative conditional
			if(d.value > 0){
				return navY(0) - navY(d.value)				
				}//close positive conditional			
			})//close Y
		.attr('width',navBarWidth.rangeBand())
		.attr('height',function(d,i){
			if(d.value <= 0){
				return (navY(d.value) - navY(0))
				}//close negative conditional
			if(d.value > 0){
				return navY(d.value)				
				}//close positive conditional			
				
			})//close height
		.style('fill',function(d,i){
			if(d.value <=0){
				return neg;				
				}
			if(d.value > 0){
				return pos;				
				}
			});
	
	//label all the years	
	var yRange = navSet.filter(function(d){
		return d.date.substring(0,2)=='Q1'});
	
	var yGroup = navCon.append('g')
		.attr('id','years')
		.selectAll('g')
		.data(yRange)
		.enter()
		.append('g');
		
	yGroup.append('text')
		.attr('y',navH)
		.attr('x',function(d){return navX(d.date)})	
		.text(function(d){return d.date.substring(3,7)})
		.attr('class','axis');	
		
	
	//Create event listeners for all the bars
		
	
	var clickRect = navG.append('rect')
			.attr('class','highlight')
			.style('opacity',0)
			.style('fill','grey')
			.attr('width',navBarWidth.rangeBand())
			.attr('height',navH)
			.attr('x',function(d){return navX(d.date)})
			.attr('y',0);
	
	clickRect.on('mouseover',function(d,i){
		d3.select(this)
			.style('opacity',0.4)	
				})//close mouseover listener
		.on('mouseout',function(d,i){
				d3.select(this)
				.style('opacity',0)
				
				})//close mouseout listener
		.on('click',function(d,i){
			bars(d.date);			
			})
	};

piv.filter(function(d){return d.id == "gdp"});


//DATA DEPENDENT
d3.tsv('gdpContrib.tsv',function(error,data){
	
	keySet = data.filter(function(d,i){return d.date == "dummy"});
	
	valueSet = data.filter(function(d,i){return d.date != "dummy"});
	var setLength = valueSet.length;
	
	valueSet.forEach(function(d,i){
			dates.push({
				"y" : d.date.substring(3,7),
				"q" : d.date.substring(0,2),
				'date' : d.date,
				'decade': decader(d.date.substring(3,6)),
				});//closedatepush
			d3.range(1,setLength-1).forEach(function(d2,i2){
				var dumbId = "d" + d2;
				if(keySet[0][dumbId] != "exclude"){
					piv.push({"date":d.date,
								"id": keySet[0][dumbId],
								"label": keySet[3][dumbId],
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
			'long': keySet[3][dumbId]})			
			})//close the keyPivot		
		
	//nest dates
	dates = d3.nest()
		.key(function(d){return d.decade})
		.sortKeys(d3.ascending)
		.key(function(d){return d.y})
		.sortKeys(d3.ascending)
		.entries(dates);	
		
	//call functions	
	nav();
	bars(startDate);
	});//CLOSE contribs	

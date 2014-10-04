//set global variables
var delay = 10;
var detail;
var items;
var chartSize = 100;
var labels = 200;
var cPad = 30;
var piv = [];
var duration = 500;
var startDate = "II2014";
var neg = "grey";
var pos = "pink";	
var keyPiv = [];	

var dates = [];
var navH = 80;
var valueSet;
var keySet;
var tempest;
var gdp;
var mostRecentSet; //global that stores the most recent dataset so that it can be called again upon resize
var offPacity = 0.5;
var w;//global width variable

function stricterSetWidth(){

	var win = d3.round(window.innerWidth,0); 
	//the decimal is to create an experimental buffer to account for scroll bars, etc.		
	
	if(win > 959){w = 959 * 0.9- cPad - cPad - labels; }

	else if(win <= 959 && win > 650){w = 650 * 0.9 - cPad - cPad - labels; }//650 can be changed to "win" if we want dynamic resizing within the typical window range

	else if(win <= 650 ){w = 350 * 0.9 - cPad - cPad - labels; }
	};

stricterSetWidth();

var h = 700 - cPad - cPad;// (window.innerHeight * 0.8) - cPad * 2;
var bw = 60;

var decader = d3.scale.ordinal()
	.domain(['194','195','196','197','198','199','200','201'])
	.range(['1940','1950','1960','1970','1980','1990','2000','2010']);

var quarterer = d3.scale.ordinal()
	.domain(['I','II','III','IV'])
	.range(['Q1','Q2','Q3','Q4']);


var scaleX = d3.scale.linear();
	
var barPoints = d3.scale.ordinal()
	.rangePoints([0,h]);
	
var barHeight = d3.scale.ordinal()
	.rangeBands([0,h],0);
	
var bottomAxis = d3.svg.axis()
	.orient('bottom')
	.scale(scaleX);
	
var topAxis = d3.svg.axis()
	.orient('top')
	.scale(scaleX);
	
	var navSvg = d3.select('div#nav div.chart')
		.append('svg')
		.attr('width',w + cPad + cPad + labels)
		.attr('height',navH + cPad + cPad);	
	
	var navCon = navSvg.append('g')
		.attr('transform','translate(' + cPad + ',' + cPad + ')');
	
	//add distinct groups to the navigation container
		//Needs to include years, lines and bars 
	var navYearG = navCon.append('g').attr('id','navYears')
		.attr('class','years');
	var navLineG = navCon.append('g').attr('id','navPaths');
	var navBarG = navCon.append('g').attr('id','navBars');
	var navClickG = navCon.append('g').attr('id','navClicks');

	navCon.append('g').attr('id','navX').attr('class','axis')
		.attr('transform','translate(0,' + navH + ')');	
	navCon.append('g').attr('id','navY').attr('class','axis');		

	var navBarWidth = d3.scale.ordinal();	
	var navX = d3.scale.ordinal();
	var navY = d3.scale.linear()
		.range([navH,0]).nice();

//set up the groups for the main SVG
var svg = d3.select('div#waterfall div.chart').append('svg');
	
	//group that holds all the graphy stuff
	var visCon = svg.append('g')
		.attr('transform','translate(' + cPad + ',' + cPad + ')');
	
	//group that holds the main GDP bar and its axis
	var gdpG = visCon.append('g')
	var gdpBarG = gdpG.append('g')
	var gdpLabelG = gdpG.append('g')
			
			
	//group that holds the waterfall 
		var wfG = visCon.append('g').attr('id','wfG');
	
			var labelG = wfG.append('g');
			var wfBarG = wfG.append('g');
			var gdpLabelG = visCon.append('g')
			var invisibleG = wfG.append('g');	
				
		var topAxisG = wfBarG.append('g')
			.attr('class','axis')
			.attr('id','xTop')
			.call(topAxis);
			
		var bottomAxisG = wfBarG.append('g')
			.attr('class','axis')
			.attr('id','xBottom')
			.call(bottomAxis);

//global functions

//return the absolute value of a thing
function ab(d){
	if(d>=0){return d}
	else if(d<0){return d * -1}
	};

//draw an easy year/quarter nav

function nav(){
	
	//reset scaleX every time the function is called
	var navSet = piv.filter(function(d){return d.id == "gdp"});
	navX.domain(navSet.map(function(d){return d.date}))
		.rangePoints([0, w + labels]);
	navY.domain(d3.extent(navSet,function(d){return d.value}));
	navY.nice();
	scaleX.range([0,w]).nice();
	
	navBarWidth.rangeRoundBands([0, w + labels], 0.2)
		.domain(navX.domain());
	
	var navXaxis = d3.svg.axis()
		.orient('bottom')
		.scale(navX);
	
	var navYaxis = d3.svg.axis()
		.orient('left')
		.scale(navY);

	//change the SVG size according to the new W
	navSvg.attr('width',w + cPad + cPad + labels);

	//recall the Y axis each timex
	navCon.select('g#navY').call(navYaxis);
	//stretch the ticks out into horizontal lines
	d3.selectAll('g#navY .tick line ')
		.attr('x2',w + labels + navBarWidth.rangeBand() * 2);
	
	//draw zero line
	navCon.selectAll('rect#zero').remove();
	navCon.append('rect')
		.attr('id','zero')
		.attr('width',w+labels+navBarWidth.rangeBand())
		.attr('height',1)
		.attr('x',0)
		.attr('y',navY(0))
		.style('fill','black');
		
	//navYearG, navLineG, navBarG
	//draw the GDP bars
	var navBars = navBarG.selectAll('rect')
		.data(navSet,function(d,i){return d.date});
	
	navBars.enter()
		.append('rect')
		.style('opacity',0);

	navBars.attr('x',function(d,i){return navX(d.date)})
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
			})
		.style('opacity',offPacity);
	
	//label all the years	
	var yRange = navSet.filter(function(d){
		return d.q=='I'});
	
	var navYears = navYearG.selectAll('text')
		.data(yRange,function(d){return d.date});
	
	navYears.enter()
		.append('text');
		
	navYears.attr('y',0)
		.attr('x',function(d){return navX(d.date)})	
		.text(function(d){return "'" + d.date.substring(3,7)})
		.attr('class','axis');	
	
	//add vertical lines for each eyar
	var navLines = navLineG.selectAll('line').data(yRange);
	
	navLines.enter()
		.append('line')
		.attr('y1',0)
		.attr('y2',navH);	

	navLines.attr('x1',function(d){return navX(d.date)})
		.attr('x2',function(d){return navX(d.date)})

	
	//Draw rectangles over every quarter
	
	var clickRect = navClickG
		.selectAll('rect')
		.data(navSet,function(d){return d.date});
	
	clickRect.enter()
		.append('rect');
	
	clickRect.attr('id',function(d){return d.date})
		.attr('class','clickOff')
		.attr('width',navBarWidth.rangeBand())
		.attr('height',navH)
		.attr('x',function(d){return navX(d.date)})
		.attr('y',0);
	
	var clickState;
	
	clickRect.on('mouseover',function(d,i){
		
		clickState = d3.select(this).attr('class');	
		
		d3.select(this)
			.attr('class','clickOn')	
				})//close mouseover listener
		.on('click',function(d,i){
			clickState = 'clickOn';			
			navClickG.selectAll('rect.clickOn')
				.attr('class','clickOff');
				bars(d.date);			
				})
	
		.on('mouseout',function(d,i){
			d3.select(this)			
			.attr('class',clickState);				
				})//close mouseout listener
		};

	
//draw all the bars
function bars(dater){
	mostRecentSet = dater;//stores the most recent set so that it can be recalled upon resize without additional input	
	
		//reset scaleX every time the function is called
	scaleX.range([0,w]).nice()

		//reset the highlighted bar situation
		d3.selectAll('div.nav rect.clickOn').attr('class','clickOff');
		d3.select('rect#' + dater).attr('class','clickOn');
	//DATA PREP	
		//filter and nest dataset based on clicked date
		var wfData = piv.filter(function(d){return d.date == dater });
			
		var wfData = d3.nest()
			.rollup(function(d){
				return {
					value:d3.sum(d,function(g){return g.value}),
					label:d[0].label,
					shortLabel:d[0].shortLabel,
					q:quarterer(d[0].q),
					y:d[0].y
					};
					})//close rollup
			.key(function(d){return d.id})
			.entries(wfData);	
		
		var gdp = wfData.filter(function(d){return d.key == "gdp"})
			
		wfData = wfData.filter(function(d){return d.key != "gdp"})
			.sort(function(a,b){
				return d3.ascending(a.values.value,b.values.value)});	
		
	//SVG PREP	
	//set the sizes for everything
	svg.attr('width',w + cPad + cPad + labels);
		//set max and min for x so we can set a domain
		var minx = 0;
		var maxx = 0;	
	
		wfData.forEach(function(d,i){
			var chex = d.values.value;
			if (chex<0){minx = minx + chex};
			if (chex>0){maxx = maxx + chex};		
			})	
	
		if(maxx + minx <= 0){maxx = 0}
		else if(maxx + minx > 0){
			maxx = maxx + minx};
	
		var xExtent = ([minx,maxx]);
	
		//set the domains and derivative variables upon which all else will be based
		scaleX.domain(xExtent).nice();
		barPoints.domain(wfData.map(function(d){return d.key}));
		
		barHeight.domain(wfData.map(function(d){return d.key}));
		
			bh = barHeight.rangeBand();
			var gdpH = bh * 1.5;
	
	//change SVG size to hold GDP
	svg.attr('height',h + gdpH +cPad +cPad + cPad + cPad);
	
	//move all the groups into place
		gdpBarG.attr('transform','translate(' + labels + ',0)');
		gdpLabelG.attr('transform','translate(-4,' + (bh * 0.8) + ')');
			
		wfBarG.attr('transform','translate(' + labels + ',0)');	
		wfG.attr('transform','translate(' + 0 + ',' + gdpH + ')');	
		labelG.attr('transform','translate(-4,' + (bh * 0.8) + ')');
	
	//call an axis for both the top and the bottom 	
		bottomAxisG.call(bottomAxis)
			.attr('transform','translate(0,' + (h + bh) + ')');
		
		topAxisG.call(topAxis)
			.attr('transform','translate(0,' + ((gdpH) * -1) + ')');
		
		
		d3.selectAll('g#xTop .tick line ')
			.attr('y1',h + (bh * 2.5))
			
		d3.selectAll('line').attr('class','dashed');

	//add an active background bar to the GDP
	gdpG.selectAll('rect').data(gdp)
		.enter()
		.append('rect')
		.attr('width',w + labels)
		.attr('height', bh)
		.attr('x',0)
		.attr('y',0)
		.attr('class','clickOn');
	//add a GDP bar to the GDP group		
	var gdpBar = gdpBarG.selectAll('rect')
		.data(gdp);

	var gdpW;	
			
	gdpBar.enter()
			.append('rect');
			
			
	gdpBar.attr('width',0)
			.style('opacity',0.5)
			.attr('x',scaleX(0))
			.attr('fill',function(d,i){
				gdpW = (scaleX(d.values.value) - scaleX(0))
					
			if(gdpW<=0){
				return neg}			
			else if(gdpW>=0)
				{return pos}
				});
		
	var gdpLabel = gdpLabelG.selectAll('text')
		.data(gdp);
		
	gdpLabel.enter()
		.append('text')
	
	gdpLabel.text(function(d){
			return "Overall GDP for " + d.values.q + " " + d.values.y})
		.attr('x',labels)
		.attr('class','dek')
		.style('font-weight','bold')
		.style('text-anchor',"end")
		.style('dy','0em')
		.style('font-size','70%')//barHeight.rangeBand() - 1)
		.style('opacity',1);
		
	gdpBar.transition()
		.duration(duration)
		.attr('height',barHeight.rangeBand())
		.attr('width',function(d){
			return ab(gdpW);})
		
		.attr('x',function(d,i){
			if(gdpW<=0){
				return scaleX(0) + gdpW}			
			else if(gdpW>=0)
				{return scaleX(0)}
				});
				
				
	
	//draw the waterfall


		//Add xPos and width to everything in temp set	
		
		var timeOffset = 0; //sets the timing offset
		wfData.forEach(function(d,i){
			d.w = scaleX(d.values.value) - scaleX(0);
			d.yPos = barPoints(d.key);
			d.timeOffset = timeOffset;
			timeOffset = timeOffset + ab(d.w);
			
			if(i==0){d.xPos = scaleX(0);
				if(d.w <= 0){d.fill = neg}
				else if(d.w > 0){d.fill = pos}}
			else if(i != 0 && wfData[i-1].w <= 0 && d.w <= 0){
				d.fill = neg;
				d.xPos = +wfData[i-1].xPos + wfData[i-1].w;
				}//end negative if		
			else if(i != 0 && wfData[i-1].w <= 0 && d.w > 0){
				d.fill = pos;
				d.xPos = +wfData[i-1].xPos + wfData[i-1].w;
				}//end mixed if		
			else if(i != 0 && wfData[i-1].w > 0 && d.w > 0){
				d.fill = pos;
				d.xPos = +wfData[i-1].xPos + wfData[i-1].w; 			
				}//end positive if
			;//end conditionals
			});//close wfData foreach	
	
		//add labels to the right for everything
		var textDrop = labelG.selectAll('text')
			.data(wfData);//don't specify a key function because it ruins everything
		
		var textAdd = textDrop.enter()
			.append('text')
			.style('font-size','70%')//barHeight.rangeBand() - 1)
;
			
		textDrop
			.attr('class','dek')
			.transition()
			.duration(duration)
			.attr('x',labels)//function(g){return d.xPos + d.w + 10})
			.attr('y',function(d){return d.yPos - (barHeight.rangeBand()* 0.4)})
			.text(function(d,i){
				return d.values.shortLabel})
			.attr('text-anchor',"end")
			.attr('dy','0.5em')
			.attr('id',function(d){
				return d.key});
		
		textDrop.exit()
			.transition()
			.duration(duration)
			.remove();
		
		
	//draw the bars using enter, update, exit
	
		//make the bars present in the DOM
			//width should be zero, all other attributes should be intact
	
		var barData = wfBarG.selectAll('rect')
			.data(wfData,function(d){return d.key});
		
		var barEnter = barData.enter().append('rect');
		
		var barUpdate = barData
			.attr('x',function(d){return d.xPos})
			.attr('y',function(d){return d.yPos})
			.attr('height',barHeight.rangeBand())
			.attr('width',0)
			.attr('id',function(d){return d.key})
			.attr('fill',function(d){return d.fill})
			.style('opacity',0.4);
			
		
		barData.exit()
			.transition()
			.remove();	
	
	
		//add invisible listener rects on top of everything
		
		var invisibleRect = invisibleG.selectAll('rect')
			.data(wfData,function(d){return d.key});
			
		invisibleRect.enter()
			.append('rect');
		
		invisibleRect.attr('x', 0)
			.style('opacity',0)
			.style('fill','grey')
			.attr('class','turkey')
			.attr('y',function(d){return d.yPos})
			.attr('height',barHeight.rangeBand())
			.attr('width', w + labels + cPad + cPad);
			
		invisibleRect.exit()
			.transition()
			.remove();				
			
		//grow the bars in a wonderful, elegant waterfall	
		barUpdate.transition()
			.delay(function(d,i){return d.timeOffset * delay})
			
			.duration(function(d){return ab(d.w) * delay;})
			.attr('transform',function(d){
				if(d.w<=0){			
				return 'translate(' + d.w + ',0)'}
				else if(d.w>0){
				return 'translate(0,0)'	}
				})//end transform Anonymous
			.attr('fill',function(d){return d.fill})
			.attr('width',function(d){
				return ab(d.w)})
			.each('end',function(d){
				timeOffset = timeOffset + ab(d.w) * delay;
				labelG.select('text#' + d.key)
					.transition()
					.duration(200)
					.style('opacity',1)							
				});
	
/////Waterfall mouseovers

		var prevPacity = 0.5; //this is just a placeholder value that should never have to be used
		var prevWeight = 'light'; //placeholder value
		var prevX = 0;//placeholder	
		//add event listener for bar mouseover
		d3.selectAll('rect.turkey').on('mouseover',function(d){
			prevWeight = d3.select(this).style('font-weight');
			prevX = d3.select('text#' + d.key).attr('x');
	
			//select the relevant label and move it	
			d3.select('text#' + d.key)
				.transition()
				.duration(duration)
				.style('font-weight','bold')
				.attr('x',function(d1,i1){
					if(d.w<=0){
						return d.xPos + d.w + labels}
					else if(d.w>0){
						return d.xPos + labels }
					})//close x conditional
					;
					
			//select the relevant waterfall bar and highlight it
			d3.select('rect#' + d.key)
				.transition()
				.duration(duration)
				.style('opacity', 1);		
			d3.select(this).style('opacity',0.1);
			wfBarG.append('text')
				.attr('y',d.yPos + (barHeight.rangeBand() * 0.4))
				.attr('x',w)
				.style('opacity',0)
				.attr('class','tooltip')
				.text(function(d2,i2){
					if(d.w==0){return d.values.value}
					else if(d.w<0){return d.values.value}
					else if(d.w>0){return "+" + d.values.value};
					})//close text tooltipping function
				.style('text-anchor',function(g){
					if(d.w<=0){return 'start'}
					else if(d.w>0){return 'start'};					
					})
				.style('font-size','110%')
				.attr('dy','0.5em');
			
			wfBarG.select('text.tooltip')
				.transition()
				.duration(duration)
				.attr('x',function(d1,i1){
					if(d.w<=0){return d.xPos + 4} 
					else if(d.w>0){return d.xPos + d.w + 4};})				
				.style('opacity',0.7);
							
			})//CLOSE mouseover
			.on('mouseout',function(d){
				d3.selectAll('text.tooltip').remove();			
				d3.select(this).style('opacity',0.0);				
				d3.select('text#' + d.key)
					.transition()
					.duration(duration)
					.style('font-weight','normal')
					.attr('x',prevX);

			d3.select('rect#' + d.key)
				.transition()
				.duration(duration/2)
				.style('opacity', 0.4);		

				})	
		
		//Redraw the zero line every time
		gdpBarG.selectAll('rect#zero').remove();	
	
		gdpBarG.append('rect')
			.attr('width',1)
			.attr('height',h + barHeight.rangeBand() + gdpH)
			.attr('x',scaleX(0) - 0.5)
			.attr('y',0)
			.attr('id','zero');
			
	
		};//CLOSE bars

//DATA DEPENDENT
d3.tsv('gdpq2.tsv',function(error,data){
	
	hap = data;
	
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
			Object.keys(valueSet[0]).forEach(function(d2,i2){
				if(keySet[0][d2] != "exclude" && keySet[0][d2] != "dummy" && keySet[0][d2] != "id"){
					piv.push({"date":d.quarter + d.year,
								"q":d.quarter,
								"y":d.year,
								"id": keySet[0][d2],
								"label": keySet[2][d2],
								"shortLabel": keySet[1][d2],																
								"value": +d[d2]})				
					}//close conditional
				})//close forEach
			});//close valueSet forEach
	
	//manually nest keys in order to set up a labeling scale	
		Object.keys(keySet[0]).forEach(function(d4,i4){
		keyPiv.push({
			'code': keySet[0][d4],
			'short': keySet[1][d4],
			'long': keySet[2][d4]})			
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
	
	//handle resize events
	
	var oldWin = 0; //compares the new resize window to see if we've crossed a Rubicon
	window.addEventListener('resize',function(event){
		oldWin = d3.round(w,0);// this is before we rerun setWidth		
		stricterSetWidth();
		if(w != oldWin){
			//call functions if the window has been resized a lot
			nav();	
			bars(mostRecentSet);
			oldWin = d3.round(w,0);//now that it's been fed through the conditional ladder, the window size is officially the old window size				
		
		
		};//CLOSE conditional for width
		})//CLOSE resize event listener
	
	
	
	});//CLOSE contribs	

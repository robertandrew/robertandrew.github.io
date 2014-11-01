(function() {

	$(function() {
	
////////MY BUSINESS///////

//return the absolute value of a thing
function ab(d){
	if(d>=0){return d}
	else if(d<0){return d * -1}
	};

//json format a date
var parseDate = d3.time.format('%x').parse;

//takes a dataset and a startdate in mm/dd/yyyy

function boxer(dataSetRaw,startDate,recessSet){
	
	var rawStartDate = startDate;
	
	d3.select('text#unchangedLabel')
		.attr('x',0)
		.attr('text-anchor','end')
		.attr('class','axis');
	//other global attributes
	var duration = 500;	
	
	//constrict dataSet based on startDate
	startDate = parseDate(startDate);	
	var dataSet = dataSetRaw.filter(function(d){return d.values[0].dateObj >= startDate});	
	
	//constrict the recessions, but also modify the start date
	var recess = recessSet.filter(function(d){return d.trough >= startDate});
	if(recess[0].peak <= startDate){
		recess[0].peak = startDate};
	
	//set the width for the SVG based on the window's width
	var w = 0;//placeholder			
	var win = window.innerWidth;
	var wInset = 0.9; //share of the window which, at max, can be occupied		
	var cPad = 40; //px padding on all sides of the chart
	if(win < 350){cPad = 20};
	
	//update w based on innerwidth
	if(win >= 959){w = 959}
	else if(win <= 350){w = 350}
	else if(win < 959 && win > 350){w = win}
	
	w = (w * wInset) - cPad - cPad;
	
	//Create an array	that contains the number of ups and downs in the set	
	var upDown = [];	
	//load the array with blanks
	dataSet[0].values.forEach(function(d,i){
		upDown.push({
			"series" : d.series,
			"up" : 0,
			"down" : 0,						
			})
	
		});//end array-loading forEach
	
	//show where in the array a given series can be found
	var downScaler = d3.scale.ordinal()
		.domain(upDown.map(function(d){return d.series}))
		.range(d3.range(0,upDown.length));	
	
	//iterate through the dataset and pull the highest absolute percent for color-scaling purposes
	var topPct = 0;		
	dataSet.forEach(function(d,i){
		d.values.forEach(function(d,i){
				
				var thisPct = ab(d.pctChange);
				var rawP = d.pctChange;
				if(rawP>0){
					upDown[downScaler(d.series)].up = upDown[downScaler(d.series)].up + 1;}				
				if(rawP<0){
					upDown[downScaler(d.series)].down = upDown[downScaler(d.series)].down + 1;}				
				if(thisPct > topPct){
					topPct = thisPct;
					}//close the conditional
				
			})//close the values forEach
		});//close dataSet forEach 	
	
	//This determines the opacity for each box
	var opacityRange = d3.scale.sqrt()
		.domain([0,topPct])
		.range([0.3,1.2]);	

	dataSet.forEach(function(d,i){
		d.values.forEach(function(d,i){
			d.boxOpacity = opacityRange(ab(d.pctChange));
			})		
		});	
	
	var longestSet = d3.max(dataSet,function(d,i){return d.values.length});
		//set scales based on sizes
		
	var boxWidth = d3.scale.ordinal()
		.domain(dataSet.map(function(d){return d.key}))
		.rangeBands([0,w]);

	var scaleX = d3.time.scale()
		.domain([(dataSet[0].values[0].dateObj),(dataSet[dataSet.length - 1].values[0].dateObj)])
		.range([0,w-boxWidth.rangeBand()]);

	
	var ch = (longestSet * 2) * boxWidth.rangeBand();	//height of the chart space, excluding padding

	//since Y is dependent on X, it gets set later		
	var scaleY = d3.scale.linear()
		.domain([-longestSet,longestSet])
		.range([ch,0]);

	//set up the axes
	var xAxis = d3.svg.axis()
		.scale(scaleX)
		.orient('top');
	
	var yAxis = d3.svg.axis()
		.scale(scaleY)
		.orient('left');

	//set svg and g dimensions based on sizes
	d3.select('svg').attr('width',w + cPad + cPad)
		.attr('height',ch + cPad + cPad);
	
	d3.select('g#viz')
		.attr('transform','translate(' + cPad + ',' + cPad + ')');

	//drop the recessions below everything
	var recessDraw = d3.select('g#recessions').selectAll('rect')
		.data(recess,function(d){return d.recession});	
	
	recessDraw.enter().append('rect').attr('class','recession')
		.append('title')
		.text(function(d){return d.recession});
	
	recessDraw.attr('height',ch)
		.attr('width',function(d){return scaleX(d.trough) - scaleX(d.peak)})
		.attr('x',function(d){return scaleX(d.peak)})
		.attr('y',0)
		.attr('transform','translate(' + boxWidth.rangeBand() + ',0)');
			//scoot recessions over to compensate for the fact that recessions begin the month after the peak begins
		
		
	
	//call both axes

	d3.select('g#x').call(xAxis);
	//	.attr('transform','translate(0,' + ch + ')');
	d3.select('g#y').call(yAxis);
	var unchanger = d3.select('g#y g#unch')
		.selectAll('text')
		.data(['unch']);
		
	unchanger.enter()
		.append('text');
		
	unchanger.attr('x',0)
		.attr('y',scaleY(-20))
		.text('unchg.')
		.style('text-anchor','end')
		.attr('transform','translate(-7,0)')
		.attr('class','axis')
		.attr('font-weight','light');
	
	//draw some boxes
	var boxGrouper = d3.select('g#boxes').selectAll('g')
		.data(dataSet)
		.enter()
		.append('g')
		.attr('id',function(d){return d.key});
	
	var boxDrawer = d3.selectAll('g#boxes g')
		.selectAll('rect')
		.data(function(d){return d.values});
		
	boxDrawer
		.enter()
		.append('rect')
		.append('title')
		.text(function(d){
			if(d.change < 0){			
			return d.label + ' fell ' + d.pctChange + ' in ' + d.date;}

			if(d.change > 0){			
			return d.label + ' rose ' + d.pctChange + ' in ' + d.date;}
			})//close title text
		
	var boxUpdater = boxDrawer
		.attr('height',boxWidth.rangeBand() * 0.9)
		.attr('width',boxWidth.rangeBand() * 0.9)
		.attr('x',function(d){
			return scaleX(parseDate(d.date))})
		.attr('y',function(d){return scaleY(d.rank)})
		.attr('rx',boxWidth.rangeBand() * 0.2)
		.attr('ry',boxWidth.rangeBand() * 0.2)		
		.attr('fill',function(d){return d.fill})
		.style('opacity',function(d){return d.boxOpacity})
		.attr('class',function(d){return d.series});

	boxUpdater.on('mouseover',function(d){
		var activeSector = d3.select(this).data()[0].series;
				
		d3.selectAll('g#boxes rect.' + activeSector)
			.style('opacity',1)
			.attr('stroke-width',1)
			.attr('stroke',function(d){return d.fill});
			}).on('mouseout',function(d){
		d3.selectAll('g#boxes rect')
			.style('opacity',function(d){return d.boxOpacity})
			.attr('stroke-width',0)
			}).on('click',function(d){
		var activeDate = d3.select(this).data()[0].date;
		//.attr('class');
		///boxer(dataSet,'01/01/2006',recessSet);
		rebarrer(activeDate);		
				})
				
		
	var listenerBoxes = d3.select('g#listenerBoxes')
		.selectAll('rect')
		.data(dataSet);
	
	listenerBoxes.enter()
		.append('rect')
		.attr('id',function(d){
			var thisMonth = d.values[0].date.substring(0,2);
			var thisYear = d.values[0].date.substring(6,10);
			return "d" + thisMonth + thisYear})
		.style('pointer-events','none');
	
	listenerBoxes.attr('x',function(d){return scaleX(parseDate(d.key))})
		.attr('y',0)
		.attr('height',ch)
		.style('fill','grey')
		.attr('width',boxWidth.rangeBand())
		.style('opacity',0);


///////////////////////////////////		
////////BEGIN REBARRER///////////////
///////////////////////////////////		
	
	
	function rebarrer(barDate){
		
		//light up the listenerRect with the correct ID
		
		var rebarMonth = barDate.substring(0,2);
		var rebarYear = barDate.substring(6,10);	
			
		d3.selectAll('g#listenerBoxes rect')
			.style('opacity',0)
			.attr('height',ch);
			
		d3.select('rect#d' + rebarMonth + rebarYear)
			.style('opacity',0.3)
			.attr('height',ch * 1.3);
		
		
		//Pull out the date-specific subset of data					
		var selector = d3.scale.ordinal()
			.domain(dataSet.map(function(d){return d.key}))	
			.range(d3.range(0,dataSet.length));

		var rebarSet = dataSet[selector(barDate)].values;
		
		//Add the overall up and down numbers to the subset		
		rebarSet.forEach(function(dbar,ibar){
			upDown.forEach(function(dup,iup){
				if(dbar.series == dup.series){
					dbar.up = dup.up;
					dbar.down = dup.down;
					}//close positive conditional
				})//close upDown foreach
			})//close barSet foreach
		
		//Hard-code the chart's size
		var lh = 18; //line height governs all other vertical dimensions
		var gh; //the height of each group will be determined responsively

		var boxY;
		var barY;		
		var labelY;
		var circleY;

		var boxX;
		var barX;		
		var labelX;
		var upCircleX;
		var downCircleX;
		
		var upFill = 'steelblue';
		var downFill = 'red';
		
		//Scales that are dependent on the chart's size

		var scaleRect = d3.scale.linear()
			.domain([0,d3.max(rebarSet, function(d){return d.value})]);
			
		var scaleCircle = d3.scale.sqrt()
			.domain([0,Math.max(d3.max(rebarSet,function(d){return d.up}),d3.max(rebarSet,function(d){return d.down}))]);
		var circleOpacity = d3.scale.linear()	
			.domain([0,Math.max(d3.max(rebarSet,function(d){return d.up}),d3.max(rebarSet,function(d){return d.down}))])
			.range([1,0.3])

		
		//Resize all the things that need to be responsive
		
		//MOST SIZES
		if(w>350){
		gh = lh * 4;	
		boxH = lh * 3;		
						
		boxY = lh * 0.5;
		barY = lh * 1.75;
		labelY = lh * 1.25;
		circleY = gh/2;

		boxX = lh * 1;
		barX = boxH + (lh * 1.5);
		labelX = boxH + (lh * 1.5);;
		upCircleX = w - (boxH * 2.0);
		downCircleX = w - ((boxH * 0.8));		
		
		scaleRect.range([0,upCircleX - boxX - (lh * 6)]);//five accounts for all the buffers and whatnot that we're gonna be up against
		
		scaleCircle.range([0,boxH * 0.7]);

		
			};				
		
		//MOBILE		
		if(w<=350){
		gh = (w * 0.75) - lh;
		boxH = w * 0.25;
		
		boxY = w * 0.3 - (boxH/2);
		barY = w * 0.5;
		labelY = w * 0.1;
		circleY = w * 0.3;

		boxX = lh * 1;
		barX = lh * 1;
		labelX = lh * 1;
		upCircleX = w * 0.55;
		downCircleX = w * 0.8;
		
		scaleRect.range([0,w-(lh * 2)]);

		scaleCircle.range([0,boxH * 0.6]);


			}
			
				
		
		//hardcode the X for each element based on set things
		d3.select('g#barChange')
			.attr('transform','translate(' + boxX + ',' + (boxY) + ')');	

		d3.select('g#barBoxLabels')
			.attr('transform','translate(' + (boxH * 0.5) + ',' + (boxH * 0.5) + ')');	


		d3.select('g#sectorLabels')
			.attr('transform','translate(' + labelX + ',' + (labelY) + ')');	

		d3.select('g#barSize')
			.attr('transform','translate(' + (barX) + ',' + (barY) + ')');	

		d3.select('g#barUp')
			.attr('transform','translate(' + (upCircleX) + ',' + (circleY) + ')');	

		d3.select('g#barDown')
			.attr('transform','translate(' + (downCircleX) + ',' + (circleY) + ')');	

			
		var barsH = (gh + (0.5*lh)) * (rebarSet.length + 1); //the full height of all groups put together, the plus one if for the key

		d3.select('svg')
			.attr('height', ch + cPad + cPad + barsH);
			
		var rebarGroup = d3.select('g#rebarViz')
			.attr('transform','translate(0,' + (ch + cPad) + ')');
		
		var shader = d3.select('g#shadedRect')
			.selectAll('g#shadedRect rect#shader')
			.data(['shadey']);
		
		//ADD SHADER
		shader
			.enter()
			.append('rect')
			.attr('id','shader');
		
		shader
			.attr('width',w)
			.attr('height',barsH)
			.attr('x',0)
			.attr('y',0)
			.style('fill','lightgrey')
			.style('opacity',0.8)
			.attr('rx',(0.5 * lh))
			.attr('ry',(0.5 * lh));
		

		//ADD BACKGROUND
		var barBackers = d3.select('g#rebarViz g#barBackers')
			.selectAll('rect')
			.data(rebarSet,function(d){return d.series});
		
		barBackers.enter()
			.append('rect');
		
		barBackers
			.transition()
			.duration(duration)
			.attr('y',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('x',(lh * 0.5))
//			.attr('rx',(lh * 0.5))
//			.attr('ry',(lh * 0.5))
			.attr('height',gh)
			.attr('width',w-lh)
			.style('fill','white')
			.style('opacity',1);
		
		//THE PERCENT CHANGE BOXES	
		var barBoxes = d3.select('g#rebarViz g#barBoxes')
			.selectAll('rect')
			.data(rebarSet,function(d){return d.series});
			
		barBoxes.enter()
			.append('rect');
		
		barBoxes
			.transition()
			.duration(duration)
			.attr('y',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('x',0)
			.attr('rx',(lh * 0.5))
			.attr('ry',(lh * 0.5))
			.attr('height',boxH)
			.attr('width',boxH)
			.style('fill',function(d){return d.fill})
			.style('opacity',function(d){return d.boxOpacity});

		//THE PERCENT CHANGE LABELS
		var barBoxLabels = d3.select('g#rebarViz g#barBoxLabels')
			.selectAll('text')
			.data(rebarSet,function(d){return d.series});

		barBoxLabels.enter()
			.append('text');		
		
		barBoxLabels
			.attr('y',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('x',0)
			.text(function(d){return d.pctChange})
			.attr('dy','0.4em')
			.style('text-anchor','middle')
			.style('fill','white')
			.style('font-weight','bold')
			.style('font-size', boxH * 0.35);

		
		//THE SECTOR LABELS
		var sectorLabels = d3.select('g#rebarViz g#sectorLabels')
			.selectAll('\\text')
			.data(rebarSet,function(d){return d.series});

		sectorLabels.enter()
			.append('text');		
		
		sectorLabels
			.transition()
			.duration(duration)
			.attr('y',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('x',0)
			.text(function(d){return d.label})
			.attr('class','axis')
			.style('text-anchor','beginning');

		//SECTOR SHADER RECTS	
		var barRects = d3.select('g#rebarViz g#barRectShaders')
			.selectAll('rect')
			.data(rebarSet,function(d){return d.series});
			
		barRects.enter()
			.append('rect');
		
		barRects		
			.transition()
			.duration(duration)
			.attr('y',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('x',0)
			.attr('height',boxH/2)
			.attr('width',scaleRect.range()[1])
			.style('fill','lightgrey')
			.style('opacity',function(d){return d.boxOpacity});

			
		//THE SECTOR SIZES	
		var barRects = d3.select('g#rebarViz g#barRects')
			.selectAll('rect')
			.data(rebarSet,function(d){return d.series});
			
		barRects.enter()
			.append('rect')
			.attr('width',0);
		
		barRects
			.transition()
			.duration(duration)
			.attr('y',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('x',0)
			.attr('height',boxH/2)
			.attr('width',function(d){return scaleRect(d.value)})
			.style('fill',function(d){return d.fill})
			.style('opacity',function(d){return d.boxOpacity});

		//SECTOR SIZE LABELS
		var barRectLabels = d3.select('g#rebarViz g#barRectLabels')
			.selectAll('text')
			.data(rebarSet,function(d){return d.series});

		barRectLabels.enter()
			.append('text')
			.attr('class','axis');		
		
		barRectLabels
			.attr('y',function(d,i){return ((i+1) * (gh + (0.5 * lh))) + boxH * 0.25})
			.attr('x',function(d){return scaleRect(d.value) + 5})
			.text(function(d){return d3.round(d.value/1000,1) + "m"})
			.attr('dy','0.4em')
			.attr('id',function(d){return d.series})
			.style('text-anchor','beginning');

		//hackily select only the government text and fix it
		d3.select('g#barRectLabels text#CES9000000001')
			.attr('transform','translate(-10,0)')
			.style('font-weight','bold')
			.style('fill','white')
			.style('text-anchor','end');

		//UP CIRCLES
		var upCircles = d3.select('g#rebarViz g#upCircles')
			.selectAll('circle')
			.data(rebarSet,function(d){return d.series});
			
		upCircles.enter()
			.append('circle');
		
		upCircles
			.transition()
			.duration(duration)
			.attr('cy',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('cx',0)
			.attr('r',function(d){return scaleCircle(d.up)})
//			.style('stroke',upFill)
//			.style('stroke-width','2px')
//			.style('fill','none');
			.style('fill', upFill)
			.style('opacity',0.3);//function(d){return circleOpacity(d.up)});
		
		//DOWN CIRCLES
		var downCircles = d3.select('g#rebarViz g#downCircles')
			.selectAll('circle')
			.data(rebarSet,function(d){return d.series});
			
		downCircles.enter()
			.append('circle');
		
		downCircles
			.transition()
			.duration(duration)
			.attr('cy',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('cx',0)
			.attr('r',function(d){return scaleCircle(d.down)})
//			.style('stroke',downFill)
//			.style('stroke-width','2px')
//			.style('fill','none');
			.style('fill', downFill)
			.style('opacity',0.3);//function(d){return circleOpacity(d.down)});

		//UP CIRCLE LABELS
		var upCircleLabels = d3.select('g#rebarViz g#upCircleLabels')
			.selectAll('text')
			.data(rebarSet,function(d){return d.series});

		upCircleLabels.enter()
			.append('text');		
		
		upCircleLabels
			.attr('y',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('x',0)
			.text(function(d){return d.up})
			.attr('dy','0.4em')
			.style('text-anchor','middle')
			.attr('class','axis');

		//DOWN CIRCLE LABELS
		var downCircleLabels = d3.select('g#rebarViz g#downCircleLabels')
			.selectAll('text')
			.data(rebarSet,function(d){return d.series});

		downCircleLabels.enter()
			.append('text');		
		
		downCircleLabels
			.attr('y',function(d,i){return (i+1) * (gh + (0.5 * lh))})
			.attr('x',0)
			.text(function(d){return d.down})
			.attr('dy','0.4em')
			.style('text-anchor','middle')
			.attr('class','axis');


			
		}//end rebarrer	
		
		
	//////////////////////////////
	///////CLOSE REBAR////////////
	//////////////////////////////	
		
	rebarrer(dataSet[dataSet.length -1].key);
	}//end boxer

/////////////////////////////
////DATA DEPENDENT///////////
/////////////////////////////
var payArray = [];

d3.tsv('payrollSeries.tsv',function(error,data){
	d3.tsv('recessions.csv', function(eRecession, dRecession){
	var series = data;
	var recessions = dRecession;
	var posFill = 'steelblue';
	var negFill = 'red';
	var neutralFill = 'grey';

	recessions.forEach(function(d){
		d.peak = parseDate(d.peak);
		d.trough = parseDate(d.trough);		
				})
	//key to translate the series code into a shortlabel
	var labelSeries = d3.scale.ordinal()
		.domain(series.map(function(d){return d.series}))
		.range(series.map(function(d){return d.label}));
	
	d3.tsv('payrolls.tsv',function(error1,data1){
	payrolls = data1;
	series.forEach(function(dSeries,iSeries){
		payrolls.forEach(function(dPay,iPay){
		if(iPay>0){
			var thisVal = +dPay[dSeries.series];
			var preVal = +payrolls[iPay-1][dSeries.series];
			var change = thisVal - preVal;
			var pctChange = d3.round((thisVal-preVal)/preVal * 100,2);
			payArray.push({
				"series" : dSeries.series,
				"label" : dSeries.label,//labelSeries(dSeries.series),
				"date" : (dPay['date']),
				"dateObj" : parseDate(dPay['date']),
				"value" : thisVal,
				"change" : change,
				"pctChange" : pctChange,
				

				})	//end payArray push
		} //end filter conditional			
		})//close payrolls foreach	
	})//close series foreach
	
	var payNest = d3.nest()
		.key(function(d){return d.date})
		.entries(payArray.filter(function(d,i){return d.value != 0}));

//lineup payNest as it should be

	payNest.forEach(function(d,i){

	//sort each nested value in descending order based on percentage change
		
		d.values = d.values.sort(function(a,b){return d3.descending(a.pctChange,b.pctChange)});
		
	//give each a rank based on where it sits in the heirarchy		
		var firstPos = -1;//this is the first pos, the rest will be in descending order from this one
		var zeroCount = 0;//the number of nulls in any given set
		var valLength = d.values.length;
		d.values.forEach(function(d){
			if(d.pctChange>0){
				firstPos++}//close the counter conditional	
			if(d.pctChange == 0){
				zeroCount++;
				d.rank = -18 - zeroCount;
				d.fill = neutralFill;
				}});//close another one
		d.values.forEach(function(d,i){
		
			//give the unchanges no rank		
					
			if(d.pctChange > 0){
				d.rank = ab(i-firstPos)+1;				
			d.fill = posFill;	
				}	
			if(d.pctChange < 0){
				d.rank = (-1 * (ab(i-firstPos) - (zeroCount))) + 1;//the plus one ensures there will be a zero				
				d.fill = negFill;				
				}
			})		
		
	})//close the nest sorter
var startDate = '01/01/2007';
boxer(payNest,startDate,recessions);

	var oldWin = window.innerWidth; //compares the new resize window to see if we've crossed a Rubicon
	window.addEventListener('resize',function(event){
		newWin = window.innerWidth;
		if(newWin >= oldWin + 10 || newWin <= oldWin - 10){
			//call functions if the window has been resized a lot
			boxer(payNest, startDate,recessions);
			oldWin = newWin;}		
		})//CLOSE resize event listener

		})//close payrolls.tsv		
		})//close recessions.csv
	})//close series.tsv







	
	
////////NONE OF MY BUSINESS///////

					var fm = Iframe.init(); // must be at the end of your code
	});

//	socialRiser.create();

})();

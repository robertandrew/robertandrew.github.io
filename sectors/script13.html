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
	if(win < 500){cPad = 20};
	
	//update w based on innerwidth
	if(win >= 959){w = 959}
	else if(win <= 500){w = 500}
	else if(win < 959 && win > 350){w = win}
	
	w = (w * wInset) - cPad - cPad;
	
	var topPct = 0;	
	
	dataSet.forEach(function(d,i){
		d.values.forEach(function(d,i){
				var thisPct = ab(d.pctChange);
				if(thisPct > topPct){
					topPct = thisPct;
					}//close the conditional
			})//close the values forEach
		});//close dataSet forEach 	
	
	
	//This determines the opacity for each box
	var opacityRange = d3.scale.sqrt()
		.domain([0,topPct])
		.range([0.5,1.5]);	

	dataSet.forEach(function(d,i){
		d.values.forEach(function(d,i){
			d.boxOpacity = opacityRange(ab(d.pctChange));
			})		
		});	
	
	var longestSet = d3.max(dataSet,function(d,i){return d.values.length});
		//set scales based on sizes
	var scaleX = d3.time.scale()
		.domain([(dataSet[0].values[0].dateObj),(dataSet[dataSet.length - 1].values[0].dateObj)])
		.range([0,w]);
		
	var boxWidth = d3.scale.ordinal()
		.domain(dataSet.map(function(d){return d.key}))
		.rangeBands([0,w]);
	
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
		var activeSector = d3.select(this).data()[0].series;//.attr('class');
				
		d3.selectAll('g#boxes rect.' + activeSector)
			.style('opacity',1)
			.attr('stroke-width',1)
			.attr('stroke',function(d){return d.fill});
			}).on('mouseout',function(d){
		d3.selectAll('g#boxes rect')
			.style('opacity',function(d){return d.boxOpacity})
			.attr('stroke-width',0)
			}).on('click',function(d){
		var activeDate = d3.select(this).data()[0].date;//.attr('class');
		///boxer(dataSet,'01/01/2006',recessSet);
		barrer(activeDate);		
				})
				
		
	var listenerBoxes = d3.select('g#listenerBoxes')
		.selectAll('rect')
		.data(dataSet);
	
	listenerBoxes.enter()
		.append('rect')
		.attr('id',function(d){return d.date});
	
	listenerBoxes.attr('x',function(d){return scaleX(parseDate(d.key))})
		.attr('y',0)
		.attr('height',ch)
		.attr('width',boxWidth.rangeBand())
		.attr('opacity',0);


///////////////////////////////////		
////////BEGIN BARRER///////////////
///////////////////////////////////		
	
	
	function reBarrer(barDate){
		
		}//end reBarrer	
		
	function barrer(barDate){	
		
		var selector = d3.scale.ordinal()
			.domain(dataSet.map(function(d){return d.key}))	
			.range(d3.range(0,dataSet.length));
		
		var barH = 18;
		var barOutline = 5; //pixel width of rect outlining the bar area
		var multiplier = 0.7;
		
		var barSet = dataSet[selector(barDate)].values;
		var barsH = (barH * barSet.length);
		var barLabelW = barH * 8;//a rough proxy for how long it oughta be
		var barsW = w - barH - barH; //based on enough room for labels, bars, and a token block
	
		var scaleBarX = d3.scale.linear()
			.range([0,barsW - barLabelW - (barH * 2.5)])
			.domain([0,d3.max(barSet,function(d){return ab(d.value)})]);	
				
		d3.select('svg')	
			.attr('height',ch + cPad + barH + barH + cPad + barsH  + (barOutline * 2) ) ;//need to worry about the headings for two different things
			
		d3.select('g#bars')
			.attr('transform','translate(0,' + (ch + barH + barH) + ')');
		
		d3.select('g#barViz')
			.attr('transform','translate(0,' + (barH * 1) + ')');
			
		d3.select('rect#boxBounder')
			.attr('height',barsH + (barH * 2.5))
			.attr('width',barsW + barH + barH )
			.attr('stroke-width',barOutline)
			.attr('stroke','black')
			.attr('rx',barOutline)
			.attr('ry',barOutline)
			.attr('fill','none')
			.attr('opacity',0.2);
				
		d3.select('g#barRects')
			.attr('transform','translate(' + (barLabelW + (barH * 3.5)) + ',0)'); //move them over the full width of the bar area, plus a little for the extra box
			
		d3.select('g#barBoxes')
			.attr('transform','translate(' + (barLabelW + (barH * 0.25)) + ')');
		
		
		
		//increase the size of the SVG based on the lenght of the subset
				
		var barLabels = d3.select('g#barLabels')
			.selectAll('text')
			.data(barSet,function(d){return d.series});
		
		barLabels
			.enter()
			.append('text');
			
		barLabels
			.transition()
			.duration(duration)
			.attr('y',function(d,i){
				return (i + 1) * barH}) //the +1 captures the height of the bar plus the text dy
			.attr('x',barLabelW - barOutline)
			.attr('class','axis')
			.style('font-size', barH * multiplier)
			.style('text-anchor','end')
			.attr('dy','0.8em')
			.text(function(d){return d.label});
			
		var barBoxes = d3.select('g#barBoxes')
			.selectAll('rect')
			.data(barSet,function(d){return d.series});
		
		barBoxes.enter()
		 	.append('rect');
		 	
		 barBoxes
		 	.transition()
			.duration(duration)
			.attr('x',0)
		 	.attr('y',function(d,i){return ((i + multiplier) * barH) + (barH *(  1 - multiplier) / 2)})
		 	.attr('height', barH * 0.8)
		 	.attr('width', barH * 2.8)
		 	.attr('rx', barH * 0.2)
		 	.attr('ry', barH * 0.2)
		 	.attr('fill',function(d){return d.fill})
		 	.style('opacity',function(d){return opacityRange(ab(d.pctChange)) });
	
	
		var boxLabels = d3.select('g#barBoxes')
			.selectAll('text')	
			.data(barSet,function(d){return d.series});
			
		boxLabels.enter()
			.append('text');

		boxLabels
			.transition()
			.duration(duration)
			.attr('y',function(d,i){
				return (i + 1) * barH}) //the +1 captures the height of the bar plus the text dy
			.attr('x',barH * 0.2)
			.attr('class','axis')
			.style('font-size', barH * multiplier)
			.style('font-weight','bold')
			.style('fill','white')
			.attr('dy','0.8em')
			.text(function(d){
				if(d.pctChange ==0){				
					return "  " + d.pctChange + '%'}
		
	
				if(d.pctChange <0){				
					return d.pctChange + '%'}
				if(d.pctChange>0){				
					return "+" + d.pctChange + '%'}					
				});
						 	
			
		var barRectRects = d3.select('g#barRectRects')
			.selectAll('rect')
			.data(barSet,function(d){return d.series});
			
		barRectRects.enter()
			.append('rect');
		
		barRectRects
			.transition()
			.duration(duration)
			.attr('x',0)
			.attr('y',function(d,i){return (i + 1) * barH})//the plus one captures the buffer for these bars
			.attr('height', barH * (multiplier - 0.1))
			.attr('width',0)
			.attr('fill',function(d){return d.fill})
			.attr('opacity',function(d){
				return d.boxOpacity})
			.each('end',function(d){
			d3.select(this).transition()
				.duration(duration)
				.attr('width',function(d){return scaleBarX(ab(d.value))});
			});//end each	
		
		
		
		//having drawn all else, it's time to call and stretch the tick

		function formatMillions(d){return d/1000 + 'm' };
		var barXaxis = d3.svg.axis()
			.scale(scaleBarX)
			.orient('top')
			.tickFormat(formatMillions);

		d3.select('g#barX')
			.call(barXaxis)
			.attr('transform','translate(0,' + barH + ')');
		
		d3.selectAll('g#barX .tick line')
			.attr('y1',barsH)
			.style('stroke','white')
			.style('stroke-width','2');	
			
		d3.selectAll('g#barX .tick text')
			.style('text-anchor','start');	

			
		
		if(win<450){console.log(win)};
		
		
		}//end barrer
		
	barrer('startDate');
	}//end boxer

////DATA DEPENDENT
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
				}});
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
var startDate = '12/01/2007';
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

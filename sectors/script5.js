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

function boxer(dataSet,startDate,recess){
	
	//constrict dataSet based on startDate
	startDate = parseDate(startDate);	
	dataSet = dataSet.filter(function(d){return d.values[0].dateObj >= startDate});	
	
	//constrict the recessions, but also modify the start date
	recess = recess.filter(function(d){return d.trough >= startDate});
	if(recess[0].peak <= startDate){
		recess[0].peak = startDate};
		
	console.log(recess);
	
	//set the width for the SVG based on the window's width
	var w = 0;//placeholder			
	var win = window.innerWidth;
	var wInset = 0.9; //share of the window which, at max, can be occupied		
	var cPad = 40; //px padding on all sides of the chart
	
	var posFill = 'green';
	var negFill = 'red';
	var neutralFill = 'grey';
	
	//update w based on innerwidth
	if(win >= 959){w = 959}
	else if(win <= 350){w = 350}
	else if(win < 959 && win > 350){w = win}
	
	w = (w * wInset) - cPad - cPad;

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
		.orient('bottom');
	
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

	d3.select('g#x').call(xAxis)
		.attr('transform','translate(0,' + ch + ')');
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
		
	boxDrawer
		.attr('height',boxWidth.rangeBand() * 0.9)
		.attr('width',boxWidth.rangeBand() * 0.9)
		.attr('x',function(d){
			return scaleX(parseDate(d.date))})
		.attr('y',function(d){return scaleY(d.rank)})
		.attr('rx',boxWidth.rangeBand() * 0.2)
		.attr('ry',boxWidth.rangeBand() * 0.2)		
		.attr('fill',function(d){
			if(d.rank == 'u'){return neutralFill}
			if(d.rank > 0){return posFill}	
			if(d.rank < 0){return negFill}		
			});
		
	//add a zero line
	d3.selectAll('line#zero').remove();
	d3.select('g#boxes')
		.append('line')
		.attr('id','zero')
		.attr('x1',0)
		.attr('x2',w)
		.attr('y1',scaleY(0));
	}//end boxer

////DATA DEPENDENT
var payArray = [];

d3.tsv('payrollSeries.tsv',function(error,data){
	d3.tsv('recessions.csv', function(eRecession, dRecession){
	var series = data;
	var recessions = dRecession;
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
			if(d.pctChange>0 && d.change!=0){
				firstPos++}//close the counter conditional	
			if(d.change == 0){
				zeroCount++}	
				});
		d.values.forEach(function(d,i){
		
			//give the unchanges no rank		
			if(d.change == 0){
				d.rank = "u";
//				d.fill = neutralFill;
				}
					
			if(d.change > 0){
				d.rank = ab(i-firstPos) + 1;				
///				d.fill = posFill;	
				}	
			if(d.change < 0){
				d.rank = (-1 * (ab(i-firstPos) - (zeroCount))) + 1;//the plus one ensures there will be a zero				
//				d.fill = negFill;				
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

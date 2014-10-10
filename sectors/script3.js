(function() {

	$(function() {
	
////////MY BUSINESS///////

//return the absolute value of a thing
function ab(d){
	if(d>=0){return d}
	else if(d<0){return d * -1}
	};


//takes a dataset and a startdate in mm/dd/yyyy

function boxer(dataSet,startDate){
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
	
	var scaleX = d3.scale.ordinal()
		.domain(dataSet.map(function(d){return d.key}))
		.rangePoints([0,w]);

	var boxWidth = d3.scale.ordinal()
		.domain(scaleX.domain())
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
		.text(function(d){return d.label + ' rose ' + d.change + ' in ' + d.date});
	
	boxDrawer
		.attr('height',boxWidth.rangeBand())
		.attr('width',boxWidth.rangeBand())
		.attr('x',function(d){
			return scaleX(d.date)})
		.attr('y',function(d){return scaleY(d.rank)})
		.attr('fill',function(d){
			if(d.rank == 'u'){return neutralFill}
			if(d.rank > 0){return posFill}	
			if(d.rank < 0){return negFill}		
			});
		
	//add a zero line
	d3.selectAll('rect#zero').remove();
	d3.select('g#boxes')
		.append('rect')
		.attr('id','zero')
		.attr('x',0)
		.attr('y',scaleY(0))
		.attr('width',w)
		.attr('height',1);
	}//end boxer

////DATA DEPENDENT
var payArray = [];

d3.tsv('payrollSeries.tsv',function(error,data){
	var series = data;
	
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
			var pctChange = d3.round((thisVal-preVal)/preVal * 100,3);
			payArray.push({
				"series" : dSeries.series,
				"label" : dSeries.label,//labelSeries(dSeries.series),
				"date" : dPay['date'],
				"value" : thisVal,
				"change" : change,
				"pctChange" : pctChange,
				

				})	//end payArray push
		} //end filter conditional			
		})//close payrolls foreach	
	})//close series foreach
	
	var payNest = d3.nest()
		.key(function(d){return d.date})
		.sortKeys(d3.ascending)
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
//				console.log(d.change + ' unchanged ' + d.rank);				
				}
					
			if(d.change > 0){
				d.rank = ab(i-firstPos) + 1;	
//				console.log(d.change + ' up ' + d.rank);				

				}	
			if(d.change < 0){
				d.rank = -1 * (ab(i-firstPos) - (zeroCount) -1);//the plus one ensures there will be a zero				
//				console.log(d.change + ' up ' + d.rank);				
				}
			})		
		
	})//close the nest sorter

boxer(payNest);

	var oldWin = window.innerWidth; //compares the new resize window to see if we've crossed a Rubicon
	window.addEventListener('resize',function(event){
		newWin = window.innerWidth;
		if(newWin >= oldWin + 10 || newWin <= oldWin - 10){
			//call functions if the window has been resized a lot
			boxer(payNest);
			oldWin = newWin;}		
		})//CLOSE resize event listener

		})//close payrolls.tsv		
	})//close series.tsv







	
	
////////NONE OF MY BUSINESS///////

					var fm = Iframe.init(); // must be at the end of your code
	});

//	socialRiser.create();

})();

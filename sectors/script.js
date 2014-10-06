(function() {

	$(function() {
	
////////MY BUSINESS///////


//takes a dataset and a startdate in mm/dd/yyyy

function boxer(dataSet,startDate){
	//set the width for the SVG based on the window's width
	var w = 0;//placeholder			
	var win = window.innerWidth;
	var wInset = 0.9; //share of the window which, at max, can be occupied	
	
	var cPad = 20; //px padding on all sides of the chart
	var ch = 300;	//height of the chart space, excluding padding
	
	//update w based on innerwidth
	if(win >= 959){w = 959}
	else if(win <= 350){w = 350}
	else if(win < 959 && win > 350){w = win}
	
	w = (w * wInset) - cPad - cPad;

	var longestSet = d3.max(dataSet,function(d,i){return d.values.length});
	
	//set scales based on sizes
	

	//set svg and g dimensions based on sizes
	d3.select('svg').attr('width',w + cPad + cPad)
		.attr('height',ch + cPad + cPad);
	
	d3.select('g#viz')
		.attr('transform','translate(' + cPad + ',' + cPad + ')');

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
			var pctChange = d3.round((thisVal-preVal)/preVal *100,1);
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
		d.values.forEach(function(d){
			if(d.change>0){
				firstPos++}				
			});//close the counter conditional	
		console.log(d.values[firstPos + 1].change);		
		console.log(d.values[firstPos].change);
		console.log(d.values[firstPos - 1].change);
		console.log(firstPos);	
		
	})//close the nest sorter

boxer(payNest);











//		var payrolls = data1;	
//		var unPivKeys = d3.keys(payrolls[0]);
//		console.log(unPivKeys);		
//		unPivKeys.forEach(function(dKey,iKey){
//			if(dKey!="date"){
//			series.push({
//				
//				})//close pay array push
//			})//close payrolls forEach
//			}//close date filter conditional
//		})//close series forEach
	
			
				
		})//close payrolls.tsv		
	})//close series.tsv







	
	
////////NONE OF MY BUSINESS///////

					var fm = Iframe.init(); // must be at the end of your code
	});

//	socialRiser.create();

})();

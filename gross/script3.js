(function() {

	$(function() {

		//////////////////////////////
		/////OPEN/////////////////////

		//////////////////////////////
		/////GLOBAL VARIABLES/////////
		//////////////////////////////

		//hard-coded dimensions	and other constants
		var	qChartHeight = 120, //constant
			marginTop = 30,
			marginRight = 30,
			marginBottom = 30,
			marginLeft = 30,
			betweenCharts = 30,
			wfHed = 30,
			wfBarHeight = 18, //constant
			mobileWidth = 350,
			desktopWidth = 959,						
			duration = 500; 
			
				
		//placeholders for the soft dimensions
		var	w, 
			h,
			qHeight = 	marginTop + 
						qChartHeight +
						betweenCharts,//the vertical space taken up by the quarterly chart
			wfHeight;//declared within setDimensions because it is dependent on the lenght of the dataset
		
		//placeholders/initial values for key stuff
		var liveQ = '2014Q3', //the quarter that is highlighted and draw in the waterfall
			startQ = '2000ßQ1'; //the first quarter which we'll display

		//datasets in their various forms
		var series,
			blsJSON,	
			qData = [], //empty array to hold perfectly formatted quarterly GDP data
			wfData = []; //empty array to hold formatted contribution data
				
		//
		//////WRAPPER FUNCTIONS////////////////	
		//
				
		//call everything necessary the first time the page loads
		function init(){
			filterQ();//only need to populate the quarterly dataset once, upon pageload
			filterWf();
			setDimensions();
			drawCanvas();
			drawQuarters();
			drawWaterfall();
		}

		//call only those functions necessary upon page resize
		function resize(){
			setDimensions();
			console.log('resized');
		}		

		//
		//////SPECIFIC-PURPOSE FUNCTIONS//////
		//

		//For the record, Math.abs(x); works


		////INIT-ONLY FUNCTIONS//////////
		
		//sets liveQ based on the final datapoint in the quarterly dataset		
		function getLiveQ(){
		//	return qData[qData.length-1].TimePeriod;	
		}		

		
		//lay out the SVG and its dimensions
	
		function drawCanvas(){
			var svg = d3.select('div#gdpChart')
				.append('svg')
				.attr('width',w + marginRight + marginLeft)
				.attr('height',h + marginTop + marginBottom);
				
			var qCanvas = svg.append('g').attr('id', 'qCanvas')
				.attr('transform','translate(' + marginRight + ',' + marginTop + ')');
			
			var wfCanvas = svg.append('g').attr('id', 'wfCanvas')
				.attr('transform','translate(' + marginRight + ',' + qHeight + ')');	
			
			//use a number of global variables to set vertical dimensions

		}


		////HYBRID FUNCTIONS////////////	
		
		//sets the dimensions of the canvas, with margins subtracted
		function setDimensions(){
			//first the width, which varies dynamically based on window size
			var wWidth = $(window).width();
			if(wWidth <= mobileWidth){
				w = mobileWidth - marginRight - marginLeft;		
			}
			if(wWidth > mobileWidth && wWidth < desktopWidth){
				w = wWidth - marginRight - marginLeft;
			}
			if(wWidth >= desktopWidth){
				w = desktopWidth - marginRight - marginLeft;		
			}
			//next the height, which never varies
			wfHeight = 	wfHed +
						(wfBarHeight * wfData.length) + //changes based on how many bars we want to show in the waterfall
						(wfBarHeight * 1.5) + //for the GDP bar at the bottom
						marginBottom;
			
			h = qHeight + wfHeight;
			
			console.log(h + " " + w);
		}	

		function drawQuarters(){
			d3.select('g#qCanvas')
				.append('rect')
				.attr('width',w)
				.attr('height',qHeight)
				.attr('x',0)
				.attr('y',0)
			
			/*data format
			quarter
				pctChg
				fill
			*/
		
		}

		function drawWaterfall(){
		/*data format	
		sector
			pctChg
			fill	
		*/
		
		}
		
	
		////RESIZE-ONLY FUNCTIONS
		
		
		////DATA HANDLING FUNCTIONS////////////
		
		//returns a sortable number
		function quarterToNumber(quarter){
			return (+quarter.substring(0,4) + (+quarter.substring(5,6)/10));
		
		}
		

		//fills the qData array with all the available GDP data
		function filterQ(){
			blsJSON.forEach(function(d,i){
				if(d.LineNumber=="1"){   //1 is the line number for GDP
					qData.push({
						'numDate' : quarterToNumber(d.TimePeriod),
						'date' : d.TimePeriod, //this might be deletable
						'v' : +d.DataValue //'v' will always be used for a data value
					});
				}				
			});
			
			//remove any quarters that are beyond the desired range dictated by startQ
			qData = qData.filter(function(d){return d.numDate >= quarterToNumber(startQ);}); 
			
		};		
		
			
		//fills the wfData array with waterfall data filtered based on the live quarter
		function filterWf(){
			//pull out only the current quarter
			var liveQData = blsJSON.filter(function(d){return d.TimePeriod == liveQ;});
						
			liveQData.forEach(function(dQ,iQ){
				series.forEach(function(dS,iS){
					if(dQ.LineNumber == dS.LineNumber){
						wfData.push({
							'v' : +dQ.DataValue,
							'oneWord' : dS.oneWord,
							'toolTipLabel' : dS.toolTipLabel								
						});
					}
				});			
			});

			//Pivot the data with a nest and rollup
			wfData = d3.nest()
				.rollup(function(d){
					return {
						v : d3.sum(d,function(dP){
							return dP.v;							
						}),
						oneWord : d[0].oneWord,
						toolTipLabel : d[0].toolTipLabel
					};
					
				})
				.key(function(d){return d.oneWord;})
				.entries(wfData);									
		};
		
		//LOAD THE DATA AND CALL WRAPPER FUNCTIONS
		d3.tsv('series.txt',function(error, seriesData){
			series = seriesData;
	
	
				//contributions always known as "ribs"
				d3.json('shortRibs.json',function(error, ribsData){
			
					
					//returns a subset of the raw data with numDate -- a sortable integer value		
					blsJSON = ribsData.BEAAPI.Results.Data;

					blsJSON.forEach(function(d,i){
						d.numDate = quarterToNumber(d.TimePeriod);
						});
		
									
					//Call the two wrapper functions within the data load
					init();
					$(window).resize(function(){
			
						resize();
					});
				});//finish loading JSON and executing all data-dependent functions
			});//finish loading the series ids
		
		//////CLOSE MY CALLS/////////
		/////////////////////////////	
	

					var fm = Iframe.init(); // must be at the end of your code
	});

	socialRiser.create();

})();

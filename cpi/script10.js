/*CSS plan
Main size: 959 wide
Tablet size: 650 wide
Mobile size: 350 wide

Find out what kind of listener Renee used to detect screen changes

Text elements:
HED
DEK
SUBHED
TABULAR TEXT
NUMERIC LABELS
TAB HEDS
NOTE/SOURCE

Divs/structural elements:
LINES
	TEXT CONTAINER
		SUBHED
		DEK
	SVG
		SPACE FOR LABELS TO THE RIGHT

CATEGORIES
	TEXT CONTAINER
		SUBHED
		DEK
	SVG
	

INVIDUAL ITEMS
	TEXT CONTAINER
		SUBHED
		DEK
	SVG


End CSS plan */
//////////////JS plan
//DATA STRUCTURE
//LOAD TWO DATASETS
//CATEGORIES
//Load all the datasets			
//Filter out the unwanted ones immediately
//Can perhaps do that as a function of label string length
//PRICES
//Filter out any datasets that don't extend through the present day
//SCALES
//Adds a category to all individual items
//BarWidth is shared between both categories and prices
//lineScaleX and lineScaleY works for both line charts						
//FUNCTIONS
//LINER
//Takes in a start date and a second dataset
//Filters out select set into temporary working subset
//Calculates YoY change for All Items and select dataset
//Sets the domain and range for the scales based on available sets
//Selects/resizes the SVG and calls both scales
//Empties the SVG of all current tenants
//Draws a huge rect covering the space between the earliest dataset and the clicked point		
//Draws or updates the headline line
//Draws the secondary line
//Draws labels for each on the far right-hand side
//Adds a date mouseover that highlights each line with a joined path and a circle
//Upon click, the mouseover redraws the PRICES and CATEGORIES svgs with the new startdate
//Updates the coverage of the shaded rect 
//CATTER
//Takes in a start date and a sort direction
//Creates a temporary dataset that includes the label, key and total change for each category for which the selected date is available
//Sorts set by DIRECTION
//Sets the height of the SVG based on the available number of entries
//Draws labels on top of the SVG that declare name/desc and value
//Draws labeled bars (Change and catName)
//Adds a listener rect on top of each bar that, when clicked, clears current highlights and highlights said bar
//Calls the line function with the relevant series added
//PRICER
//Takes in a start date and a sort direction
//Creates a temporary dataset
//Filters out sets that don't start early enough
//Calculates change since startDate 
//Sorts by direction
//Also includes startPrice, endPrice, item_name and description
//Selects/updates SVG with sized based on available sets
//Draws labels for item name and description
//Also start price, end price, and change since startDate
//Adds a listener rect on top of each bar that, when clicked, clears current highlights and highlights said bar
//Calls the line function with the relevant series added
////////END JS plan
//GLOBAL VARIABLES
	
	//globals for imported tsv data
	var labels;
	var areas;
	var series;
	var month;
	var prices;
	var priceSet;
	var iLabels;
	var iAreas;
	var iSeries;
	var indexes;
	
	//sizeGlobals
	var linerH = 120;
	var m = 10; //margins within svgs
	var bh = 12; //standard height for a bar
	
	//colorGlobals
	var posFill = 'steelblue';
	var negFill = 'red';
	var bgFill = 'lightgrey';

//ordinal scales for matching
	var pLabeler = d3.scale.ordinal();
	var pArear = d3.scale.ordinal();
	var pSerieser = d3.scale.ordinal();
	var monther = d3.scale.ordinal();
	var iArear = d3.scale.ordinal();
	var iSerieser = d3.scale.ordinal();

//GLOBAL FUNCTIONS

//hacky absolute value
function ab(d){
	if(d >= 0){
		return d;}
	else if(d < 0)
		return d * -1;
	}	
	
	
//LINER

function liner(startDate, secondCode) {
//Filters out select set into temporary working subset
//Calculates YoY change for All Items and select dataset
//Sets the domain and range for the scales based on available sets
//Selects/resizes the SVG and calls both scales
//Empties the SVG of all current tenants
//Draws a huge rect covering the space between the earliest dataset and the clicked point		
//Draws or updates the headline line
//Draws the secondary line
//Draws labels for each on the far right-hand side
//Adds a date mouseover that highlights each line with a joined path and a circle
//Upon click, the mouseover redraws the PRICES and CATEGORIES svgs with the new startdate
//Updates the coverage of the shaded rect 
		var cpiCode = iSerieser('SA0');
		var otherCode = iSerieser(secondCode);
		
		var cpiSet = indexes.filter(function(d){return d.series_id.trim() == cpiCode});
		var otherSet = indexes.filter(function(d){return d.series_id.trim() == secondCode});
		
		console.log(cpiSet);
		console.log(otherSet);

		//Grab the SVG and set the stage
		var thisSvg = d3.select('div#LINER div.chartContainer div#LINES svg');
		var thisW = d3.select('div#LINER div.chartContainer').style('width').substring(0, 3);
		var svgW = thisW * 0.7;//hardcodes in the 70% width for the div
		var labelW = thisW - svgW;
		var chartW = svgW - m - m;//accounts for the margins

		thisSvg.attr('width', svgW)
			.attr('height', linerH);

		var thisG = thisSvg.append('g')
			.attr('transform', 'translate(' + m + ',' + m + ')');

		thisG.append('rect').attr('width', svgW)
			.attr('height', linerH)
			.attr('x',0)
			.attr('y',0)
			.style('fill', 'grey')
			.style('opacity', 0.2);

	} //CLOSE LINER


//CATTER
function catter(startDate, sortDirection) {
		
		var thisSvg = d3.select('div#CATTER div.chartContainer svg');
		var thisW = d3.select('div#CATTER div.chartContainer').style('width').substring(0, 3);
		var thisSetLength = 22;
		
		thisSvg.attr('width', thisW + m + m)
			.attr('height', (bh * thisSetLength) + m + m);


		var thisG = thisSvg.append('g')
			.attr('transform', 'translate(' + m + ',' + m + ')');

		thisG.append('rect').attr('width', thisW)
			.attr('height', (bh * thisSetLength))
			.style('fill', 'grey')
			.style('opacity', 0.2);

	} //CLOSE CATTER


//Takes in a start date and a sort direction
//Creates a temporary dataset that includes the label, key and total change for each category for which the selected date is available
//Sorts set by DIRECTION
//Sets the height of the SVG based on the available number of entries
//Draws labels on top of the SVG that declare name/desc and value
//Draws labeled bars (Change and catName)
//Adds a listener rect on top of each bar that, when clicked, clears current highlights and highlights said bar
//Calls the line function with the relevant series added


//PRICER


function pricer(startDate, sortDirection) {

	//Produces the most recent date
	var endDate = d3.max(prices, function(d){return d.date});	
	
	//Creates a temporary dataset
	var startSet = [];	
	//Filters out start dates
	prices.forEach(function(d,i){
		if(d.date == startDate){
			startSet.push({
				'id' : d.series_id,
				'label' : pLabeler(d.series_id), 
				'quantity' : d.quantity,
				'start' : +d.value,
				})//CLOSE start push
				}//CLOSE first conditional
			})//CLOSE forEach
	
	//Creates a temporary dataset for end dates
	var endSet = []
	//Filters out end dates
	prices.forEach(function(d,i){
		if(d.date == endDate){
			endSet.push({
				'id' : d.series_id,
				'end': +d.value,				
				})//CLOSE end push			
			}//CLOSE second conditional		
		})//CLOSE forEach
	var thisSet = [];
	
	startSet.forEach(function(d,i){
		endSet.forEach(function(d1,i1){
			if(d.id == d1.id){
				thisSet.push({
					'id' : d.id,
					'label': d.label,
					'end': d1.end,
					'start': d.start,	
					'change'	: d3.round((d1.end - d.start)/d.start * 100,1) 			
					})				
				}
				
			})//CLOSE endSet forEach	
		})//CLOSE startSet forEach	
			 
	//Sorts by direction
	if(sortDirection == 'ascending'){	
		thisSet = thisSet.sort(function(a,b){
			return d3.ascending(a.change, b.change) })	
			}//end ascending conditional
	else if (sortDirection == 'descending'){
		thisSet = thisSet.sort(function(a,b){
			return d3.descending(a.change,b.change) })	
		};
	
		
	
		//Get the dimensions of the visible area
		var thisW = d3.select('div#PRICER div.chartContainer').style('width').substring(0, 3);
		var thisSetLength = thisSet.length;
		var thisH = (bh * (thisSetLength + 2));

			//Set the x scale based on the data and layout
			//There will be no y scale, as bar height is hard-coded in		
			var scaleX = d3.scale.linear()
				.domain(d3.extent(thisSet, function(d){return d.change}))
				.range([0,thisW/2 - 30]);//20 is hardcoded end padding for the SVG
		 
		
		//label the columns for each category
			//Item,StartPrice,EndPrice,Change since XXXX	
		
		
			//Nicely rearrange the text in the date object from YYYY.MM to Month YYYY
			var startLabel = monther((startDate + "").substring(5,7)) 
				+ " " + (startDate + "").substring(0,4);
			var endLabel = monther((endDate + "").substring(5,7)) 
				+ " " + (endDate + "").substring(0,4);			

			//Dataset that provides the basis for each columngroup and feeds an ordinal scale					
			//Hard-code each column's width based on div width, allow them to float 
			var columnLabels = [{"label" : "Item", 
										"ident" : "label",
										"width" : thisW / 4,},
										{"label" : startLabel + " price",
										"ident" : "start",
										"width" : thisW / 8,},
										{"label" : endLabel + " price",
										"ident" : "end",
										"width" : thisW / 8,},
										{"label" : "Change since " + startLabel,
										"ident" : "change",
										"width" : thisW / 2,}];
		
		
		//Set regular widths for each column, starting at zero and ending at w/2
			//all text will be left-aligned			
			var scaleColumnWidth = d3.scale.ordinal()
				.domain(columnLabels.map(function(d){return d.ident}))
				.range(columnLabels.map(function(d){return d.width}));
			
		//grab the label div and add in the labels.			
			
			var columnLabels = d3.select('div#PRICER div.chartContainer div.row#LABELS').selectAll('div.cell',function(d){return d.ident})
				.data(columnLabels,function(d){return d.ident});
				
			var columnLabelEnter = columnLabels.enter()
				.append('div');
				
			var columnLabelUpdate = columnLabels.attr('class','cell')
				.attr('id', function(d,i){return d.ident})
				.style('width',function(d){
					return d.width - 6})//hard-coding in an inner padding of 3
				.style('padding',3);
			columnLabels.selectAll('span')
				.data(function(d){
					return d.label})	
				.enter()
				.append('span')			
					.text(function(d){
						return d})
					.style('font-weight','bold');//use a style to set this one attribute without putting the text in a completely different class				

		
		//each item of thisSet gets its own div		
			//Each div will have sub-divs of set width, one of which contains an SVG
		var columnCells = d3.select('div#PRICER div.chartContainer div.column#CELLS')
			.selectAll('div',function(d){return d.id})
			.data(thisSet,function(d){return d.id})
		
		var columnCellEnter = columnCells.enter()
			.append('div');
		
		var columnCellUpdate = columnCells.attr('class','rows')
			.attr('id',function(d){return d.id})
			.style('height',bh*3);
	
		//clear all previous divs within each row
			//there must be a more elegant way to do it, but I can't puzzle it out
		columnCells.selectAll('div')
			.remove()

		//add in each div manually, so that they can be customized		
			//First, the labels			
			columnCells.append('div')
				.attr('class','cell')
				.style('width',scaleColumnWidth('label'))
				.append('span')			
				.text(function(d){
					return d.label;				
					});						
					
			//Next, the start price
			columnCells.append('div')
				.attr('class','cell')
				.style('width',scaleColumnWidth('start'))
				.append('span')			
				.text(function(d){
					return "$" + d3.round(d.start,2);				
					});						

			//Next, the end price
			columnCells.append('div')
				.attr('class','cell')
				.style('width',scaleColumnWidth('end'))
				.append('span')			
				.text(function(d){
					return "$" + d3.round(d.end,2);				
					});						


			//Next, the change
			var changeDiv = columnCells.append('div')
				.attr('class','cell')
				.style('width',scaleColumnWidth('change'))

				
			var changeSvg = changeDiv.append('svg')
				.attr('height',bh)
				.attr('width',scaleColumnWidth('change') + 30);//20 is the hard-coded padding for the SVG
			
			changeSvg.append('rect')
				.attr('height',bh)
				.attr('width',scaleColumnWidth('change') + 30)
				.style('fill',bgFill)
				.attr('opacity',0.2);
			
			changeSvg.append('rect')
				.attr('height',bh)
				.attr('width',function(d){
						return scaleX(ab(d.change)) - scaleX(0);})
				.attr('x',function(d){
					if(d.change >= 0){
						return scaleX(0);						
						}
					else if(d.change < 0)
						return 0;
					})
				.attr('y',0)
				.attr('fill',function(d){
					if(d.change >= 0){
						return posFill;						
						}
					else if(d.change < 0)
						return negFill;	
					});

			//add a zero line
			changeSvg.append('rect')
				.attr('height',bh)
				.attr('width',1)
				.attr('x',function(d){
					return scaleX(0);					
					})
				.attr('y',0)
				.attr('fill',0);
				
			changeSvg.append('text')
				.attr('x',function(d){
					if(d.change >= 0){					
						return scaleX(d.change) + 3}
					else if(d.change < 0){
						return scaleX(0) + 3}
					})
				.attr('y',0)
				.attr('dy','1em')			
				.text(function(d){
					//Give it the right plus, minus or otherwise sign
					if(d.change <= 0){
						return d3.round(d.change,1) + "%";}
					else if(d.change > 0){
						return "+" + d3.round(d.change,1) + "%";					
						}				
					})
				.style('font-weight','bold');		
			
			
								
			
			
						

	} //CLOSE PRICER



//Takes in a start date and a sort direction
//Selects/updates SVG with sized based on available sets
//Draws labels for item name and description
//Also start price, end price, and change since startDate
//Adds a listener rect on top of each bar that, when clicked, clears current highlights and highlights said bar
//Calls the line function with the relevant series added

//Minor functions
function callAll() {
	d3.selectAll('svg rect').remove(); //TEMP line to clean up on resize
	liner(2004.02,'SA0L1E');
	
	//For now, I'll always call pricer first because it tends to be more volatile and can thus set the global domain	
	pricer(2004.02,'descending');
	catter();
}

////
//LOADING DATA AND THE FUNCTIONS WHICH DEPEND ON IT
////


//Load the index data
d3.tsv('indexItems.tsv', function(iError, iData) {
	d3.tsv('indexArea.tsv', function(iError1, iData1) {
		d3.tsv('indexSeries.tsv', function(iError2, iData2) {
			d3.tsv('indexValues.tsv', function(iError4, iData4) {				
				//Load the price data
				d3.tsv('priceItems.tsv', function(error, data) {
					d3.tsv('priceArea.tsv', function(error1, data1) {
						d3.tsv('priceSeries.tsv', function(error2, data2) {
							d3.tsv('pricePeriods.tsv', function(error3, data3) {
								d3.tsv('priceValues.tsv', function(error4, data4) {
									data4.forEach(function(d,i){
										//create a numeric date object with a goofy ad hoc numbering system
										//YYYY.MM
										d.date = +(d.year + '.' + d.period.substring(1,3));							
										})	
									iData4.forEach(function(d,i){
										//YYYY.MM
										d.date = +(d.year + '.' + d.period.substring(1,3));																
										}) //end ad hoc numbering
				
									//SET ALL DOMAINS/RANGES
									
									pLabeler.domain(data.map(function(d) {
											return d.item_code
										}))
										.range(data.map(function(d) {
											if(d.description == 'undefined'){
												return d.item_name}
											else if(d.description != 'undefined'){
												return d.item_name + ' (' + d.description + ')'}
										}));
				
									pArear.domain(data2.map(function(d) {
											return d.series_id
										}))
										.range(data2.map(function(d) {
											return d.area_code
										}));
									
									iArear.domain(iData2.map(function(d) {
											return d.series_id
										}))
											.range(iData2.map(function(d){ 
											return d.area_code
										}))				
				
									pSerieser.domain(data2.map(function(d) {
											return d.series_id
										}))
										.range(data2.map(function(d) {
											return d.item_code
										}));
				
									iSerieser.domain(iData2.map(function(d){
											return d.series_id
										}))				
										.range(iData2.map(function(d){return d.itemCode}));									
										
									monther.domain(data3.map(function(d) {
											return d.period
										}))
										.range(data3.map(function(d) {
											return d.period_name
										}));
				
									//STORE ALL VALUES							
									labels = data;
									areas = data1;
									series = data2;
									month = data3;	
									//Only get nationwide price data				
									prices = data4.filter(function(d){
										return pArear(d.series_id) == "0000"});
									
									//STORE ALL INDEX VALUES
									iLabels = iData;
									iAreas = iData1;
									iSeries = iData2;
									//Only get nationwide index data
									indexes = iData4.filter(function(d){
										return iArear(d.series_id) == "0000"});
													
									//CALL ALL FUNCTIONS
									callAll();
				
									//DO THE SAME WHEN RESIZE IS DETECTED
									window.onresize = callAll;
				
				
								}); //close prices.tsv
							}); //close month.tsv
				
						}); //close series.tsv
					}); //close areas.tsv
				}); //close labels.tsv

				}); //close index prices.tsv
		}); //close index series.tsv
	}); //close index areas.tsv
}); //close index labels.tsv

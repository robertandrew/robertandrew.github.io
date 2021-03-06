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
	
	//sizeGlobals
	var linerH = 120;
	var m = 10; //margins within svgs
	var bh = 12; //standard height for a bar

//ordinal scales for matching
	var labeler = d3.scale.ordinal();
	var arear = d3.scale.ordinal();
	var serieser = d3.scale.ordinal();
	var monther = d3.scale.ordinal();
	var monthLabeler = d3.scale.ordinal();
//GLOBAL FUNCTIONS

//LINER

function liner(startDate, secondSet) {

		//Grab the SVG and set the stage
		var thisSvg = d3.select('div#LINER div.chartContainer svg');
		var thisW = d3.select('div#LINER div.chartContainer').style('width').substring(0, 3);

		thisSvg.attr('width', thisW + m + m)
			.attr('height', linerH + m + m);

		var thisG = thisSvg.append('g')
			.attr('transform', 'translate(' + m + ',' + m + ')');

		thisG.append('rect').attr('width', thisW)
			.attr('height', linerH)
			.style('fill', 'grey')
			.style('opacity', 0.2);

	} //CLOSE LINER

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
				'label' : labeler(d.series_id), 
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
	
		
	
		//Lay out the visible area
		var thisSvg = d3.select('div#PRICER div.chartContainer svg');
		var thisW = d3.select('div#PRICER div.chartContainer').style('width').substring(0, 3);
		var thisSetLength = 42;
		var thisH = (bh * (thisSetLength + 2))	//extra two accounts for labeling space at the top of the SVG	
		
		thisSvg.attr('width', thisW + m + m)
			.attr('height', thisH + m + m);

		var thisG = thisSvg.append('g')
			.attr('transform', 'translate(' + m + ',' + m + ')');

		thisG.append('rect').attr('width', thisW)
			.attr('height', (bh * thisSetLength))
			.style('fill', 'grey')
			.style('opacity', 0.2);
		
		//Set the x scale based on the data and layout
			//There will be no y scale, as bar height is hard-coded in		
		var scaleX = d3.scale.linear()
			.domain(d3.extent(thisSet, function(d){return d.change}))
			.range([0,thisW/2]);
		 
		
		//label the columns for each category
			//Item,StartPrice,EndPrice,Change since XXXX	
		
		//Set regular widths for each column, starting at zero and ending at w/2
			//all text will be left-aligned
		
		var columnLabels = [{"Item", startYear + " price" , endYear + " price" , "Change in price since " + startYear}]
		\fgh;		
		var scaleColumns = d3.scale.ordinal()
			.domain()
				
		



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
	liner();
	
	//For now, I'll always call pricer first because it tends to be more volatile and can thus set the global domain	
	pricer(2004.02,'descending');
	catter();
}

////
//LOADING DATA AND THE FUNCTIONS WHICH DEPEND ON IT
////

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

					//SET ALL DOMAINS/RANGES
					
					labeler.domain(data.map(function(d) {
							return d.item_code
						}))
						.range(data.map(function(d) {
							if(d.description == 'undefined'){
								return d.item_name}
							else if(d.description != 'undefined'){
								return d.item_name + ' (' + d.description + ')'}
						}));

					arear.domain(data2.map(function(d) {
							return d.series_id
						}))
						.range(data2.map(function(d) {
							return d.area_code
						}));

					serieser.domain(data2.map(function(d) {
							return d.series_id
						}))
						.range(data2.map(function(d) {
							return d.item_code
						}));

					monther.domain(data3.map(function(d) {
							return d.period
						}))
						.range(data3.map(function(d) {
							return d.period_name
						}));

					//STORE ALL VALUES							
					labels = data;
					areas = data1;
					series = data2;//.filter(function(d){return d.area_code == "0000"});
					month = data3;					
					prices = data4.filter(function(d){
						return arear(d.series_id) == "0000"});
					


					//CALL ALL FUNCTIONS
					callAll();

					//DO THE SAME WHEN RESIZE IS DETECTED
					window.onresize = callAll;


				}); //close prices.tsv
			}); //close month.tsv

		}); //close series.tsv
	}); //close areas.tsv
}); //close labels.tsv

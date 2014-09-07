
//globals
var labels;
var areas;
var series;
var month;
var prices;

//ordinal scales for matching
var labeler = d3.scale.ordinal();
var arear = d3.scale.ordinal();
var serieser = d3.scale.ordinal();
var monther = d3.scale.ordinal();

		//data dependent
		
		
		d3.tsv('priceItems.tsv',function(error,data){
			d3.tsv('priceArea.tsv',function(error1,data1){
				d3.tsv('priceSeries.tsv',function(error2,data2){
					d3.tsv('pricePeriods.tsv',function(error3,data3){
						d3.tsv('priceValues.tsv',function(error4,data4){
						
						//SET ALL DOMAINS/RANGES
						
						labeler.domain(data.map(function(d){return d.item_code}))
							.range(data.map(function(d){return d.item_name + '(' + d.item_description + ')'}));
							
						arear.domain(data1.map(function(d){return d.area_code}))
							.range(data1.map(function(d){return d.area_name}));
						
						serieser.domain(data2.map(function(d){return d.series_id}))
							.range(data2.map(function(d){return d.item_code}));
						
						monther.domain(data3.map(function(d){return d.period}))
							.range(data3.map(function(d){return d.period_name}));
						
						//STORE ALL VALUES							
						labels=data;
						areas=data1;
						series=data2;
						month=data3;
						prices=data4;
						
						
							
							
						});//close prices.tsv
					});//close month.tsv
					
				});//close series.tsv
			});//close areas.tsv
		});//close labels.tsv

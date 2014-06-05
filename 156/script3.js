//declare some global variables
var porter;

//declare all the functions
var parseDate = d3.time.format('%Y').parse;

function grouper(){
	var stage = d3.select('body').append('g');

	stage.selectAll('div').data(porter)
		.enter()
		.insert('div')
		.attr('id',function(d){return d.key})
		.attr('class','column')	
		.append('p')	
		.html(function(d){return "<h3>" + d.values.filter(function(d){return d.tier == "one"}).length + " decent " +  d.key + " graphics" + "</h3>"})
		.attr('id','category');
	
	d3.selectAll('p#category')	
		.on('click',function(d){
//			if(d3.select(this).attr('class') == 'listOn'){
				d3.select(this).attr('class','listOff')
				console.log(d3.select(this).data())

				var tipBox = d3.select(this).append('g')
					.attr('id','tipBox' + d.key)
					.attr('class','listItem');
				
				var expandedText = tipBox.append('ul').selectAll('li')
					.data(function(d){return d.values
						.filter(function(d){return d.tier == "one"})})
					.enter()
					.append('li')
					.attr('class','listItem')
					.html(function(d,i){return "" + ' <a href="' + d.url +'">' + d.label + " [" + d.date + " on " + d.ran + "]</a>"});
				
				
				
				tipBox.append('tspan')
					.html('<br>...and some other stuff')
						.attr('id','stuffer')
					.on('click',function(d){
							d3.selectAll('#stuffer')
								.remove();
						
						
						var filtered = d.values
						.filter(function(d){return d.tier != "one"})
						console.log(filtered)
						var extraBox = d3.select(this).append('g')
							.attr('id','extraBox' + d.key)
							.attr('class','listItem');
						
						var moreText = extraBox.selectAll('tspan')
							.data(filtered)
							.enter()
							.append('tspan')
							.attr('class','listItem')
							.html(function(d,i){return "<br>" + ' <a href="' + d.url +'">' + d.label + " [" + d.date + " on " + d.ran + "]</a>"});
							});
					})	
						
//			else {
//				d3.select(this).attr('class','listOn')
//				d3.selectAll('g#tipBox' + d.key).remove();
//			};	
						
	
//		});
		
	
	};

function abouter() {d3.select('div#about')
	.on('click',function(d){
		if(d3.select(this).attr('class') == 'column'){
			d3.select(this).attr('class','column')
		var aboutBox = d3.select(this).append('g').attr('id','about')
			.append('div');
		
		aboutBox.append('p')
			.attr('class','listItem')
			.text("I'm Andrew. I'm from Idaho, I live in New York, and I make graphics for newspapers. Reach me at andrewvandam at gmail.com");		
			}
		else {
			d3.select(this).attr('class','listOn')
			d3.selectAll('g#about').remove()
			}
		});
	};

//begin the data-dependent stuff
d3.tsv('port.tsv', function(error,data) {
	data.forEach(function(d){
	//	d.date = parseDate(d.date);	
	});
	porter = data;

	porter = d3.nest()
		.key(function(d){return d.type})
		.entries(porter);

abouter();
grouper();

});

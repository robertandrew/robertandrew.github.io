//set global variables
var duration = 2000;
var lett;
var lettLength;

//declare scales

var colorize = d3.scale.category20();
//	.range(['red','orange','green','blue','purple','black']);	

var scaleText = d3.scale.sqrt();

//global functions
function keyer(){
	var buttoner = d3.select('div.key')
		.attr('width','100%')
		.selectAll('div')	
		.data(lett)
		.enter()
		.append('div')
		.attr('class','buttOn')
		.style('background-color',function(d){return colorize(d.key)});
	
	buttoner.text(function(d){return d.key});
	
	buttoner.on('click',function(d){
		var buttStatus = d3.select(this).attr('class');
		
		if(buttStatus == 'buttOn'){
			d3.select(this).attr('class','buttOff');
			d3.select('div#' + d.key)
				.attr('class','hiddenColumn');
			}
		else{
			d3.select(this).attr('class','buttOn');		
			d3.select('div#' + d.key)
				.attr('class','column');	
			}
		});
	}


function letterer(){
	
	var letterHeight = window.innerWidth/lettLength;
	console.log(letterHeight);
	var columnWidth = 100/lettLength;
	scaleText.range([0,(letterHeight)]);
	
	var letterColumn = d3.select('div.viz')
	//	.append('g')
		.selectAll('div')
		.data(lett)
		.enter()
		.append('div')
		.attr('class','column')
		.style('width',columnWidth + "%")
		.attr('id',function(d){return d.key});
		
	letterColumn.append('div').text(function(d){return d.key})
		.style('color',function(d){return colorize(d.key)})
		.attr('class','label');
	letterColumn.append('g')
		.selectAll('p')
		.data(function(d){return d.values})
		.enter()
		.append('p')
		.attr('class','letters')
		.text(function(d){return d.letter})
		.style('line-height',function(d){ return  0.5 * (-1 * scaleText(d.frequency) + scaleText(letterHeight)) + "px"})
		.style('font-size',function(d){return scaleText(d.frequency) + 'px'})
		.style('color',function(d){return colorize(d.language)});
	 
	};

//DATA DEPENDENT
//load the tsv
d3.tsv('alphabets/languages.tsv',function(error,data){
	data.forEach(function(d){
		d.frequency = +d.frequency;
			});		
	lett = data;
	lett = d3.nest()
		.key(function(d){return d.language})
		.entries(lett);
	
	lettLength = lett.length;
		
		
	//set all the domains
	colorize.domain(lett.map(function(d){return d.key}));
	scaleText
		.domain([0,d3.max(data,function(d){return d.frequency;})]);	

		
	//call functions	
	keyer();
	letterer();

});

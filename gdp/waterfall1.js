//set global variables
var delay = 3;
var detail;
var items;
var dates = [];
var chartSize = 100;
var labels = 60;
var cPad = 30;
var startDate = "Q2_2009";

var colors = d3.scale.category10();

var colorize = d3.scale.ordinal()
	.range(['red','orange','green','blue','purple','black'])
	.domain([6,7,8,9,0,1]);	

var w = (labels * -1) + window.innerWidth - cPad *2;
var h = (window.innerHeight * 0.8) - cPad * 2;

//declare scales and axes

var wRange = [0,w];

var scaleX = d3.scale.linear()
	.range(wRange);
	
var barPoints = d3.scale.ordinal()
	.rangePoints([0,h]);
	
var barHeight = d3.scale.ordinal()
	.rangeBands([0,h],0);
	
var xAxis = d3.svg.axis()
	.orient('top')
	.scale(scaleX);

var piv = [];
var valueSet;
var keySet;
var tempest;

//set up the furniture
var svg = d3.select('div.viz').append('svg')
	.attr('width',w + cPad + cPad + labels)
	.attr('height',h + cPad + cPad);
	
var visCon = svg.append('g')
	.attr('transform','translate(' + cPad + ',' + cPad + ')');
	
var labelCon = visCon.append('g');

var barCon = visCon.append('g')
	.attr('transform','translate(' + labels + ',0)')
	.append('g').attr('id','barCon');
	
var xAxisSpot = barCon.append('g')
	.attr('class','axis')
	.attr('id','x')
	.call(xAxis);

//global functions
function ab(d){
	if(d>=0){return d}
	else if(d<0){return d * -1}
	};

function keys(){ 
	
	var keyData = 6;

	keyBox = d3.select('div#key')
		.selectAll('refgffkct');
		
	};//CLOSE keys
	

function bars(dater){
	
	var neg = "red";
	var pos = "steelblue";	
	
	var temper = piv.filter(function(d){return d.date == dater && d.id != "gdp"});
	
	var gdp = piv.filter(function(d){return d.date == dater && d.id == "gdp"});
	
	var temper = d3.nest()
		.rollup(function(d){
			return {
				value:d3.sum(d,function(g){return g.value}),
				label:d[0].label,
				};
				})//close rollup
		.key(function(d){return d.id})
		.entries(temper);	
		
	temper = temper.sort(function(a,b){
		return d3.ascending(a.values.value,b.values.value)});	
	
	//set domains
	//set max and min for x so we can set a domain
	
	var minx = 0;
	var maxx = 0;	
	
	temper.forEach(function(d,i){
		var chex = d.values.value;
		if (chex<0){minx = minx + chex};
		if (chex>0){maxx = maxx + chex};		
		})	
	
	if(maxx + minx <= 0){maxx = 0}
	else if(maxx + minx > 0){
		maxx = maxx + minx};
	
	var xExtent = ([minx,maxx]);
	scaleX.domain(xExtent);
	barPoints.domain(temper.map(function(d){return d.key}));
	barHeight.domain(temper.map(function(d){return d.key}));
	
		
	xAxisSpot.call(xAxis);
	//Add xPos and width to everything in temper	
	var stagger = 0;
	temper.forEach(function(d,i){
		d.w = scaleX(d.values.value) - scaleX(0);
		d.yPos = barPoints(d.key);
		d.stagger = stagger;
		stagger = stagger + ab(d.w);
		
		if(i==0){d.xPos = scaleX(0) + d.w;
			if(d.w <= 0){d.fill = neg}
			else if(d.w > 0){d.fill = pos}}
		else if(i != 0 && temper[i-1].w <= 0 && d.w <= 0){
			d.fill = neg;
			d.xPos = +temper[i-1].xPos + d.w;
			}//end negative if		
		else if(i != 0 && temper[i-1].w <= 0 && d.w > 0){
			d.fill = pos;
			d.xPos = +temper[i-1].xPos;
			}//end mixed if		
		else if(i != 0 && temper[i-1].w > 0 && d.w > 0){
			d.fill = pos;
			d.xPos = +temper[i-1].xPos + temper[i-1].w; 			
			}//end positive if
		;//end conditionals
		});//close temper foreach	
	tempest = temper;
	
	var textDrop = labelCon.selectAll('text')
		.data(temper)
		.enter()
		.append('text')
		.attr('x',labels)//function(g){return d.xPos + d.w + 10})
		.attr('y',function(d){return d.yPos})
		.text(function(d){return d.key})
		.attr('class','dek')
		.attr('text-anchor',"end")
		.attr('dy','0em')
		.style('font-size',barHeight.rangeBand() - 1)
		.attr('transform','translate(-4,' + (barHeight.rangeBand() - 1) + ')')
		.style('opacity',0)
		.attr('id',function(d){return d.key});
		
	
	var barData = barCon.selectAll('rect',function(d){return d.key})
		.data(temper,function(d){return d.key});
	
	var barEnter = barData.enter().append('rect');
	
	barEnter.attr('x',function(d){return d.xPos})
		.attr('y',function(d){return d.yPos})
		.attr('height',barHeight.rangeBand())
		.attr('width',0)
		.attr('fill',function(d){return d.fill});
	
	var barExit = barData.exit()
		.transition()
		.duration(1000)
		.attr('opacity',0)
		.remove();	
	
	var grower = barCon.selectAll('rect',function(d){return d.key})
		.transition()
		.delay(function(d,i){return d.stagger * delay})
		
		.duration(function(d){return ab(d.w) * delay;})
		.attr('x',function(d){return d.xPos})
		.attr('y',function(d){return d.yPos})
		.attr('height',barHeight.rangeBand())
		.attr('fill',function(d){return d.fill})
		.attr('width',function(d){
			return ab(d.w)})
		.each('end',function(d){
			stagger = stagger + ab(d.w) * delay;
			labelCon.select('text#' + d.key)
				.transition()
				.duration(200)
				.attr('y',d.yPos)
				.style('opacity',1)
								
			});
		
	
	
			
	
	};//CLOSE bars


//DATA DEPENDENT
d3.tsv('contribDetailFlub.csv',function(error,data){
	
	keySet = data.filter(function(d,i){return d.date == "dummy"});
	
	valueSet = data.filter(function(d,i){return d.date != "dummy"});
	var setLength = valueSet.length;
	
	valueSet.forEach(function(d,i){
			dates.push({
				"y" : d.date.substring(3,7),
				"q" : d.date.substring(0,2),
				'date' : d.date
				});//closedatepush
			d3.range(1,setLength-1).forEach(function(d2,i2){
				var dumbId = "d" + d2;
				if(keySet[0][dumbId] != "exclude"){
					piv.push({"date":d.date,
								"id": keySet[0][dumbId],
								"label": keySet[2][dumbId],
								"value": +d[dumbId]})				
					}//close conditional
				})//close forEach
			});//close valueSet forEach
	bars(startDate);
	keys();
	});//CLOSE contribs	

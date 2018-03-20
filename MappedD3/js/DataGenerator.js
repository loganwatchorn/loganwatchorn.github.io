//***************************************************************************
// Energy Consumption

var jsonEC = (
	function() {
        var jsonEC = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/MappedD3/data/Energy-Consumption.json",
            'dataType': "json",
            'success': function (data) {
                jsonEC = data;
            }
        });
        return jsonEC;
    })();

function countryEC(CountryName) {
	for(var i = 0; i < jsonEC.length; ++i)
	{
  		if(jsonEC[i]["Million tonnes oil equivalent"] == CountryName)
  		{
   			return jsonEC[i];
  		}
	}
}

//***************************************************************************
// Fertility Rate

var jsonFR = (
	function() {
        var jsonFR = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/MappedD3/data/Fertility-Rate.json",
            'dataType': "json",
            'success': function (data) {
                jsonFR = data;
            }
        });
        return jsonFR;
    })();

function countryFR(CountryCode) {
	for(var i = 0; i < jsonFR.length; ++i)
	{
  		if(jsonFR[i]["Country Code"] == CountryCode)
  		{
   			return jsonFR[i];
  		}
	}
}

//***************************************************************************
//GDP

var jsonGDP = (
	function() {
        var jsonGDP = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/MappedD3/data/GDP.json",
            'dataType': "json",
            'success': function (data) {
                jsonGDP = data;
            }
        });
        return jsonGDP;
    })();

function countryGDP(CountryCode) {
	for(var i = 0; i < jsonGDP.length; ++i)
	{
  		if(jsonGDP[i]["Country Code"] == CountryCode)
  		{
   			return jsonGDP[i];
  		}
	}
}

//***************************************************************************
// Human Development Index

var jsonHDI = (
	function() {
        var jsonHDI = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/MappedD3/data/HDI.json",
            'dataType': "json",
            'success': function (data) {
                jsonHDI = data;
            }
        });
        return jsonHDI;
    })();

function countryHDI(CountryName) {
	for(var i = 0; i < jsonHDI.length; ++i)
	{
  		if(jsonHDI[i].Country == CountryName)
  		{
   			return jsonHDI[i];
  		}
	}
}

//***************************************************************************
// Life expectancy at birth

var jsonLEaB = (
	function() {
        var jsonLEaB = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/MappedD3/data/Life-Expectancy-at-Birth.json",
            'dataType': "json",
            'success': function (data) {
                jsonLEaB = data;
            }
        });
        return jsonLEaB;
    })();

function countryLEaB(CountryCode) {
	for(var i = 0; i < jsonLEaB.length; ++i)
	{
  		if(jsonLEaB[i]["Country Code"] == CountryCode)
  		{
   			return jsonLEaB[i];
  		}
	}
}

//***************************************************************************
// Population

/* How to do it with arrays instead of json
var jsonPop = d3.json("data/Population.json", function(data) {
  console.log(data[0]);
});

*/

var jsonPop = (
	function() {
        var jsonPop = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/MappedD3/data/Population.json",
            'dataType': "json",
            'success': function (data) {
                jsonPop = data;
            }
        });
        return jsonPop;
    })();


function countryPop(CountryCode) {
	for(var i = 0; i < jsonPop.length; ++i)
	{
  		if(jsonPop[i]["Country Code"] == CountryCode)
  		{
   			return jsonPop[i];
  		}
	}
}

//***************************************************************************
//***************************************************************************
//***************************************************************************
//***************************************************************************
//***************************************************************************

domain = {

	lowerbound:
	{
		Pop : 1960,
		GDP: 1960,
		EC: 1965,
		LEaB: 1960,
		FR: 1960,
		HDI: 1990
	},

	upperbound:
	{
		Pop : 2013,
		GDP: 2016,
		EC: 2016,
		LEaB: 2013,
		FR: 2013,
		HDI: 2015
	}
}

//***************************************************************************
//***************************************************************************
//***************************************************************************
//***************************************************************************
//***************************************************************************

function newPackage() {

	dataContainer = document.getElementById("DataContainer");
	var lastPackage = document.getElementById("dataPackage");
	if(
	    !!lastPackage
	){
	    dataContainer.removeChild(lastPackage);
	}
	var newDiv = document.createElement("div");
	dataContainer.appendChild(newDiv);
	newDiv.id = "dataPackage";

}

//***************************************************************************
//***************************************************************************
//***************************************************************************
//***************************************************************************
//***************************************************************************

function countryDescription(name, code) {

	dataContainer = document.getElementById("DataContainer");
	var lastPackage = document.getElementById("dataPackage");
	if(
	    !!lastPackage
	){
	    dataContainer.removeChild(lastPackage);
	}
	var newDiv = document.createElement("div");
	dataContainer.appendChild(newDiv);
	newDiv.id = "dataPackage";

	var string1 = name;
	var string2 =
		"Population: "
		+countryPop(code)[+domain.upperbound.Pop];
	var string3 =
		"2016 GDP: $"
		+countryGDP(code)[+domain.upperbound.GDP]
		+" USD";
	var string4 =
		"Energy consumption: "
		+countryEC(name)[+domain.upperbound.EC]
		+" million barrels of oil";
	var string5 =
		"Fertility rate: "
		+countryFR(code)[+domain.upperbound.FR]
		+" children per woman";
	var string6 =
		"Human Development Index: "
		+countryHDI(name)[+domain.upperbound.HDI];
	var string7 =
		"Life expectancy at birth: "
		+countryLEaB(code)[+domain.upperbound.LEaB]
		+" years";

	var text1=document.createTextNode(string1);
	var text2=document.createTextNode(string2);
	var text3=document.createTextNode(string3);
	var text4=document.createTextNode(string4);
	var text5=document.createTextNode(string5);
	var text6=document.createTextNode(string6);
	var text7=document.createTextNode(string7);

	var tab1=document.createElement("div");
	var tab2=document.createElement("div");
	var tab3=document.createElement("div");
	var tab4=document.createElement("div");
	var tab5=document.createElement("div");
	var tab6=document.createElement("div");
	var tab7=document.createElement("div");

	tab1.classList.add("datafieldtitle");
	tab2.classList.add("datafield");
	tab3.classList.add("datafield");
	tab4.classList.add("datafield");
	tab5.classList.add("datafield");
	tab6.classList.add("datafield");
	tab7.classList.add("datafield");

	tab1.appendChild(text1);
	tab2.appendChild(text2);
	tab3.appendChild(text3);
	tab4.appendChild(text4);
	tab5.appendChild(text5);
	tab6.appendChild(text6);
	tab7.appendChild(text7);

	newDiv.appendChild(tab1);
	newDiv.appendChild(tab2);
	newDiv.appendChild(tab3);
	newDiv.appendChild(tab4);
	newDiv.appendChild(tab5);
	newDiv.appendChild(tab6);
	newDiv.appendChild(tab7);

}

//***************************************************************************
//***************************************************************************
//***************************************************************************
//***************************************************************************
//***************************************************************************
/*
function regPlot(dataset, datasetName) {

	newPackage();

	var svg = d3.select("svg");
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var graph_width = svg.attr("width") - margin.left - margin.right;
    var graph_height = svg.attr("height") - margin.top - margin.bottom;

    graph = svg
    	.append("graph")
    	.attr("transform", "translate("+margin.left+","+margin.top+")");

    var x = d3
    	.scaleLinear()
	    .rangeRound([0, width]);

	var y = d3
		.scaleLinear()
	    .rangeRound([height, 0]);

	var line = d3.line()
	    .x( function(dataset){ return x(dataset.date); } )
	    .y( function(dataset){ return y(dataset.close); } );



	// Plot dots, lines?
	for ( 
		var i = domain.lowerbound.datasetName ;
		i <= domain.upperbound.datasetName ; 
		++i
	){
		d3
		.json(
			dataset,
			function(d) {
				d.date = ;
				d.close = +d.close;
				return d;
			},

			function(error, d) {
				
				if (error) throw error;

				x.domain(
					d3.extent(
						d,
						function(d) {
							return j;
						}
					)
				);

			  	y.domain(
			  		d3.extent(
			  			d,
			  			function(d) {
			  				return d.close;
			  			}
			  		)
			  	);

			  	g
			  	.append("g")
		     	.attr("transform", "translate(0," + height + ")")
		     	.call(d3.axisBottom(x))
		    	.select(".domain")
		     	.remove();

			 	g
			 	.append("g")
		     	.call(d3.axisLeft(y))
		    	.append("text")
		      	.attr("fill", "#000")
		      	.attr("transform", "rotate(-90)")
		      	.attr("y", 6)
		      	.attr("dy", "0.71em")
		      	.attr("text-anchor", "end")
		      	.text("Price ($)");

			  	g
			  	.append("path")
		      	.datum(d)
		      	.attr("fill", "none")
		      	.attr("stroke", "steelblue")
		      	.attr("stroke-linejoin", "round")
		      	.attr("stroke-linecap", "round")
		      	.attr("stroke-width", 1.5)
		      	.attr("d", line);
			}
}); */
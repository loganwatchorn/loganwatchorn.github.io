// MapGenerator.js is based of the work at
// https://bl.ocks.org/andybarefoot/765c937c8599ef540e1e0b394ca89dc5
//
// MapGenerator.js creates a .svg political map of Earth using .json data
//
// Copyright (C) 2018  Logan Watchorn
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
//


// DEFINE VARIABLES
// Define size of map group
// Full world map is 2:1 ratio
// Using 12:5 because we will crop top and bottom of map
w = 3000;
h = 1650;

// variables for catching min and max zoom factors
var minZoom;
var maxZoom;

// Define map projection
var projection = d3
    .geoMercator()
    .center([0, 30]) // set centre to further North
    .scale([w/(2*Math.PI)]) // scale to fit group width
    .translate([w/2,h/2]) // ensure centred in group
;

// Define map path (really long address integer)
var path = d3
    .geoPath()
    .projection(projection)
;

// apply zoom to countriesGroup
function zoomed() {
    t = d3.event.transform;
    countriesGroup
    .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
}

// Define map zoom behaviour
var zoom = d3.zoom().on("zoom", zoomed);

function getTextBox(selection) {
    selection
    .each(function(d){
            d.bbox = this.getBBox();
        });
}

function initiateZoom(){
    // Define a "min zoom"
    minZoom = Math
    .max(
        $("#MapContainer").width()/w,
        $("#MapContainer").height()/h);
    // Define a "max zoom" 
    maxZoom = 20*minZoom;
    //apply these limits of 
    zoom
        .scaleExtent([minZoom, maxZoom]) // set min/max extent of zoom
        .translateExtent([[0, 0], [w, h]]) // set extent of panning
    ;
    // define X and Y offset for centre of map
    midX = ($("#MapContainer").width() - (minZoom*w))/2;
    midY = ($("#MapContainer").height() - (minZoom*h))/2;
    // change zoom transform to min zoom and centre offsets
    svg
        .call(zoom.transform,d3.zoomIdentity
        .translate(midX, midY)
        .scale(minZoom));
}

// zoom to show a bounding box, with optional additional padding as percentage
// of box size
function boxZoom(box, centroid, paddingPerc) {
    minXY = box[0];
    maxXY = box[1];
    // find size of map area defined
    zoomWidth = Math.abs(minXY[0] - maxXY[0]);
    zoomHeight = Math.abs(minXY[1] - maxXY[1]);
    // find midpoint of map area defined
    zoomMidX = centroid[0];
    zoomMidY = centroid[1];
    // increase map area to include padding
    zoomWidth = zoomWidth * (1 + paddingPerc / 100);
    zoomHeight = zoomHeight * (1 + paddingPerc / 100);
    // find scale required for area to fill svg
    maxXscale = $("svg").width() / zoomWidth;
    maxYscale = $("svg").height() / zoomHeight;
    zoomScale = Math.min(maxXscale, maxYscale);
    // handle some edge cases
    // limit to max zoom (handles tiny countries)
    zoomScale = Math.min(zoomScale, maxZoom);
    // limit to min zoom (handles large countries and countries that span the
    // date line)
    zoomScale = Math.max(zoomScale, minZoom);
    // Find screen pixel equivalent once scaled
    offsetX = zoomScale * zoomMidX;
    offsetY = zoomScale * zoomMidY;
    // Find offset to centre, making sure no gap at left or top of holder
    dleft = Math.min(0, $("svg").width() / 2 - offsetX);
    dtop = Math.min(0, $("svg").height() / 2 - offsetY);
    // Make sure no gap at bottom or right of holder
    dleft = Math.max($("svg").width() - w * zoomScale, dleft);
    dtop = Math.max($("svg").height() - h * zoomScale, dtop);
    // set zoom
    svg
    .transition()
    .duration(500)
    .call(
        zoom
        .transform,
        d3
        .zoomIdentity
        .translate(dleft, dtop)
        .scale(zoomScale)
    );
}



// on window resize
$(window).resize(function() {
   // Resize SVG
    svg
    .attr( "width", $("#MapContainer").width() )
    .attr( "height", $("#MapContainer").height() );
    initiateZoom();
});

// Drawing the map
var svg = d3
    .select("#MapContainer")
    .append("svg")
    // set to the same size as the "map" div
    .attr( "width", $("#MapContainer").width() )
    .attr( "height", $("#MapContainer").height() )
    // add zoom functionality
    .call(zoom)
;

// get map data
d3.json(
    "/Peacemap/js/libs/geo.json",
    function(json) {

        countriesGroup = svg
            .append("g")
            .attr("id", "map");

        // add a background rectangle
        countriesGroup
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h);

        // draw a path for each feature/country
        countries = countriesGroup
            .selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr(
                "id", 
                function(d, i) {
                    return "country" + d.properties.iso_a3;
                })
            .attr("class", "country")
            // add a mouseover action to show name label for feature/country
            .on("mouseover", 
                function(d, i) {
                    if(
                        !d3
                        .select(this)
                        .classed("country_clicked")
                    ){
                        d3
                        .select("#countryLabel" + d.properties.iso_a3)
                        .style("display", "block");
                        d3
                        .select(this)
                        .classed("country_moused", true);
                    }
                }
            )
            // uncolor the country when the mouse leaves
            .on("mouseout",
                function(d, i) {
                    if(
                        !d3
                        .select(this)
                        .classed("country_clicked")
                    ){
                        d3
                        .select("#countryLabel" + d.properties.iso_a3)
                        .style("display", "none");
                    }
                    d3
                    .select(this)
                    .classed("country_moused", false);
                }
            )
            // add an onclick action to colorize a country
            .on("click",
                function(d, i) {
                    var bool = d3
                        .select(this)
                        .classed("country_clicked");
                    d3
                    .selectAll(".country")
                    .classed("country_clicked", false);
                    d3
                    .select(this)
                    .classed("country_clicked", !bool);
                    if(!bool){
                        d3
                        .selectAll(".countryLabel")
                        .style("display", "none");
                        d3
                        .select("#countryLabel" + d.properties.iso_a3)
                        .style("display", "block");
                    }

                    countryDescription(
                        d.properties.name_long,
                        d.properties.iso_a3);

                }
            );

        countryLabels = countriesGroup
            .selectAll("g")
            .data(json.features)
            .enter()
            .append("g")
            .attr("class", "countryLabel")
            .attr(
                "id",
                function(d) {
                    return "countryLabel" + d.properties.iso_a3;
                }
            )
            .attr(
                "transform",
                function(d) {
                    return (
                        "translate(" 
                        +path.centroid(d)[0] 
                        +"," 
                        +path.centroid(d)[1] 
                        +")"
                    );
                }
            )
            .on("mouseover",
                function(d, i) {
                    if(
                        !d3
                        .select("#country" + d.properties.iso_a3)
                        .classed("country_clicked")
                    ){
                        d3
                        .select(this)
                        .style("display", "block");
                        d3
                        .select("#country" + d.properties.iso_a3)
                        .classed("country_moused", true);
                    }
                }
            )
            .on("mouseout",
                function(d, i) {
                    if(
                        !d3
                        .select("#country" + d.properties.iso_a3)
                        .classed("country_clicked")
                    ){
                        d3
                        .select(this)
                        .classed("country_moused", false);
                        d3
                        .select(this)
                        .style("display", "none");
                    }
                    d3
                    .select("#country" + d.properties.iso_a3)
                    .classed("country_moused", false);
                }
            )
            .on("click",
                function(d, i) {
                    var bool = d3
                        .select("#country" + d.properties.iso_a3)
                        .classed("country_clicked");
                    d3
                    .selectAll(".country")
                    .classed("country_clicked", false);
                    d3
                    .selectAll(".countryLabel")
                    .style("display","none");
                    if(!bool){
                        d3
                        .select(this)
                        .style("display","block");
                        d3
                        .select("#country" + d.properties.iso_a3)
                        .classed("country_clicked", true);
                    }

                    countryDescription(d.properties.name, d.properties.iso_a3);
                }
            );


        // add the text to the label group showing country name
        countryLabels
            .append("text")
            .attr("class", "countryName")
            .style("text-anchor", "middle")
            .attr("dx", 0)
            .attr("dy", 0)
            .text(
                function(d){
                    return d.properties.name;
                }
            )
            .call(getTextBox);


        // add a background rectangle the same size as the text
        countryLabels
            .insert("rect", "text")
            .attr("class", "countryLabelBg")
            .attr("transform",
                function(d) {
                    return "translate(" + (d.bbox.x - 2) + "," + d.bbox.y + ")";
                }
            )
            .attr("width",
                function(d) {
                    return d.bbox.width + 4;
                }
            )
            .attr("height",
                function(d) {
                    return d.bbox.height;
                }
            )
            .attr("rx", 4)
            .attr("ry", 4)
        ;

        initiateZoom();

  }
);
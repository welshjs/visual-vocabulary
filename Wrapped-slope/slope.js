function slopeChart(data,stylename,media,plotpadding,legAlign,yHighlight, startZero, showDots, showLabels, showValues){

	//graph options
    var lineSmoothing="monotone";//choose 'linear' for an unsmoothed line
    var logScale=false;
    var logScaleStart=1000;
    var titleYoffset = d3.select("#"+media+"Title").node().getBBox().height
    var subtitleYoffset=d3.select("#"+media+"Subtitle").node().getBBox().height


    // return the series names from the first row of the spreadsheet
    var seriesNames = Object.keys(data[0]).filter(function(d){ return d != 'date'; });

    //Select the plot space in the frame from which to take measurements
    var frame=d3.select("#"+media+"chart")
    var plot=d3.select("#"+media+"plot")
    
    //Get the width,height and the marginins unique to this plot
    var w=plot.node().getBBox().width;
    var h=plot.node().getBBox().height;
    var margin=plotpadding.filter(function(d){
        return (d.name === media);
      });
    margin=margin[0].margin[0]
    var colours=stylename.linecolours;
    
    //workout dimensions of data
        var maxVal = Math.max(d3.max(data, function(d){return parseFloat(d.val1);}),d3.max(data, function(d){return parseFloat(d.val2);}));
        var minVal = Math.min(d3.min(data, function(d){return parseFloat(d.val1);}),d3.min(data, function(d){return parseFloat(d.val2);}));

    //anchor to zero if needed
    if (startZero==true){
        minVal = Math.min(minVal,0);   
    }

    //create scale for y axis
    var yScale = d3.scale.linear()
        .domain([minVal,maxVal])
        .range([h,0])

    //axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(5)
        .tickSize(w)

    plot.append("g")
        .attr("class",media+"yAxis") 
        .call(yAxis);


    
}
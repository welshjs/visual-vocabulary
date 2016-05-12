
function makeChart(data, stylename, media, chartpadding,legend, yAlign,yHighlight){

    var titleYoffset = d3.select("#"+media+"Title").node().getBBox().height
    var subtitleYoffset=d3.select("#"+media+"Subtitle").node().getBBox().height;

    // return the series names from the first row of the spreadsheet
    var seriesNames = Object.keys(data[0]).filter(function(d){ return d != 'date'; });
    //Select the plot space in the frame from which to take measurements
    var frame=d3.select("#"+media+"chart")
    var plot=d3.select("#"+media+"plot")

    var yOffset=d3.select("#"+media+"Subtitle").style("font-size");
    yOffset=Number(yOffset.replace(/[^\d.-]/g, ''));
    
    //Get the width,height and the marginins unique to this chart
    var w=plot.node().getBBox().width;
    var h=plot.node().getBBox().height;
    var margin=chartpadding.filter(function(d){
        return (d.name === media);
      });
    margin=margin[0].margin[0]
    var colours=stylename.linecolours;
    var plotWidth = w-(margin.left+margin.right);
    var plotHeight = h-(margin.top+margin.bottom);
    
    // console.log(plotWidth,colours,plotHeight,data)
    // console.log(margin)
    //you now have a chart area, inner margin data and colour palette - with titles pre-rendered

    var yScale = d3.scale.linear()
        .range([plotHeight, 0]);

    var groups = d3.keys(data[0]).filter(function(key) {
        return key !== "group";
    })


    var xScale0 = d3.scale.ordinal()
    .rangeRoundBands([0, plotWidth], 0, .3);

    var xScale1 = d3.scale.ordinal();

    var xAxis = d3.svg.axis()
    .scale(xScale0)
    .orient("bottom");
     data.forEach(function(d) {
        //first calculate the starting height for each group
        total = 0
        totals = {}
        for (var i=0; i<groups.length; i++) {
          if (i == 3) {
            total = total - +d[groups[i]];
            totals[groups[i]] = total;
          }
          else {
            totals[groups[i]] = total;
            total += +d[groups[i]];
          }
        }
        //then map category name, value, and starting height to each observation
        d.formatted = groups.map(function(group) {
          return {
            name: group,
            value: +d[group],
            baseHeight: +totals[group]
          };
        });
      });

    xScale0.domain(data.map(function(d) { return d.group; }));
    xScale1.domain(groups).rangeRoundBands([0, xScale0.rangeBand()]);
    yScale.domain([0, d3.max(data, function(d) {
        return d3.max(d.formatted, function(d) {
            return d.value + d.baseHeight;
        });
    })]);


    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient(yAlign);

    var yLabel=plot.append("g")
      .attr("class", media+"yAxis")
      .call(yAxis);

    //calculate what the ticksize should be now that the text for the labels has been drawn
    var yLabelOffset=yLabel.node().getBBox().width
    var yticksize=colculateTicksize(yAlign, yLabelOffset);

    yLabel.call(yAxis.tickSize(yticksize))
    yLabel
        .attr("transform",function(){
            if (yAlign=="right"){
                return "translate("+(margin.left)+","+margin.top+")"
            }
            else return "translate("+(w-margin.right)+","+margin.top+")"
            })

    //identify 0 line if there is one
    var originValue = 0;
    var origin = plot.selectAll(".tick").filter(function(d, i) {
            return d==originValue || d==yHighlight;
        })
    .classed(media+"origin",true);

    var xLabel=plot.append("g")
      .attr("class", media+"xAxis")
      .attr("transform",function(){
                return "translate("+(margin.left)+","+plotHeight+")"
            })
      .call(xAxis);








    function colculateTicksize(align, offset) {
        if (align=="right") {
            return w-margin.left-offset
        }
        else {return w-margin.right-offset}
    }

}
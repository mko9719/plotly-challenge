function initiate(){
    var cellData = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        data.names.forEach((names) => {
            cellData.append("option")
            .text(names)
            .property("values")
        });
        // call first Element
        optionChanged(data.names[0])
    });
};

function optionChanged(newData){
    sampleMetadata(newData)
    plotData(newData);
}
initiate();
function sampleMetadata(newData){
    d3.json("samples.json").then((data) => {
        var met = data.metadata
        var filterMet = met.filter(meta => meta.id == newData);
        var firstResult = filterMet[0]
        console.log(firstResult);
        var infoData = d3.select("#sample-metadata");
        infoData.html("");
        Object.entries(firstResult).forEach(([key, value]) => {
            var row = infoData.append("p")
            row.text(`${key}:${value}`)



        })

    });
}
function plotData(newData){
    d3.json("samples.json").then((data) => {
        var sampleData = data.samples
        var results = sampleData.filter(ids => ids.id == newData)
        var firstSample = results[0]
        console.log(firstSample)
        // Get Properties
        var topTenID = firstSample.otu_ids.map(id => `OTU_ID ${id}`).slice(0,10).reverse();
        var topSamplesValue = firstSample.sample_values.slice(0,10).reverse();
        var topLabels = firstSample.otu_labels.slice(0,10).reverse();
        // create trace 1 for bar chart
        var TraceOne = {
            x: topSamplesValue,
            y: topTenID,
            text: topLabels,
            name: "OTU",
            type: "bar",
            orientation:"h"
        }
        var BarData = [TraceOne];
        var layout = {title: "TopTenOTU", autosize:false, width:400, height:500, margin: {
            l: -50,//left margin
            r: -50,//right margin
            b: -100,//bottom margin
            t: -100//top margin}
        }};
Plotly.newPlot("bar", BarData, layout)
// Trace for Bubble Chart
var TraceTwo = {
    x: firstSample.otu_ids,
    y: firstSample.sample_values,
    text: firstSample.otu_labels,
    mode: "markers", 
      marker: {
          color:  firstSample.otu_ids,
          size:firstSample.sample_values
      }

};
var layout_bubble = {
    xaxis:{title:"Top 10 OTU IDs"},
    height: 500, 
    width: 700,
    margin: {
      l: -50,
      r: -1,
      b: -40,
      t: -40
     // pad:5
  } 
    };
    //capture the data and create the plot
var bubbleData = [TraceTwo];
Plotly.newPlot("bubble", bubbleData, bubbleLayout);
})};


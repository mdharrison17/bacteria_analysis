function init() {
  var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

      buildCharts('940');
      buildMetadata('940')
  })}
  
  init();

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
            
      Object.entries(result).forEach(([key, value]) =>
      {PANEL.append("h6").text(key + ': ' + value);});
    });
  }
  function buildCharts(sample){
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var barResultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var sortedBacteria = barResultArray.sort((a,b) => a.sample_values - b.sample_values);
      
      var topTenBacteriaVal = sortedBacteria[0].sample_values.slice(0,10);
      var topTenBacteriaId =  sortedBacteria[0].otu_ids.slice(0,10);
      var otu_labels =  sortedBacteria[0].otu_labels.slice(0,10);
      // barchart 
      var trace = {
              x: topTenBacteriaVal,
              y: topTenBacteriaId,
              type: "bar",
              orientation: "h",
              text: otu_labels,
              hoverinfo: otu_labels,
              marker: {
                color: 'rgb(142,124,195)'}
            };
      
            var layout = {
              title: `Top 10 Bacteria for ${sample}`,
              yaxis: {type: 'category'}
            };
      
            Plotly.newPlot("plot", [trace], layout); 

      //create bubble chart
      otuIdSample = barResultArray[0].otu_ids;
      sampleValueSample = barResultArray[0].sample_values;
      otuLabelSample = barResultArray[0].otu_labels;

      var trace1 = {
        x: otuIdSample,
        y: sampleValueSample,
        mode: 'markers',
        text: otuLabelSample,
        marker: {
          size: sampleValueSample,
          color: otuIdSample
        }
      };
      var data = [trace1];
      
      var layout = {
        title: `Bacteria for ${sample}`
      };
      
      Plotly.newPlot('bubble', data, layout);

      //guage chart
      d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var washResult = resultArray[0].wfreq;
        console.log(washResult);

          
      }) ;
          }) ;
      
    }
    



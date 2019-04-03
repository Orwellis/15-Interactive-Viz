function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      panel.append("h6").text(`${key}:${value}`);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {

    const otu_ids = data.otu_ids
    const sample_values = data.sample_values
    const otu_lables = data.otu_lables
    
    // @TODO: Build a Bubble Chart using the sample data
    var bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values, 
      },
      text: otu_lables
    };
    
    var bubble_data = [bubble_trace];

    var bubble_layout = {
      title: 'Belly Button Biodiversity',
      showlegend: false,
      height: 600,
      width: 600,
      margin: {t: 0}
    };

    Plotly.plot("bubble", bubble_data, bubble_layout)

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie_trace = {
      type: "pie",
      values: sample_values.slice(0, 10),
      labels: otu_lables.slice(0, 10)
    }

    var pie_data = [pie_trace];

    var pie_layout = {
      margin: {t: 0, l: 0}
    }

    Plotly.plot("pie", pie_data, pie_layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

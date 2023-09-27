// Creating the map object
let myMap = L.map("map", {
  center: [27.96044, -82.30695],
  zoom: 7
});
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
let geoData="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


//call the api with d3 to get the data.
//call the api with d3 to get the data.
d3.json(geoData).then(function(data){
  //create a leaflet layer group
  let earthquake = L.layerGroup();
  
  //loop through the features in the data
  data.features.forEach(function(feature) {
    //get the coordinates of the earthquake
    let coordinates = feature.geometry.coordinates;
    let lat = coordinates[1];
    let lng = coordinates[0];
    let depth = coordinates[2];
    
    //get the magnitude of the earthquake
    let magnitude = feature.properties.mag;
    
    //create a circle marker for the earthquake
    let marker = L.circleMarker([lat, lng], {
      radius: magnitude * 3,
      color: '#000',
      weight: 1,
      fillColor: getColor(depth),
      fillOpacity: 0.7
    });
    
    //add a popup to the marker with information about the earthquake
    marker.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
      <strong>Magnitude:</strong> ${magnitude}<br>
      <strong>Depth:</strong> ${depth} km`);
    
    //add the marker to the layer group
    marker.addTo(earthquake);
  });
  
  //add the layer group to the map
  earthquake.addTo(myMap);

  //function to get the color based on the depth range
function getColor(d) {
  return d > 90 ? '#800090' :
         d > 70 ? '#BD0020' :
         d > 50 ? '#E31A1C' :
         d > 30 ? '#FC4E2A' :
         d > 10 ? '#FD8D3C' :
         d > -10 ? '#FFEDA0' :
         '#FFFFCC';
}

//create a legend control
let legend = L.control({position: 'bottomright'});

//add the legend to the map

legend.onAdd = function () {
  let div = L.DomUtil.create('div', 'info legend'),
      depths = [-10, 10, 30, 50, 70, 90],
      labels = [];

  // loop through our depth intervals and generate a coloured labels 
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+') + '<br>';
  }

  return div;
};

legend.addTo(myMap);

});
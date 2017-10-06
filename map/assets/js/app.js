var map, featureList, artifactsSearch = [], documentsSearch = [], photographicimagesSearch = [], printedworksSearch = [];

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on("mouseover", ".feature-row", function(e) {
  highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});

$(document).on("mouseout", ".feature-row", clearHighlight);
 
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(featureList.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through theaters layer and add only features which are in the map bounds */
  artifacts.eachLayer(function (layer) {
    if (map.hasLayer(artifactsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/artifacts-15.svg"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through museums layer and add only features which are in the map bounds */
  documents.eachLayer(function (layer) {
    if (map.hasLayer(documentsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/documents-15.svg"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  photographicimages.eachLayer(function (layer) {
    if (map.hasLayer(photographicimagesLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/photographicimages-15.svg"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

   printedworks.eachLayer(function (layer) {
    if (map.hasLayer(printedworksLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/printedworks-15.svg"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

/*   tradecards.eachLayer(function (layer) {
    if (map.hasLayer(tradecardsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/tradecards-15.svg"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });*/

  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */


var North_Star = L.tileLayer("https://api.mapbox.com/styles/v1/judaicadh/cj48ntjlr1xgp2spt7d0nzz9y/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVkYWljYWRoIiwiYSI6ImNpdm8xM25uaTAxZGgyeXA3MWs0a3l5YngifQ.8g6WnfX6e-gz3tp6LR1zfQ",{
  attribution:'© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
});

var Toner = L.tileLayer("https://tile.stamen.com/toner/{z}/{x}/{y}.png",{
  maxZoom: 19,
  attribution: '"Map tiles by <a href="https://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>."'
});
 Terrain = L.tileLayer("https://tile.stamen.com/terrain/{z}/{x}/{y}.jpg",{
  maxZoom: 19,
  attribution: '"Map tiles by <a href="https://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>."'
});
var Watercolor = L.tileLayer("https://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",{
  maxZoom: 19,
  attribution: '"Map tiles by <a href="https://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>."'
});
var Satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var us1859 = L.tileLayer("https://maps.georeferencer.com/georeferences/46827090911/2017-06-26T11:43:17.994838Z/map/{z}/{x}/{y}.svg?key=hmpAOeUBKMlwNo4fmiyl", {
  maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'});


var us1880 = L.tileLayer("http://maps.georeferencer.com/georeferences/769587602490/2017-06-16T16:11:55.286870Z/map/{z}/{x}/{y}.svg?key=hmpAOeUBKMlwNo4fmiyl", {
  maxZoom: 19,
  attribution: '<a href="http://davidrumsey.georeferencer.com/maps/400938382023">Map Showing Geographical Divisions of the U.S. Geological Survey, 1880 by Clarence King, Created with the David Rumsey Georeferencer</a>'});



/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};



/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: false,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var artifactsLayer = L.geoJson(null);
var artifacts = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/artifacts-15.svg",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
     var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" +  "<tr><th>People/Businesses Affliated</th><td>" + feature.properties.merger + "</td></tr>" + "<tr><th>Location</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.date + "</td></tr>" + "<tr><th>Sub Genre</th><td>" + feature.properties.genre_subl + "</td></tr><table>";      
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
   $("#feature-table tbody").append('<tr style="cursor: pointer;" onclick="sidebarClick('+L.stamp(layer)+'); return false;"><td class="feature-name">'+layer.feature.properties.name+'<i class="fa fa-chevron-right pull-right"></td></tr>');      
   artifactsSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.address,
        merger: layer.feature.properties.merger,
        genre: layer.feature.properties.genre_subl,
        source: "artifacts",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/artifacts.geojson", function (data) {
  artifacts.addData(data);
  map.addLayer(artifactsLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove museums to markerClusters layer */
var documentsLayer = L.geoJson(null);
var documents = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/documents-15.svg",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>People/Businesses Affliated</th><td>" + feature.properties.merger + "</td></tr>" + "<tr><th>Location</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.date + "</td></tr>" + "<tr><th>Sub Genre</th><td>" + feature.properties.genre_subl + "</td></tr><table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/documents-15.svg"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      documentsSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.address,
        merger: layer.feature.properties.merger,
        genre: layer.feature.properties.genre_subl,
        source: "documents",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/documents.geojson", function (data) {
  documents.addData(data);
  map.addLayer(documentsLayer);
});


var photographicimagesLayer = L.geoJson(null);
var photographicimages = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/photographicimages-15.svg",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>People/Businesses Affliated</th><td>" + feature.properties.merger + "</td></tr>" + "<tr><th>Location</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.date + "</td></tr>" + "<tr><th>Sub Genre</th><td>" + feature.properties.genre_subl + "</td></tr><table>";      
layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/photographicimages-15.svg"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      photographicimagesSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.address,
        merger: layer.feature.properties.merger,
        genre: layer.feature.properties.genre_subl,
        source: "photographicimages",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/photographicimages.geojson", function (data) {
  photographicimages.addData(data);
  map.addLayer(photographicimagesLayer);
});

var printedworksLayer = L.geoJson(null);
var printedworks = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/printedworks-15.svg",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>People/Businesses Affliated</th><td>" + feature.properties.merger + "</td></tr>" + "<tr><th>Location</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.date + "</td></tr>" + "<tr><th>Sub Genre</th><td>" + feature.properties.genre_subl + "</td></tr><table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/printedworks-15.svg"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      printedworksSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.address,
        merger: layer.feature.properties.merger,
        genre: layer.feature.properties.genre_subl,
        source: "printedworks",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/printedworks.geojson", function (data) {
  printedworks.addData(data);
  map.addLayer(printedworksLayer);
});

/*var tradecardsLayer = L.geoJson(null);
var tradecards = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/tradecards-15.svg",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
    var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>People/Businesses Affliated</th><td>" + feature.properties.merger + "</td></tr>" + "<tr><th>Location</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.date + "</td></tr>" + "<tr><th>Sub Genre</th><td>" + feature.properties.genre_subl + "</td></tr>" + "<tr><th>Image (if available)</th><td><a class='url-break' href='" + feature.properties.homepage + "' target='_blank'>" + feature.properties.homepage + "</a></td></tr>" + "<tr><th>BA Page</th><td><a class='url-break' href='" + feature.properties.beersadvocatepage + "' target='_blank'>" + feature.properties.beersadvocatepage + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/tradecards-15.svg"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      tradecardsSearch.push({
        name: layer.feature.properties.name,
        address: layer.feature.properties.address,
        source: "tradecards",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/tradecards.geojson", function (data) {
  tradecards.addData(data);
  map.addLayer(tradecardsLayer);
});*/
var baseLayers = {
 Toner: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}),

Terrain: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png'
}),
Watercolor: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 1,
  maxZoom: 16,
  ext: 'png'
}),
 
Satellite : L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
})
};


map = L.map("map", {
  zoom: 3,
  center: [35.82, -49.57],
  layers: [North_Star, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false,
   fullscreenControl: true
});


/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === artifactsLayer) {
    markerClusters.addLayer(artifacts);
  }
});
map.on("overlayremove", function(e) {
  if (e.layer === artifactsLayer) {
    markerClusters.removeLayer(artifacts);
  }
});


map.on("overlayadd", function(e) {
  if (e.layer === documentsLayer) {
    markerClusters.addLayer(documents);
  }
});
map.on("overlayremove", function(e) {
  if (e.layer === documentsLayer) {
    markerClusters.removeLayer(documents);
  }
});

map.on("overlayadd", function(e) {
  if (e.layer === photographicimagesLayer) {
    markerClusters.addLayer(photographicimages);
  }
});
map.on("overlayremove", function(e) {
  if (e.layer === photographicimagesLayer) {
    markerClusters.removeLayer(photographicimages);
  }
});

map.on("overlayadd", function(e) {
  if (e.layer === printedworksLayer) {
    markerClusters.addLayer(printedworks);
  }
});
map.on("overlayremove", function(e) {
  if (e.layer === printedworksLayer) {
    markerClusters.removeLayer(printedworks);
  }
});
/*
map.on("overlayadd", function(e) {
  if (e.layer === tradecardsLayer) {
    markerClusters.addLayer(tradecards);
  }
});
map.on("overlayremove", function(e) {
  if (e.layer === tradecardsLayer) {
    markerClusters.removeLayer(tradecards);
  }
});*/


map.on("moveend", function (e) {
  syncSidebar();
});


 

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by <a href='https://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomHome = L.Control.zoomHome({position: "topleft"}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "topleft" }).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = false;
} else {
  var isCollapsed = true;
}


var baseLayersCopy = {


 North_Star : L.tileLayer("https://api.mapbox.com/styles/v1/judaicadh/cj48ntjlr1xgp2spt7d0nzz9y/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVkYWljYWRoIiwiYSI6ImNpdm8xM25uaTAxZGgyeXA3MWs0a3l5YngifQ.8g6WnfX6e-gz3tp6LR1zfQ",{
  attribution:'© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
}),

  Toner: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}),

Terrain: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png'
}),
 Watercolor: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 1,
  maxZoom: 16,
  ext: 'png'
}),
 
Satellite : L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
})};
 
var groupedOverlays = {
"Historic Maps": {
  "US 1859": us1859,
  "US 1880": us1880
},
  "Points of Interest": {
    "<img src='assets/img/artifacts-15.svg' width='28' height='28'>&nbsp;Artifacts": artifactsLayer, 
   "<img src='assets/img/documents-15.svg' width='28' height='28'>&nbsp;Documents": documentsLayer,
   "<img src='assets/img/photographicimages-15.svg' width='28' height='28'>&nbsp;Photographic Images": photographicimagesLayer, 
   "<img src='assets/img/printedworks-15.svg' width='28' height='28'>&nbsp;Printed Works": printedworksLayer
  }
};
var miniMap = new L.Control.MiniMap(baseLayersCopy.North_Star, { toggleDisplay: true }).addTo(map);
    
    map.on('baselayerchange', function (e) {
            miniMap.changeLayer(baseLayersCopy[e.name]);
       });
var baseLayers = {
  "North Star": North_Star,
  "Terrain": Terrain,
  "Toner": Toner,
  "Satellite": Satellite,
  "Watercolor": Watercolor
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);


var hash = new L.Hash(map);


         

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  /* Fit map to boroughs bounds */
  map.fitBounds(artifacts.getBounds());
  featureList = new List("features", {valueNames: ["feature-name", "feature-merger", "feature-genre"]});
  featureList.sort("feature-name", {order:"asc"});

 


var artifactsBH = new Bloodhound({
    name: "artifacts",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: artifactsSearch,
    minLength: 2,
    limit: 10
   
  });

var documentsBH = new Bloodhound({
    name: "documents",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: documentsSearch,
     minLength: 2,
    limit: 10
 
  });

var photographicimagesBH = new Bloodhound({
    name: "photographicimages",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: photographicimagesSearch,
     minLength: 2,
    limit: 10
    
  });


  var printedworksBH = new Bloodhound({
    name: "printedworks",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: printedworksSearch,
     minLength: 2,
    limit: 10
    
  });

/*  var tradecardsBH = new Bloodhound({
    name: "tradecards",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: tradecardsSearch,
    limit: 10
  });*/

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"

          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10,
     minLength: 2
  });
  artifactsBH.initialize();
  documentsBH.initialize();
  photographicimagesBH.initialize();
  printedworksBH.initialize();
  // tradecardsBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
     minLength: 2,
    highlight: true
  }, {
    name: "artifacts",
    displayKey: "name",
    source: artifactsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/artifacts-15.svg' width='24' height='28'>&nbsp;Artifacts</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "documents",
    displayKey: "name",
    source: documentsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/documents-15.svg' width='24' height='28'>&nbsp;Documents</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "photographicimages",
    displayKey: "name",
    source: photographicimagesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/photographicimages-15.svg' width='24' height='28'>&nbsp;Photgraphic Images</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
  name: "printedworks",
  displayKey: "name",
  source: printedworksBH.ttAdapter(),
  templates: {
    header: "<h4 class='typeahead-header'><img src='assets/img/printedworks-15.svg' width='24' height='28'>&nbsp;Printed Works</h4>",
    suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
/*  }, {
  name: "tradecards",
  displayKey: "name",
  source: tradecardsBH.ttAdapter(),
  templates: {
    header: "<h4 class='typeahead-header'><img src='assets/img/tradecards-15.svg' width='24' height='28'>&nbsp;Trade Cards</h4>",
    suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
  }*/
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "artifacts") {
      if (!map.hasLayer(artifactsLayer)) {
        map.addLayer(artifactsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "documents") {
      if (!map.hasLayer(documentsLayer)) {
        map.addLayer(documentsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
      if (datum.source === "photographicimages") {
      if (!map.hasLayer(photographicimagesLayer)) {
        map.addLayer(photographicimagesLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
      if (datum.source === "printedworks") {
      if (!map.hasLayer(printedworksLayer)) {
        map.addLayer(printedworksLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
   /*   if (datum.source === "Tradecards") {
      if (!map.hasLayer(tradecardsLayer)) {
        map.addLayer(tradecardsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }*/
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

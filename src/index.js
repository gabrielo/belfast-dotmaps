var map;
var gl;

var mapOptions = {
  zoom: 2,
  center: new google.maps.LatLng(0.0, 0.0)
};

function init() {
  var mapDiv = document.getElementById('map-div');
  map = new google.maps.Map(mapDiv, mapOptions);
}

document.addEventListener('DOMContentLoaded', init, false);

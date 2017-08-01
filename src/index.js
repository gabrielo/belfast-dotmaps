var map;
var gl;

var mapOptions = {
  zoom: 12,
  center: new google.maps.LatLng(54.59, -5.92)
};

function init() {
  var mapDiv = document.getElementById('map-div');
  map = new google.maps.Map(mapDiv, mapOptions);
}

document.addEventListener('DOMContentLoaded', init, false);

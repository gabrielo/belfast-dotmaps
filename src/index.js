var geojsonGL;
var dotmapGl_2011;
var dotmapGl_2001;
var map;
var gl;
var canvasLayer;
var mapMatrix = new Float32Array(16);
var pixelsToWebGLMatrix = new Float32Array(16);
var gui;

var mapOptions = {
  zoom: 11,
  center: new google.maps.LatLng(54.59, -5.92),
  styles: mapStyles
};

var canvasLayerOptions = {
  resizeHandler: resize,
  animate: true,
  updateHandler: update
};

function resize() {
  var w = gl.canvas.width;
  var h = gl.canvas.height;
  gl.viewport(0, 0, w, h);
  // matrix which maps pixel coordinates to WebGL coordinates
  pixelsToWebGLMatrix.set([2/w, 0,   0, 0,
    0,  -2/h, 0, 0,
    0,   0,   0, 0,
    -1,   1,   0, 1]);
}

function update() {
  var mapProjection = map.getProjection();
  mapMatrix.set(pixelsToWebGLMatrix);
  var scale = canvasLayer.getMapScale();
  scaleMatrix(mapMatrix, scale, scale);
  var translation = canvasLayer.getMapTranslation();
  translateMatrix(mapMatrix, translation.x, translation.y);  
  geojsonGL.draw(mapMatrix);
  dotmapGl_2011.draw(mapMatrix);
  dotmapGl_2001.draw(mapMatrix);
}

function init() {
  var mapDiv = document.getElementById('map-div');
  map = new google.maps.Map(mapDiv, mapOptions);

  canvasLayerOptions.map = map;
  canvasLayer = new CanvasLayer(canvasLayerOptions);

  gl = canvasLayer.canvas.getContext('experimental-webgl');
  gl.getExtension("OES_standard_derivatives");

  geojsonGL = new GeoJSONGL(gl);
  geojsonGL.getData('../data/belfast.geojson', function(data) {
    geojsonGL.setData(data);
  })

  dotmapGl_2011 = new DotmapGl(gl);
  dotmapGl_2011.getBin('../data/dotmap-2011.bin', function(data) {
    dotmapGl_2011.setBuffer(data);
  })

  dotmapGl_2001 = new DotmapGl(gl);
  dotmapGl_2001.showDotmap = false;
  dotmapGl_2001.getBin('../data/dotmap-2001.bin', function(data) {
    dotmapGl_2001.setBuffer(data);
  })

  gui = new dat.GUI();
  gui.add(geojsonGL, 'showSmallAreas');
  gui.add(dotmapGl_2011, 'showDotmap').name('2011');
  gui.add(dotmapGl_2001, 'showDotmap').name('2001');

}

document.addEventListener('DOMContentLoaded', init, false);

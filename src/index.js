var geojsonGL;
var dotmapGl_2011;
var dotmapGl_2001;
var dotmapGl_1991;
var dotmapGl_1981;
var dotmapGl_1971;
var map;
var gl;
var canvasLayer;
var mapMatrix = new Float32Array(16);
var pixelsToWebGLMatrix = new Float32Array(16);
var gui;

var mapOptions = {
  zoom: 12,
  center: new google.maps.LatLng(54.59, -5.85),
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

  var countryLevelZoom = 12;
  var countryPointSizePixels = 1;

  var blockLevelZoom = 22;
  var blockPointSizePixels = 10;

  var pointSize = countryPointSizePixels * Math.pow(blockPointSizePixels / countryPointSizePixels, (map.zoom - countryLevelZoom) / (blockLevelZoom - countryLevelZoom));

  dotmapGl_2011.draw(mapMatrix, {pointSize: pointSize});
  dotmapGl_2001.draw(mapMatrix, {pointSize: pointSize});
  dotmapGl_1991.draw(mapMatrix, {pointSize: pointSize});
  dotmapGl_1981.draw(mapMatrix, {pointSize: pointSize});
  dotmapGl_1971.draw(mapMatrix, {pointSize: pointSize});
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

  dotmapGl_1991 = new DotmapGl(gl);
  dotmapGl_1991.showDotmap = false;
  dotmapGl_1991.getBin('../data/dotmap-1991.bin', function(data) {
    dotmapGl_1991.setBuffer(data);
  })

  dotmapGl_1981 = new DotmapGl(gl);
  dotmapGl_1981.showDotmap = false;
  dotmapGl_1981.getBin('../data/dotmap-1981.bin', function(data) {
    dotmapGl_1981.setBuffer(data);
  })

  dotmapGl_1971 = new DotmapGl(gl);
  dotmapGl_1971.showDotmap = false;
  dotmapGl_1971.getBin('../data/dotmap-1971.bin', function(data) {
    dotmapGl_1971.setBuffer(data);
  })

  gui = new dat.GUI();
  gui.add(geojsonGL, 'showSmallAreas');
  gui.add(dotmapGl_2011, 'showDotmap').name('2011');
  gui.add(dotmapGl_2001, 'showDotmap').name('2001');
  gui.add(dotmapGl_1991, 'showDotmap').name('1991');
  gui.add(dotmapGl_1981, 'showDotmap').name('1981');
  gui.add(dotmapGl_1971, 'showDotmap').name('1971');

}

document.addEventListener('DOMContentLoaded', init, false);

// geojson-gl.js

var vertexShader = 
'attribute vec4 a_vertex;\n' +
'attribute vec4 a_color;\n' +
'uniform mat4 u_map_matrix;\n' +
'varying vec4 v_color;\n' +
'void main() {\n' +
'    vec4 position;\n' +
'    position = u_map_matrix * a_vertex;\n' +
'    gl_Position = position;\n' +
'    v_color = a_color;\n' +
'}\n';

var fragmentShader = 
'#extension GL_OES_standard_derivatives : enable\n' +
'precision mediump float;\n' +
'varying vec4 v_color;\n' +
'void main() {\n' +
'    gl_FragColor = v_color;\n' +
'}\n';

var GeoJSONGL = function GeoJSONGL(gl) {
    this.gl = gl;
    this.program = createProgram(gl, vertexShader, fragmentShader);
    this.buffer = {
        'numAttributes': 5,
        'count': 0,
        'buffer': null,
        'ready': false
    }
}

GeoJSONGL.prototype.getData = function(url, callback) {
    console.log('getData');
    var that = this;
    this.xhr = new XMLHttpRequest();
    this.xhr.open('GET', url);
    var data;
    this.xhr.onload = function() {
        if (this.status == 404) {
            data = "";
        } else {
            data = JSON.parse(this.responseText);
        }
        callback(data);
    }
    this.xhr.onerror = function() {
        callback('');
    }
    this.xhr.send();    
}

GeoJSONGL.prototype.setData = function(data, callback) {
    console.log('setData');
    var verts = [];
    var rawVerts = [];
    if (typeof data.features != "undefined") {
       for (var f = 0; f < data.features.length ; f++) {
            var feature = data.features[f];
            var color = [Math.random(), Math.random(), Math.random()];
            if (feature.geometry.type != "MultiPolygon") {
                var mydata = earcut.flatten(feature.geometry.coordinates);
                var triangles = earcut(mydata.vertices, mydata.holes, mydata.dimensions);
                for (var i = 0; i < triangles.length; i++) {
                    var pixel = LatLongToPixelXY(mydata.vertices[triangles[i]*2 + 1],mydata.vertices[triangles[i]*2]);
                    verts.push(pixel.x, pixel.y, color[0], color[1], color[2]);
                }
            } else {
                for ( var j = 0; j < feature.geometry.coordinates.length; j++) {
                    var mydata = earcut.flatten(feature.geometry.coordinates[j]);
                    var triangles = earcut(mydata.vertices, mydata.holes, mydata.dimensions);
                    for (var i = 0; i < triangles.length; i++) {
                        var pixel = LatLongToPixelXY(mydata.vertices[triangles[i]*2 + 1],mydata.vertices[triangles[i]*2]);
                        verts.push(pixel.x, pixel.y, color[0], color[1], color[2]);
                    }
                }
            }
        }
    }
    this.setBuffer(new Float32Array(verts));
}

GeoJSONGL.prototype.setBuffer = function(data) {
    this.data = data;
    this.buffer.count = data.length / this.buffer.numAttributes;
    this.buffer.buffer = createBuffer(gl, data);   
    this.buffer.ready = true;
}

GeoJSONGL.prototype.draw = function draw(transform, options) {
    if (this.buffer.ready) {
        var options = options || {};
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        var program = this.program;
        var buffer = this.buffer;
        gl.useProgram(program.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
        bindAttribute(gl, program.program, 'a_vertex', 2, gl.FLOAT, false, 20, 0);    
        bindAttribute(gl, program.program, 'a_color', 3, gl.FLOAT, false, 20, 8);    
        gl.uniformMatrix4fv(program.u_map_matrix, false, transform);

        gl.drawArrays(gl.TRIANGLES, 0, buffer.count);
        gl.disable(gl.BLEND);
    }
};
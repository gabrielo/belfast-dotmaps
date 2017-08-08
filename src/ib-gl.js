// ib-gl.js
// Interface Barriers

var lineStringVertexShader = 
'attribute vec4 a_vertex;\n' +
'//attribute vec4 a_epoch;\n' +
'uniform mat4 u_map_matrix;\n' +
'void main() {\n' +
'    vec4 position;\n' +
'    position = u_map_matrix * a_vertex;\n' +
'    gl_Position = position;\n' +
'}\n';

var lineStringFragmentShader = 
'#extension GL_OES_standard_derivatives : enable\n' +
'precision mediump float;\n' +
'void main() {\n' +
'    gl_FragColor = vec4(49.0/255.,24.0/255.,12.0/255.,1.0);\n' +
'}\n';

var InterfaceBarrierGl = function InterfaceBarrierGl(gl) {
    this.gl = gl;
    this.program = createProgram(gl, lineStringVertexShader, lineStringFragmentShader);
    this.buffer = {
        'numAttributes': 2,
        'count': 0,
        'buffer': null,
        'ready': false
    };
    this.showInterfaceBarriers = false;
}

InterfaceBarrierGl.prototype.getData = function(url, callback) {
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

InterfaceBarrierGl.prototype.setData = function(data, callback) {
    var verts = [];
    if (typeof data.features != "undefined") {
       for (var f = 0; f < data.features.length ; f++) {
            var feature = data.features[f];
            if (feature.geometry.type == "LineString") {
                for (var i = 0; i < feature.geometry.coordinates.length - 1; i++) {
                    var pixel_0 = LatLongToPixelXY(feature.geometry.coordinates[i][1], feature.geometry.coordinates[i][0]);
                    var pixel_1 = LatLongToPixelXY(feature.geometry.coordinates[i+1][1], feature.geometry.coordinates[i+1][0]);
                    verts.push(pixel_0.x,pixel_0.y);
                    verts.push(pixel_1.x,pixel_1.y);
                }
            } 
        }
    }
    this.setBuffer(new Float32Array(verts));
}

InterfaceBarrierGl.prototype.setBuffer = function(data) {
    this.data = data;
    this.buffer.count = data.length / this.buffer.numAttributes;
    this.buffer.buffer = createBuffer(gl, data);   
    this.buffer.ready = true;
}

InterfaceBarrierGl.prototype.draw = function draw(transform, options) {
    if (this.buffer.ready) {
        var options = options || {};
        var gl = this.gl;
        //gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        var program = this.program;
        var buffer = this.buffer;
        gl.useProgram(program.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
        bindAttribute(gl, program.program, 'a_vertex', 2, gl.FLOAT, false, buffer.numAttributes*4, 0);    
        gl.uniformMatrix4fv(program.u_map_matrix, false, transform);
       // gl.lineWidth(10.0)
       
        if (this.showInterfaceBarriers) {
          gl.drawArrays(gl.LINES, 0, buffer.count);

        }
        gl.disable(gl.BLEND);
    }
};
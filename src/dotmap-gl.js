// dotmap-gl.js

var dotMapVertexShader = 
'attribute vec4 a_coord;\n' +
'attribute float a_val;\n' +
'uniform mat4 u_map_matrix;\n' +
'varying float v_val;\n' +
'void main() {\n' +
'    vec4 position;\n' +
'    position = u_map_matrix * a_coord;\n' +
'    gl_Position = position;\n' +
'    gl_PointSize = 1.0;\n' +
'    v_val = a_val;\n' +
'}\n';

var dotMapFragmentShader = 
'#extension GL_OES_standard_derivatives : enable\n' +
'precision mediump float;\n' +
'varying float v_val;\n' +
'void main() {\n' +
'    vec4 color;\n' +
'    if (v_val == 1.0) {\n' +
'      color = vec4(1.0, 0.0, 0.0, 1.0); \n' +
'    }\n' + 
'    else if (v_val == 2.0) {\n' +
'      color = vec4(0.0, 1.0, 0.0, 1.0); \n' +
'    }\n' + 
'    else if (v_val == 3.0) {\n' +
'      color = vec4(0.0, 0.0, 1.0, 1.0); \n' +
'    }\n' + 
'    else if (v_val == 4.0) {\n' +
'      color = vec4(1.0, 1.0, 1.0, 1.0); \n' +
'    }\n' + 
'    else {\n' +
'      color = vec4(0.0, 0.0, 0.0, 1.0); \n' +
'    }\n' + 
'    gl_FragColor = color;\n' +
'}\n';

var DotmapGl = function DotmapGl(gl) {
    this.gl = gl;
    this.program = createProgram(gl, dotMapVertexShader, dotMapFragmentShader);
    this.buffer = {
        'numAttributes': 3,
        'count': 0,
        'buffer': null,
        'ready': false
    }
}

DotmapGl.prototype.getBin = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('get', url, true);
    xhr.onload = function () {
      var float32Array = new Float32Array(this.response);
      callback(float32Array);
    };
    xhr.send();
}


DotmapGl.prototype.setBuffer = function(data) {
    this.data = data;
    this.buffer.count = data.length / this.buffer.numAttributes;
    this.buffer.buffer = createBuffer(gl, data);   
    this.buffer.ready = true;
}

DotmapGl.prototype.draw = function draw(transform, options) {
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
        bindAttribute(gl, program.program, 'a_coord', 2, gl.FLOAT, false, this.buffer.numAttributes*4, 0);    
        bindAttribute(gl, program.program, 'a_val', 1, gl.FLOAT, false, this.buffer.numAttributes*4, 8);    
        gl.uniformMatrix4fv(program.u_map_matrix, false, transform);

        gl.drawArrays(gl.POINTS, 0, buffer.count);
        gl.disable(gl.BLEND);
    }
};
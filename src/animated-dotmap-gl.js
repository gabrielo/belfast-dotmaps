// animated-dotmap-gl.js

var animatedDotMapVertexShader = 
'attribute vec4 a_coord;\n' +
'attribute float a_val;\n' +
'attribute float a_start;\n' +
'attribute float a_end;\n' +
'uniform mat4 u_map_matrix;\n' +
'uniform float u_point_size;\n' +
'uniform float u_current;\n' +
'varying float v_val;\n' +
'void main() {\n' +
'    vec4 position;\n' +
'    if (a_start > u_current || a_end < u_current) {\n' +
'      position = vec4(-1.,-1.,-1.,-1.);\n' + 
'    } else {\n' +
'      position = u_map_matrix * a_coord;\n' +
'    }\n' + 
'    gl_Position = position;\n' +
'    gl_PointSize = u_point_size;\n' +
'    v_val = a_val;\n' +
'}\n';

var animatedDotMapFragmentShader = 
'#extension GL_OES_standard_derivatives : enable\n' +
'precision mediump float;\n' +
'varying float v_val;\n' +
'void main() {\n' +
'    vec4 color;\n' +
'    if (v_val == 1.0) {\n' +
'      color = vec4(13.0/255., 115.0/255., 39.0/255., .85); \n' +
'    }\n' + 
'    else if (v_val == 2.0) {\n' +
'      color = vec4(244.0/255., 115.0/255., 33.0/255., .85); \n' +
'    }\n' + 
'    else if (v_val == 3.0) {\n' +
'      color = vec4(105.0/255., 42.0/255., 123.0/255., .85); \n' +
'    }\n' + 
'    else if (v_val == 4.0) {\n' +
'      color = vec4(160.0/255., 123.0/255., 105.0/255., .85); \n' +
'    }\n' + 
'    else {\n' +
'      color = vec4(245.0/255., 245.0/255., 0.0/255., .85); \n' +
'    }\n' + 
'    gl_FragColor = color;\n' +
'}\n';

var AnimatedDotmapGl = function AnimatedDotmapGl(gl) {
    this.gl = gl;
    this.program = createProgram(gl, animatedDotMapVertexShader, animatedDotMapFragmentShader);
    this.buffer = {
        'numAttributes': 5,
        'count': 0,
        'buffer': null,
        'ready': false
    };
    this.showDotmap = true;

}

AnimatedDotmapGl.prototype.getBin = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('get', url, true);
    xhr.onload = function () {
      var float32Array = new Float32Array(this.response);
      callback(float32Array);
    };
    xhr.send();
}


AnimatedDotmapGl.prototype.setBuffer = function(data) {
    this.data = data;
    this.buffer.count = data.length / this.buffer.numAttributes;
    this.buffer.buffer = createBuffer(gl, data);   
    this.buffer.ready = true;
}

AnimatedDotmapGl.prototype.draw = function draw(transform, options) {
    if (this.buffer.ready && this.showDotmap) {
        var options = options || {};
        var current = options.current || 1971;
        var gl = this.gl;
        var pointSize = options.pointSize || 10.;
        //gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        var program = this.program;
        var buffer = this.buffer;
        gl.useProgram(program.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
        bindAttribute(gl, program.program, 'a_coord', 2, gl.FLOAT, false, this.buffer.numAttributes*4, 0);    
        bindAttribute(gl, program.program, 'a_val', 1, gl.FLOAT, false, this.buffer.numAttributes*4, 8);    
        bindAttribute(gl, program.program, 'a_start', 1, gl.FLOAT, false, this.buffer.numAttributes*4, 12);    
        bindAttribute(gl, program.program, 'a_end', 1, gl.FLOAT, false, this.buffer.numAttributes*4, 16);    
        gl.uniformMatrix4fv(program.u_map_matrix, false, transform);
        gl.uniform1f(program.u_point_size, pointSize);
        gl.uniform1f(program.u_current, current);

        if (this.showAnimatedDotmap) {
            gl.drawArrays(gl.POINTS, 0, buffer.count);
        }
        gl.disable(gl.BLEND);
    }
};
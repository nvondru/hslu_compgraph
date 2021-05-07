window.onload = startup;

let canvas;
let gl;

function startup() {
  canvas = document.getElementById("c");
  gl = canvas.getContext();
  if (!gl) {
    alert("No WebGL Context :(");
  } else {
    //   init WebGL Stuff
    initWebGL();

    //   render loop
    draw();
  }
}

function initWebGL() {
  // load shader files
  var vertexShaderSource = loadResource("VertexShader.glsl");
  var fragmentShaderSource = loadResource("FragmentShader.glsl");

  //   create and compile shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  //   create a WebGL program with our shaders
  var program = createProgram(gl, vertexShader, fragmentShader);

  //   look up attribute locations
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // three 2d points
  var positions = [0, 0, 0, 0.5, 0.7, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}

function draw() {}

// ------ HELPER FUNCTIONS --------

/**
 * Load a external resource synchronously from an URL.
 *
 * If the URL ends up specifying a file (when the original HTML is read from the file system) then
 * some security settings of the browser might have been changed. If there is a local web server,
 * there should not be any problem.
 *
 * @param name The name of the resource to get
 * @returns {string} the content of the resource
 */
function loadResource(name) {
  "use strict";
  var request = new XMLHttpRequest();
  request.open("GET", name, false); // false gives a synchronous request
  request.send(null);
  if (request.status === 200 || request.status === 0) {
    return request.responseText;
  } else {
    console.log("Error: loadFile status:" + request.statusText);
    console.log(request.status);
    console.log(request.statusText);
    console.log(request.toString());
    console.log(request.responseText);
    return null;
  }
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

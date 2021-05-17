//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
/** @type {WebGLRenderingContext} */
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  // add local parameters for attributes and uniforms here
  vertexPositionId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
  buffer: -1,
  colorBuffer: -1,
};

let shapes = [];

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");
  gl = createGLContext(canvas);
  initGL();
  draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
  "use strict";
  ctx.shaderProgram = loadAndCompileShaders(
    gl,
    "VertexShader.glsl",
    "FragmentShader.glsl"
  );
  setUpBuffers();

  // set the clear color here
  gl.clearColor(0.9, 0.9, 0.9, 1);
}

function initShapeWithColor(vertices, colors, name) {
  let shape = {};
  shape.name = name;
  shape.positionBuffer = bufferDataToAttribute(
    new Float32Array(vertices),
    2,
    "vertexPosition",
    gl.FLOAT
  );

  shape.colorBuffer = bufferDataToAttribute(
    new Float32Array(colors),
    4,
    "vertexColor",
    gl.FLOAT
  );

  shapes.push(shape);
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
  "use strict";

  initShapeWithColor(
    [-1, 1, 0, 1, -1, 0, 0, 0],
    [
      1.0,
      1.0,
      1.0,
      1.0, // white
      1.0,
      0.0,
      0.0,
      1.0, // red
      0.0,
      1.0,
      0.0,
      1.0, // green
      0.0,
      0.0,
      1.0,
      1.0, // blue
    ],
    "one"
  );

  // initShapeWithColor(
  //   [0, 1, 1, 1, 0, 0, 1, 0],
  //   [
  //     1.0,
  //     1.0,
  //     1.0,
  //     1.0, // white
  //     1.0,
  //     0.0,
  //     0.0,
  //     1.0, // red
  //     0.0,
  //     1.0,
  //     0.0,
  //     1.0, // green
  //     0.0,
  //     0.0,
  //     1.0,
  //     1.0, // blue
  //   ],
  //   "two"
  // );
}

/**
 *
 * @param {BufferSource} data
 * @param {number} size example: floats per element vec2 => 2
 * @param {string} attribName
 * @param {number} type
 * @returns {WebGLBuffer}
 */
function bufferDataToAttribute(data, size, attribName, type) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const location = gl.getAttribLocation(ctx.shaderProgram, attribName);
  gl.vertexAttribPointer(location, size, type, false, 0, 0);
  gl.enableVertexAttribArray(location);

  return buffer;
}

/**
 * Draw the scene.
 */
function draw() {
  "use strict";
  console.log("Drawing");
  gl.clear(gl.COLOR_BUFFER_BIT);
  // add drawing routines here
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  uColorId: -1,
  uProjectionMatId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
  buffer: -1,
  uModelMatrixId: -1,
};

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
  setUpAttributesAndUniforms();
  setUpBuffers();

  //   setup viewport/world coordinates
  var projectionMat = mat3.create();
  //   creates scaling matrix
  mat3.fromScaling(projectionMat, [2 / 800, 2 / 600]);
  gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);

  gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
  "use strict";
  ctx.aVertexPositionId = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexPosition"
  );
  ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
  ctx.uProjectionMatId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uProjectionMatrix"
  );
  rectangleObject.uModelMatrixId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uModelMatrix"
  );
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
  "use strict";
  rectangleObject.buffer = gl.createBuffer();
  var vertices = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5];
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function drawShape() {}

/**
 * Draw the scene.
 */
function draw(time) {
  time *= 0.002;
  ("use strict");
  console.log("Drawing");
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ctx.aVertexPositionId);

  gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);

  // set model tranformation matrix here!
  let modelMatrix = mat3.create();
  //  scaling matrix
  let scalingMatrix = mat3.create();
  mat3.fromScaling(scalingMatrix, [100, 100]);
  //   rotation matrix
  let rotationMatrix = mat3.create();
  mat3.fromRotation(rotationMatrix, Math.PI / 4);
  // multiply rotation and scaling matrix
  modelMatrix = mat3.mul(modelMatrix, scalingMatrix, rotationMatrix);
  gl.uniformMatrix3fv(rectangleObject.uModelMatrixId, false, modelMatrix);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  requestAnimationFrame(draw);
}

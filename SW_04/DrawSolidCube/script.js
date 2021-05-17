//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
/** @type {WebGLRenderingContext} */
var gl;

var indices;

let square;
let startPos = undefined;
let camPos = {
  x: 0,
  y: 0,
  z: 2,
};

let modeSelect;

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  vColorId: -1,
  uProjectionMatId: -1,
  uViewMatId: -1,
  uModelMatId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
  buffer: -1,
  indicesBuffer: -1,
  colorBuffer: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");
  modeSelect = document.getElementById("mode");
  modeSelect.addEventListener("change", (event) => {
    console.log(event.target.value);
  });

  // camera - mouse interaction
  document.body.addEventListener("wheel", (event) => {
    camPos.z += event.deltaY / 5000;
  });
  document.body.addEventListener("mousedown", (event) => {
    startPos = { x: event.x, y: event.y };
  });
  document.body.addEventListener("mousemove", (event) => {
    if (startPos != undefined) {
      camPos.x -= (event.x - startPos.x) / 100;
      camPos.y += (event.y - startPos.y) / 100;
      startPos.x = event.x;
      startPos.y = event.y;
    }
  });
  document.body.addEventListener("mouseup", (event) => {
    startPos = undefined;
  });

  let side = 1;
  square = new Square(side, side, side, -side / 2, -side / 2, -side / 2);
  gl = createGLContext(canvas);
  initGL();
  window.requestAnimationFrame(drawAnimated);
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
  gl.frontFace(gl.CCW); // defines how the front face is drawn
  gl.cullFace(gl.FRONT); // defines which face should be culled
  gl.enable(gl.CULL_FACE); // enables culling
  setUpAttributesAndUniforms();
  setUpBuffers();

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
  ctx.vColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
  ctx.uProjectionMatId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uProjectionMat"
  );
  ctx.uViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uViewMat");
  ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
  "use strict";
  // position
  rectangleObject.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(square.vertices),
    gl.STATIC_DRAW
  );

  // buffer for colors
  rectangleObject.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(square.colors),
    gl.STATIC_DRAW
  );

  // buffer for indices
  // prettier-ignore
  // indices = [
  //   // bottom
  //   0, 3, 1,
  //   1, 3, 2,
  //   // top
  //   4, 5, 6,
  //   6, 7, 4,
  //   // front
  //   0, 1, 5,
  //   5, 4, 0,
  //   // back
  //   2, 3, 7,
  //   7, 6, 2,
  //   // left
  //   3, 0, 4,
  //   4, 7, 3,
  //   // right
  //   1, 2, 5,
  //   5, 2, 6
  // ];
  // rectangleObject.indicesBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangleObject.indicesBuffer);
  // gl.bufferData(
  //   gl.ELEMENT_ARRAY_BUFFER,
  //   new Uint16Array(indices),
  //   gl.STATIC_DRAW
  // );
}

/**
 * Draw the scene.
 */
function draw() {
  "use strict";
  gl.clear(gl.COLOR_BUFFER_BIT);
  // set camera projection
  let projectionMatrix = mat4.create();
  setView(projectionMatrix, Number(modeSelect.value));

  // set camera position and orientation
  let viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, [camPos.x, camPos.y, camPos.z], [0, 0, 0], [0, 1, 0]);
  gl.uniformMatrix4fv(ctx.uViewMatId, false, viewMatrix);

  gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMatrix);

  //TODO : draw more stuff
  drawSquare(square);
}

function setView(pMatrix, mode) {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  let sizeMultiplier = 1000;

  switch (mode) {
    case 0:
      mat4.perspective(pMatrix, glMatrix.toRadian(30), aspectRatio, 0.01, 100);
      camPos = {
        x: 0,
        y: 0,
        z: 4,
      };
      break;

    case 1:
      mat4.perspective(pMatrix, glMatrix.toRadian(50), aspectRatio, 0.01, 100);
      camPos = {
        x: 0,
        y: 0,
        z: 2,
      };
      break;

    case 2:
      mat4.perspective(pMatrix, glMatrix.toRadian(40), aspectRatio, 0.01, 100);
      camPos = {
        x: 2,
        y: 2,
        z: 2,
      };
      break;

    case 3:
      mat4.perspective(pMatrix, glMatrix.toRadian(50), aspectRatio, 0.01, 100);
      camPos = {
        x: -1,
        y: 0,
        z: 2,
      };
      break;

    case 4:
      mat4.ortho(
        pMatrix,
        (-2 / gl.drawingBufferWidth) * sizeMultiplier,
        (2 / gl.drawingBufferWidth) * sizeMultiplier,
        (-1 / gl.drawingBufferHeight) * sizeMultiplier,
        (1 / gl.drawingBufferHeight) * sizeMultiplier,
        0.01,
        100
      );
      camPos = {
        x: -1,
        y: 0,
        z: 2,
      };
      break;

    case 5:
      mat4.ortho(
        pMatrix,
        (-2 / gl.drawingBufferWidth) * sizeMultiplier,
        (2 / gl.drawingBufferWidth) * sizeMultiplier,
        (-1 / gl.drawingBufferHeight) * sizeMultiplier,
        (1 / gl.drawingBufferHeight) * sizeMultiplier,
        0.01,
        100
      );
      camPos = {
        x: -1,
        y: 0.5,
        z: 2,
      };
      break;

    default:
      mat4.perspective(pMatrix, glMatrix.toRadian(40), aspectRatio, 0.01, 100);

      break;
  }
}

function drawSquare(square) {
  // Model matrix
  let modelMat = mat4.create();

  let modelMat_translate = mat4.create();
  mat4.fromTranslation(modelMat_translate, [
    square.position.x,
    square.position.y,
    square.position.z,
  ]);

  let modelMat_scale = mat4.create();
  mat4.fromScaling(modelMat_scale, [square.width, square.height, square.depth]);

  let modelMat_temp = mat4.create();
  mat4.mul(modelMat_temp, modelMat_translate, modelMat_scale);

  let modelMat_rotation = mat4.create();
  mat4.fromRotation(modelMat_rotation, glMatrix.toRadian(square.angle), [
    square.rotation.x,
    square.rotation.y,
    square.rotation.z,
  ]);
  mat4.mul(modelMat, modelMat_rotation, modelMat_temp);

  // connect to webGL
  // position
  gl.uniformMatrix4fv(ctx.uModelMatId, false, modelMat);
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ctx.aVertexPositionId);

  // color
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.colorBuffer);

  gl.vertexAttribPointer(ctx.vColorId, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ctx.vColorId);

  // indices
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangleObject.indicesBuffer);

  // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  gl.drawArrays(gl.TRIANGLES, 0, square.vertices.length);
}

// animation
var first = true;
var lastTimeStamp = 0;

function drawAnimated(timeStamp) {
  if (first) {
    lastTimeStamp = timeStamp;
    first = false;
  } else {
    var timeElapsed = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;

    //TODO : move things
    square.rotation.x = 0;
    square.rotation.y = 1;
    square.rotation.z = 0;
    square.angle += (20 * timeElapsed) / 1000;
  }
  draw();
  window.requestAnimationFrame(drawAnimated);
}

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

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  uColorId: -1,
  uProjectionMatId: -1,
  uModelMatId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
  buffer: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");
  gl = createGLContext(canvas);
  initGL();
  initGame();
  window.addEventListener("keyup", onKeyup, false);
  window.addEventListener("keydown", onKeydown, false);

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
  ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
  ctx.uProjectionMatId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uProjectionMat"
  );
  ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
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

/**
 * Draw the scene.
 */
function draw() {
  "use strict";
  console.log("Drawing");
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set up the world coordinates
  var projectionMat = mat3.create();
  mat3.fromScaling(projectionMat, [
    2.0 / gl.drawingBufferWidth,
    2.0 / gl.drawingBufferHeight,
  ]);
  gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);

  drawMiddleLine();
  drawShape(game.paddleLeft);
  drawShape(game.paddleRight);
  drawShape(game.ball);
}

function drawSquare() {
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ctx.aVertexPositionId);

  gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawMiddleLine() {
  var modelMat = mat3.create();

  mat3.scale(modelMat, modelMat, [2, gl.drawingBufferHeight]);
  gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
  drawSquare();
}

function drawShape(shape) {
  let modelMat = mat3.create();

  let modelMat_scale = mat3.create();
  mat3.fromScaling(modelMat_scale, [shape.scale.x, shape.scale.y]);

  let modelMat_translate = mat3.create();
  mat3.fromTranslation(modelMat_translate, [
    shape.translate.x,
    shape.translate.y,
  ]);

  mat3.mul(modelMat, modelMat_translate, modelMat_scale);
  gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
  drawSquare();
}

// animation
var first = true;
var lastTimeStamp = 0;

function drawAnimated(timeStamp) {
  if (first) {
    lastTimeStamp = timeStamp;
    first = false;
  } else {
    var deltaTime = (timeStamp - lastTimeStamp) / 1000;
    lastTimeStamp = timeStamp;
    //TODO : move things
    if (isDown(controller.UP)) {
      game.paddleRight.translate.y += controller.speed * deltaTime;
    }
    if (isDown(controller.DOWN)) {
      game.paddleRight.translate.y -= controller.speed * deltaTime;
    }
    if (isDown(controller.W)) {
      game.paddleLeft.translate.y += controller.speed * deltaTime;
    }
    if (isDown(controller.S)) {
      game.paddleLeft.translate.y -= controller.speed * deltaTime;
    }

    if (hitsLeftPaddle() || hitsRightPaddle()) {
      game.ball.speed.x *= -1;
    }

    game.ball.translate.x += game.ball.speed.x * deltaTime;
    game.ball.translate.y += game.ball.speed.y * deltaTime;
  }
  draw();
  window.requestAnimationFrame(drawAnimated);
}

function hitsRightPaddle() {
  return (
    game.ball.translate.x >= game.paddleRight.translate.x &&
    game.ball.translate.y >=
      game.paddleRight.translate.y - game.paddleRight.scale.y / 2 &&
    game.ball.translate.y <=
      game.paddleRight.translate.y + game.paddleRight.scale.y / 2
  );
}

function hitsLeftPaddle() {
  return (
    game.ball.translate.x <= game.paddleLeft.translate.x &&
    game.ball.translate.y >=
      game.paddleLeft.translate.y - game.paddleLeft.scale.y / 2 &&
    game.ball.translate.y <=
      game.paddleLeft.translate.y + game.paddleLeft.scale.y / 2
  );
}

// Key Handling
var controller = {
  _pressed: {},
  speed: 250,

  UP: "ArrowUp",
  DOWN: "ArrowDown",
  W: "w",
  S: "s",
};

function isDown(key) {
  return controller._pressed[key];
}

function onKeydown(event) {
  controller._pressed[event.key] = true;
}

function onKeyup(event) {
  delete controller._pressed[event.key];
}

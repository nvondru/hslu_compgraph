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
let solidCube;
let solidSphere;
let startPos = undefined;
let camPos = {
  x: 0,
  y: 0,
  z: 0,
};
let solidCubes = [];

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  aVertexColorId: -1,
  aVertexTextureCoordId: -1,
  aVertexNormalId: -1,
  uProjectionMatId: -1,
  uViewMatId: -1,
  uModelMatId: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");

  // camera - mouse interaction
  document.body.addEventListener("wheel", (event) => {
    solidCubes.forEach((solidCube) => {
      solidCube.scale((event.deltaY / Math.abs(event.deltaY)) * 0.1);
    });
  });
  document.body.addEventListener("mousedown", (event) => {
    startPos = { x: event.x, y: event.y };
  });
  document.body.addEventListener("mousemove", (event) => {
    if (startPos != undefined) {
      solidCubes.forEach((solidCube) => {
        solidCube.rotate(event.x - startPos.x, event.y - startPos.y);
      });
      startPos.x = event.x;
      startPos.y = event.y;
    }
  });
  document.body.addEventListener("mouseup", (event) => {
    startPos = undefined;
  });

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
  gl.cullFace(gl.BACK); // defines which face should be culled
  gl.enable(gl.CULL_FACE); // enables culling
  setUpAttributesAndUniforms();
  setUpBuffers();

  gl.uniform1i(ctx.uEnableTextureId, 0);
  gl.uniform1i(ctx.uEnableLightingId, 1);

  gl.uniform3fv(ctx.uLightPositionId, [50, 50, 50]);
  gl.uniform3fv(ctx.uLightColorId, [0, 1, 0]);

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
  ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
  ctx.aVertexTextureCoordId = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexTextureCoord"
  );
  ctx.aVertexNormalId = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexNormal"
  );

  ctx.uProjectionMatId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uProjectionMat"
  );
  ctx.uViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uViewMat");
  ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
  ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMat");

  // fragment shader
  ctx.uEnableTextureId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uEnableTexture"
  );
  ctx.uEnableLightingId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uEnableLighting"
  );
  ctx.uLightPositionId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uLightPosition"
  );
  ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");

  ctx.uCurrentTimeId = gl.getUniformLocation(ctx.shaderProgram, "uCurrentTime");
  ctx.uScaleId = gl.getUniformLocation(ctx.shaderProgram, "uScale");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
  "use strict";
  // solidCube = SolidCube(
  //   gl,
  //   [1, 0, 0],
  //   [0, 1, 0],
  //   [0, 0, 1],
  //   [1, 1, 0],
  //   [1, 1, 1],
  //   [0, 0, 0]
  // );

  for (let i = -4; i < 4; i += 2) {
    for (let j = -4; j < 4; j += 2) {
      let cube = SolidCube(
        gl,
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      );
      cube.position.x = i;
      cube.position.y = j;
      solidCubes.push(cube);
    }
  }

  // solidSphere = SolidSphere(gl, 50, 50, [1, 0, 0]);
}

/**
 * Draw the scene.
 */
function draw() {
  "use strict";
  gl.clear(gl.COLOR_BUFFER_BIT);

  // set camera projection
  let projectionMatrix = mat4.create();
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  mat4.perspective(
    projectionMatrix,
    glMatrix.toRadian(30),
    aspectRatio,
    0.01,
    100
  );

  // set camera position and orientation
  let viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, [camPos.x, camPos.y, camPos.z], [0, 0, 0], [0, 1, 0]);

  gl.uniformMatrix4fv(ctx.uViewMatId, false, viewMatrix);
  gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMatrix);

  //TODO : draw more stuff
  solidCubes.forEach((cube) => {
    setModelViewTransformations(cube, viewMatrix);
    cube.draw(
      gl,
      ctx.aVertexPositionId,
      ctx.aVertexColorId,
      ctx.aVertexTextureCoordId,
      ctx.aVertexNormalId
    );
  });
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
    let amplitude = 5;
    let speedMultiplier = 0.001;
    let lightX = Math.cos(timeStamp * speedMultiplier) * amplitude;
    let lightY = Math.sin(timeStamp * speedMultiplier) * amplitude;
    gl.uniform3fv(ctx.uLightPositionId, [lightX, lightY, -5]);
    gl.uniform1f(ctx.uCurrentTimeId, Math.sin(Date.now() * 0.001));

    solidCubes.forEach((solidCube) => {
      solidCube.scaleX(
        Math.abs(Math.sin(Date.now() * 0.001)) + Math.random() * 0.001
      );
      solidCube.scaleY(Math.abs(Math.cos(Date.now() * 0.001)));
      solidCube.scaleZ(Math.abs(Math.tan(Date.now() * 0.0001)));
      solidCube.angle += 0.5;
      gl.uniform1f(ctx.uScaleId, solidCube.width);
    });
  }
  draw();
  window.requestAnimationFrame(drawAnimated);
}

function setModelViewTransformations(objectModel, viewMatrix) {
  // Model matrix
  let modelMat = mat4.create();

  let modelMat_translate = mat4.create();
  mat4.fromTranslation(modelMat_translate, [
    objectModel.position.x,
    objectModel.position.y,
    objectModel.position.z,
  ]);

  let modelMat_rotation = mat4.create();
  mat4.fromRotation(modelMat_rotation, glMatrix.toRadian(objectModel.angle), [
    objectModel.rotation.x,
    objectModel.rotation.y,
    objectModel.rotation.z,
  ]);

  let modelMat_temp = mat4.create();
  mat4.mul(modelMat_temp, modelMat_translate, modelMat_rotation);

  let modelMat_scale = mat4.create();
  mat4.fromScaling(modelMat_scale, [
    objectModel.width,
    objectModel.height,
    objectModel.depth,
  ]);

  mat4.mul(modelMat, modelMat_temp, modelMat_scale);
  gl.uniformMatrix4fv(ctx.uModelMatId, false, modelMat);
  let normalMat = mat3.create();
  // maybe model * view mat instead of just modelmat!
  mat3.normalFromMat4(normalMat, modelMat);
  gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMat);
}

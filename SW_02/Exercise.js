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
  aVertexTextureCoordId: -1,
  uSamplerId: -1,
};

// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
  textureObject0: {},
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
  positionBuffer: -1,
  textureBuffer: -1,
  indicesBuffer: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");
  gl = createGLContext(canvas);
  initGL();
  loadTexture();
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

  gl.clearColor(0.8, 0.8, 0.8, 1);
}

/**
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture(image, textureObject) {
  // create a new texture
  gl.bindTexture(gl.TEXTURE_2D, textureObject);

  // set parameters for the texture
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );
  gl.generateMipmap(gl.TEXTURE_2D);

  // turn texture off again
  gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Load an image as a texture
 */
function loadTexture() {
  var image = new Image();
  // create a texture object
  lennaTxt.textureObject0 = gl.createTexture();
  image.onload = function () {
    initTexture(image, lennaTxt.textureObject0);
    // make sure there is a redraw after the loading of the texture
    draw();
  };
  // setting the src will trigger onload
  image.src = "lena512.png";
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
  ctx.aVertexTextureCoordId = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexTextureCoord"
  );
  ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
  "use strict";
  //  buffer for vertices positions
  var vertices = [-0.5, -0.5, 0, -0.5, -0.25, 0.5, 0.5, -0.5, 0.25, 0.5];
  rectangleObject.positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // buffer for indices
  var indices = [0, 1, 2, 1, 3, 4];
  rectangleObject.indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangleObject.indicesBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  // create the texture coordinates for the object
  var textureCoord = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
  rectangleObject.textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoord),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

/**
 * Draw the scene.
 */
function draw() {
  "use strict";
  console.log("Drawing");
  gl.clear(gl.COLOR_BUFFER_BIT);

  // position
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.positionBuffer);
  gl.vertexAttribPointer(
    ctx.aVertexPositionId,
    2,
    gl.FLOAT,
    false,
    0 /* stride in bytes */,
    0 /* offset */
  );
  gl.enableVertexAttribArray(ctx.aVertexPositionId);

  // indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangleObject.indicesBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // enable texture coordinates from the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
  gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // enable the texture mapping
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObject0);
  gl.uniform1i(ctx.uSamplerId, 0);

  gl.uniform4f(ctx.uColorId, 1, 0, 0, 1);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  gl.bindTexture(gl.TEXTURE_2D, null);
}

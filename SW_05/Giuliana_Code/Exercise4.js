//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object with the name ctx (for context)
var ctx = {
    shaderProgram: -1,
    vertPosition: -1,
    vertColor: -1,
    aVertexTexCoordId: -1,
    aVertexNormalId: -1,
    uProjectionMatId: -1,
    uNormalViewMatId: -1,
    uModelMatId: -1,
    worldMatrix: -1,
    viewMatrix: -1,
    uSamplerId: -1,
    projMatrix: -1,
    uEnableTextureId: -1,
    uEnableLightingId: -1,
    uLightPositionId: -1,
    uLightColorId: -1,
};

var cubes = {
    wireFrameCube: -1,
    solidCube: -1
};

var lennaTex = {
    texture: {}
};

var canvas;


/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');

    setUpAttributesAndUniforms();
    setUpBuffers();
    loadTexture();
    // set the clear color here
    gl.clearColor(0, 0, 0, 1);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // add more necessary commands here
}

function loadTexture() {
    var image = new Image();
    lennaTex.texture = gl.createTexture();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, lennaTex.texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        draw();
    };
    image.src = "lena512.png";
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";
    ctx.vertPosition = gl.getAttribLocation(ctx.shaderProgram, "vertPosition");
    ctx.vertColor = gl.getAttribLocation(ctx.shaderProgram, "vertColor");
    ctx.aVertexTexCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");

    ctx.matWorldUniformLocation = gl.getUniformLocation(ctx.shaderProgram, 'uWorldMat');
    ctx.matViewUniformLocation = gl.getUniformLocation(ctx.shaderProgram, 'mView');
    ctx.matProjUniformLocation = gl.getUniformLocation(ctx.shaderProgram, 'mProj');
    ctx.uNormalViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uNormalViewMat");

    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");

    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split into one file per object.
 */
function setUpBuffers() {
    "use strict";
    cubes.wireFrameCube = new WireFrameCube(gl, [1.0, 1.0, 1.0, 0.5]);
    cubes.solidCube = new SolidCube(gl,
        [2.0, 1.0, 1.0, 0.5],
        [2.0, 1.0, 1.0, 0.5],
        [2.0, 1.0, 1.0, 0.5],
        [2.0, 1.0, 1.0, 0.5],
        [2.0, 1.0, 1.0, 0.5],
        [2.0, 1.0, 1.0, 0.5]);

    var worldMatrix = mat4.create();
    mat4.identity(worldMatrix);

    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0, 0, -4], [0, 0, 0], [0, 1, 0]);

    var normalViewMat = mat3.create();
    mat3.normalFromMat4(normalViewMat, viewMatrix);

    var projMatrix = mat4.create();
    mat4.perspective(projMatrix, glMatrix.toRadian(45), 4 / 3, 0.1, 1000);
    gl.uniformMatrix4fv(ctx.matViewUniformLocation, false, viewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalViewMatId, false, normalViewMat);
    gl.uniformMatrix4fv(ctx.matProjUniformLocation, false, projMatrix);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    var worldMatrix = new Float32Array(16);
    var identityMatrix = new Float32Array(16);
    var xRotation = new Float32Array(16);
    var yRotation = new Float32Array(16);

    mat4.identity(worldMatrix);
    mat4.identity(identityMatrix);
    mat4.identity(xRotation);
    mat4.identity(yRotation);

    gl.uniform1i(ctx.uEnableTextureId, 0);
    gl.uniform1i(ctx.uSamplerId, 0);

    gl.uniform1i(ctx.uEnableLightingId, 1);
    gl.uniform3fv(ctx.uLightPositionId, [20, 20, 0]);
    gl.uniform3fv(ctx.uLightColorId, [1.0, 1.0, 1.0]);

    var angle;
    var loop = function () {
        console.log("loop");
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;

        // rotate
        mat4.rotate(xRotation, identityMatrix, angle, [0, 1, 0]);
        mat4.rotate(yRotation, identityMatrix, angle / 4, [0, 0, 1]);
        mat4.mul(worldMatrix, xRotation, yRotation);
        gl.uniformMatrix4fv(ctx.matWorldUniformLocation, false, worldMatrix);

        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.bindTexture(gl.TEXTURE_2D, lennaTex.texture);
        gl.activeTexture(gl.TEXTURE0);

        cubes.wireFrameCube.draw(gl, ctx.vertPosition, ctx.vertColor);
        cubes.solidCube.draw(gl, ctx.vertPosition, ctx.vertColor, ctx.aVertexTexCoordId, ctx.aVertexNormalId);
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    console.log("done");
}


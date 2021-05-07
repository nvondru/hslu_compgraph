import { loadImage } from "../lib/webgl-utils.js";

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
/** @type {WebGLRenderingContext} */
let gl;

// we keep all local parameters for the program in a single object
const ctx = {
    /** @type {WebGLProgram} */
    shaderProgram: -1,
};

const sceneObject = {
    /** @type {WebGLBuffer} */
    positionBuffer: -1,
    /** @type {WebGLBuffer} */
    texturePositionBuffer: -1,
    /** @type {WebGLBuffer} */
    indexBuffer: -1,
    /** @type {WebGLTexture} */
    texture: -1
};

const locations = {
    /** @type {WebGLUniformLocation} */
    image: -1
};

/**
 * Startup function to be called when the body is loaded
 */
async function startup() {
    const canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    await initGL();

    requestAnimationFrame(draw);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
async function initGL() {
    ctx.shaderProgram = loadAndCompileShaders(gl, "VertexShader.glsl", "FragmentShader.glsl");
    setUpBuffers();
    await setUpTextures();

    // set the clear color here
    gl.clearColor(0.5, 0.5, 0.5, 1);
}

async function setUpTextures() {
    locations.image = gl.getUniformLocation(ctx.shaderProgram, "image");

    const image = await loadImage("./img.jpg");
    
    sceneObject.texture = gl.createTexture();
    bufferTexture(sceneObject.texture, image);
}

function bufferTexture(/** @type {WebGLTexture} */ texture, /** @type {HTMLImageElement} */ image) {
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
    const vertices = [
        -1, -1, 0,
        0, -1, 0,
        -0.5, 1, 0,
        1, -1, 0,
        0.5, 1, 0,
    ];
    const texturePositions = [
        0, 0,
        0.5, 0,
        0.25, 1,
        1, 0,
        0.75, 1,
    ];
    sceneObject.positionBuffer = bufferDataToAttribute(new Float32Array(vertices), 3, "vertexPosition", gl.FLOAT);
    sceneObject.texturePositionBuffer = bufferDataToAttribute(new Float32Array(texturePositions), 2, "texturePosition", gl.FLOAT);

    const indices = [
        0, 1, 2,
        1, 3, 4,
    ];
    sceneObject.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sceneObject.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
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

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return buffer;
}

/**
 * Draw the scene.
 */
function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (sceneObject.texture !== -1) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sceneObject.texture);
        gl.uniform1i(locations.image, 0);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sceneObject.indexBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    //requestAnimationFrame(draw);
}
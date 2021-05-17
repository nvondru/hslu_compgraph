/**
 *
 * Define a solid cube with methods for drawing it.
 *
 * @param gl
 * @param backColor
 * @param frontColor
 * @param rightColor
 * @param leftColor
 * @param topColor
 * @param bottomColor
 * @returns object with draw method
 * @constructor
 */
function SolidCube(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
    function defineVertices(gl) {
        // define the vertices of the cube
        var vertices = [
            // Top
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,

            // Left
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,

            // Right
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,

            // Front
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,

            // Back
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,

            // Bottom
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
        ];
        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineSides(gl) {
        // define the edges for the cube, there are 12 edges in a cube
        var vertexIndices = [
            // Top
            0, 1, 2,
            0, 2, 3,

            // Left
            5, 4, 6,
            6, 4, 7,

            // Right
            8, 9, 10,
            8, 10, 11,

            // Front
            13, 12, 14,
            15, 14, 12,

            // Back
            16, 17, 18,
            16, 18, 19,

            // Bottom
            21, 20, 22,
            22, 20, 23
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

        return buffer;
    }

    function defineColors(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
        // make 4 entries, one for each vertex
        var backSide = backColor.concat(backColor, backColor, backColor);
        var frontSide = frontColor.concat(frontColor, frontColor, frontColor);
        var rightSide = rightColor.concat(rightColor, rightColor, rightColor);
        var leftSide = leftColor.concat(leftColor, leftColor, leftColor);
        var topSide = topColor.concat(topColor, topColor, topColor);
        var bottomSide = bottomColor.concat(bottomColor, bottomColor, bottomColor);
        var allSides = backSide.concat(frontSide, rightSide, leftSide, topSide, bottomSide);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSides), gl.STATIC_DRAW);
        return buffer;
    }

    function defineTextureCoord(gl) {
        var textureCoords = [
            0.0,  0.0,              // back
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        return buffer;
    }

    function defineNormals(gl) {
        var backNormal = [0.0, 0.0, -1.0];
        var frontNormal = [0.0, 0.0, 1.0];
        var rightNormal = [1.0, 0.0, 0.0];
        var leftNormal = [-1.0, 0.0, 0.0];
        var topNormal = [0.0, 1.0, 0.0];
        var bottomNormal = [0.0, -1.0, 0.0];

        // make 4 entries, one for each vertex
        var backSideNormal    = backNormal.concat(backNormal, backNormal, backNormal);
        var frontSideNormal   = frontNormal.concat(frontNormal, frontNormal, frontNormal);
        var rightSideNormal   = rightNormal.concat(rightNormal, rightNormal, rightNormal);
        var leftSideNormal    = leftNormal.concat(leftNormal, leftNormal, leftNormal);
        var topSideNormal     = topNormal.concat(topNormal, topNormal, topNormal);
        var bottomSideNormal  = bottomNormal.concat(bottomNormal, bottomNormal, bottomNormal);
        var allSidesNormal = backSideNormal.concat(frontSideNormal, rightSideNormal, leftSideNormal, topSideNormal, bottomSideNormal);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSidesNormal), gl.STATIC_DRAW);
        return buffer;
    }


    return {
        bufferVertices: defineVertices(gl),
        bufferSides: defineSides(gl),
        bufferColors: defineColors(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor),
        bufferNormals: defineNormals(gl),
        bufferTextureCoords: defineTextureCoord(gl),

        draw: function(gl, aVertexPositionId, aVertexColorId, aVertexTextureCoordId, aVertexNormalId) {
            // position
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            // color buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
            gl.vertexAttribPointer(aVertexColorId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexColorId);

            // texture coordinates
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferTextureCoords);
            gl.vertexAttribPointer(aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexTextureCoordId);

            // normal
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
            gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexNormalId);

            // bind the element array
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferSides);
            gl.drawElements(gl.TRIANGLES, 36 ,gl.UNSIGNED_SHORT, 0);

            // disable all attributes
            gl.disableVertexAttribArray(aVertexPositionId);
            gl.disableVertexAttribArray(aVertexColorId);
            gl.disableVertexAttribArray(aVertexTextureCoordId);
            gl.disableVertexAttribArray(aVertexNormalId);
        }
    }
}
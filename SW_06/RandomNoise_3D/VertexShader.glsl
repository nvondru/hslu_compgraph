attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aVertexTextureCoord;
attribute vec3 aVertexNormal;


uniform mat4 uProjectionMat;
uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat3 uNormalMat;

varying vec3 vColor;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;
varying vec2 vTextureCoord;

void main() {
    vec4 vertexPositionEye4 = uViewMat * uModelMat * vec4(aVertexPosition, 1);
    vVertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

    vNormalEye = normalize(uNormalMat * aVertexNormal);

    vTextureCoord = aVertexTextureCoord;

    vColor = aVertexColor;
    gl_Position = uProjectionMat * vertexPositionEye4;
}
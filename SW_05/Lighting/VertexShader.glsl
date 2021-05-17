attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aVertexTextureCoord;
attribute vec3 aVertexNormal;


uniform mat4 uProjectionMat;
uniform mat4 uModelMat;
uniform mat4 uViewMat;



varying vec4 vColor;

void main() {
    vColor = vec4(aVertexColor, 1);
     gl_Position = uProjectionMat * uViewMat * uModelMat * vec4(aVertexPosition, 1);
}
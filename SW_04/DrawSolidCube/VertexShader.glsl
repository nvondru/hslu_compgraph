attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
uniform mat4 uProjectionMat;
uniform mat4 uModelMat;
uniform mat4 uViewMat;


varying vec4 vColor;

void main() {
    vColor = aVertexColor;
    gl_Position = uProjectionMat * uViewMat * uModelMat * vec4(aVertexPosition, 1);
}
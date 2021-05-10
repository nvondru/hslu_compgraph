attribute vec3 aVertexPosition;
uniform mat4 uProjectionMat;
uniform mat4 uModelMat;
uniform mat4 uViewMat;

void main() {
    gl_Position = uProjectionMat * uViewMat * uModelMat * vec4(aVertexPosition, 1);
}
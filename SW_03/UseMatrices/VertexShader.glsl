attribute vec2 aVertexPosition;

uniform mat3 uProjectionMatrix;
uniform mat3 uModelMatrix;

void main() {
    // position = viewport * model * position
    gl_Position = vec4(uProjectionMatrix * uModelMatrix * vec3(aVertexPosition, 0), 1);
}
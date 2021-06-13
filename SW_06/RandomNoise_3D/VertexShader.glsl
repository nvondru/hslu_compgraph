attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aVertexTextureCoord;
attribute vec3 aVertexNormal;

uniform float uCurrentTime;
uniform mat4 uProjectionMat;
uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat3 uNormalMat;
uniform float uScale;

varying vec3 vColor;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;
varying vec2 vTextureCoord;
varying float vTimeMap;
varying float vScale;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(22.9898,78.233)))*
        uCurrentTime);
}

void main() {

    vec2 st = aVertexTextureCoord.xy;       
    st = floor(st);
    float rnd = random(st);

    vec4 vertexPositionEye4 = uViewMat * uModelMat * vec4(aVertexPosition.x, aVertexPosition.y, aVertexPosition.z, 1);
    vVertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

    vNormalEye = normalize(uNormalMat * aVertexNormal);

    vTextureCoord = aVertexTextureCoord;

    vColor = aVertexColor;
    vTimeMap = uCurrentTime;
    vScale = uScale;
    gl_Position = uProjectionMat * vertexPositionEye4;
}
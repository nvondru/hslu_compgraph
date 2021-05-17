attribute vec3 vertPosition;
attribute vec3 vertColor;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTextureCoord;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat3 uNormalMatrix;
uniform mat4 uWorldMat;

varying vec3 fragColor;
varying vec2 vTexCoord;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

void main () {
    //  calculate  the  vertex  position  in eye  coordinates
    vec4  vertexPositionEye4 = mView * uWorldMat * vec4(vertPosition , 1.0);
    vVertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

    //  calculate  the  normal  vector  in eye  coordinates
    vNormalEye = normalize(uNormalMatrix * aVertexNormal);

    // set  texture  coordinates  for  fragment  shader
    vTexCoord = aVertexTextureCoord;

    // set  color  for  fragment  shader
    fragColor = vertColor;

    //  calculate  the  projected  position
    gl_Position = mProj * vertexPositionEye4;
}

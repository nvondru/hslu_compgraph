attribute vec2 vertexPosition;
attribute vec4 vertexColor;

varying vec4 vColor;


void main(void) {
  
   vColor = vertexColor;
   gl_Position = vec4(vertexPosition, 0.0, 1.0);
}

precision mediump float;
varying vec4 vColor;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(22.9898,78.233)))*
        43.543123);
}

void main() {
    vec2 st = gl_FragCoord.xy;
    float rnd = random(st);
    gl_FragColor = vec4(vec3(rnd), 1.0) + vColor;
}
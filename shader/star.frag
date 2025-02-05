
precision mediump float;

varying float w_magnitude;
varying vec3 w_color;

void main() {
    float m = smoothstep(7., 3., w_magnitude);
    gl_FragColor = vec4(m, m, m, 1) * vec4(w_color, 1.);
}

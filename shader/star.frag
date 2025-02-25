
precision mediump float;

varying float w_magnitude;

void main() {
    float m = smoothstep(7., 3., w_magnitude);
    m = 1.;
    gl_FragColor = vec4(m, m, m, 1);
}

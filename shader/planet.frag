
precision mediump float;

varying vec2 v_uv;
varying vec3 v_color;

void main() {
    float dist = distance(v_uv, vec2(0.5));
    if (dist > 0.5) discard;
    
    gl_FragColor = vec4(v_color, 1.0);
}

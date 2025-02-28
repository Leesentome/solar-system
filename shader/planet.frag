
precision mediump float;

varying vec2 v_uv;
varying vec3 v_color;

void main() {
    float dist = length(v_uv);
    if (dist > 1.) discard;
    
    gl_FragColor = vec4(v_color, 1.0);
}

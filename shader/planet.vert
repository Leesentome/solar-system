
attribute vec3 a_position;
attribute vec2 a_offset;
attribute float a_size;
attribute vec3 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform vec3 u_camRight;
uniform vec3 u_camUp;

varying vec2 v_uv;
varying vec3 v_color;

void main() {
    vec3 worldPos = a_position 
                  + (a_offset.x * a_size * u_camRight * 1000.)
                  + (a_offset.y * a_size * u_camUp * 1000.);

    v_uv = a_offset * 0.5 + 0.5;
    v_color = a_color;
    
    gl_Position = u_projection * u_view * vec4(worldPos, 1.0);
}

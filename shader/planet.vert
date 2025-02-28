
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
    float scale = 1.;
    vec3 worldPos = a_position 
                  + (a_offset.x * u_camRight * a_size * scale)
                  + (a_offset.y * u_camUp * a_size * scale);

    v_uv = a_offset;
    v_color = a_color;
    
    gl_Position = u_projection * u_view * vec4(worldPos, 1.0);
}

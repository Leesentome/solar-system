
attribute vec3 a_position;
attribute float a_magnitude;
attribute vec3 a_color;
attribute float a_size;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_earthCoord;

varying float w_magnitude;
varying vec3 w_color;

void main() {
    gl_Position = u_projection * u_view * vec4(a_position, 1.0);
    w_magnitude = a_magnitude;
    w_color = a_color;
    gl_PointSize = a_size;
}

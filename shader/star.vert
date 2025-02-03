
attribute vec3 a_position;
attribute float a_magnitude;

uniform mat4 u_projection;
uniform mat4 u_view;

varying float w_magnitude;

void main() {
    gl_Position = u_projection * u_view * vec4(a_position, 1.0);
    w_magnitude = a_magnitude;
    gl_PointSize = 3.;
}

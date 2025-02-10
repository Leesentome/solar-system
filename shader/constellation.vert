
attribute vec3 a_position;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_earthCoord;

void main() {
    gl_Position = u_projection * u_view * vec4(a_position, 1.0);
}

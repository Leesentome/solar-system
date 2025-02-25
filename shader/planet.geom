
layout(points) in;
layout(triangle_strip, max_vertices = 4) out;

uniform mat4 u_projection;
uniform mat4 u_view;

in float w_magnitude[];
in vec3 w_color[];

out vec2 v_texCoords;
out vec3 v_color;
out float v_magnitude;

void main() {
    vec4 center = gl_in[0].gl_Position;
    float size = gl_in[0].gl_PointSize;

    vec4 right = u_projection * vec4(size, 0, 0, 0);
    vec4 up = u_projection * vec4(0, size, 0, 0);

    v_color = w_color[0];
    v_magnitude = w_magnitude[0];

    // Bottom-left
    v_texCoords = vec2(-1.0, -1.0);
    gl_Position = center - right - up;
    EmitVertex();

    // Bottom-right
    v_texCoords = vec2(1.0, -1.0);
    gl_Position = center + right - up;
    EmitVertex();

    // Top-left
    v_texCoords = vec2(-1.0, 1.0);
    gl_Position = center - right + up;
    EmitVertex();

    // Top-right
    v_texCoords = vec2(1.0, 1.0);
    gl_Position = center + right + up;
    EmitVertex();

    EndPrimitive();
}

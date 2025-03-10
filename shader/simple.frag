
precision mediump float;

uniform vec4 u_cameraPos;
uniform vec4 u_lightPos;

varying vec4 w_Position;
varying vec3 v_normal;
varying vec3 v_color;

// #define ka 0.25
// #define kd 0.5
// #define ks 0.3
// #define alpha 3.

#define ka 0.
#define kd 0.
#define ks 0.8
#define alpha 3.

void main() {

    vec3 color = vec3(0);

    vec3 lightColor = vec3(1);

    vec3 L = normalize(u_lightPos.xyz - w_Position.xyz);
    vec3 N = normalize(v_normal);
    vec3 R = 2.*dot(L, N)*N - L;
    vec3 V = normalize(u_cameraPos - w_Position).xyz;
    color = v_color * (ka * lightColor + kd * max(0., dot(L, N)) * lightColor + ks * pow(max(0., dot(R, V)), alpha) * vec3(1, 0, 0));

    color *= exp(-0.1*length(w_Position - u_cameraPos));

    gl_FragColor = vec4(color, 1);
}


class ShaderProgram {
    constructor(gl, name) {
        this.gl = gl;
        this.name = name;
    }

    async loadShaderSource(url) {
        try {
            const response = await fetch(url);
            return response.text();
        } catch (error) {
            console.error(`Failed to load shader source from ${url}.`, error);
            return null;
        }
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(`Shader compilation error: ${this.gl.getShaderInfoLog(shader)}`);
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    async init() {
        const vertexShaderSource = await this.loadShaderSource('./shader/' + this.name + '.vert');
        const fragmentShaderSource = await this.loadShaderSource('./shader/' + this.name + '.frag');

        if (!vertexShaderSource || !fragmentShaderSource) {
            console.error("Failed to load shader sources.");
            return;
        }

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) {
            console.error("Failed to compile shaders.");
            return;
        }

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error(`Program linking error: ${this.gl.getProgramInfoLog(this.program)}`);
            return;
        }
    }

    use() {
        this.gl.useProgram(this.program);
    }
}

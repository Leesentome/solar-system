
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

class AllStar {
    constructor(gl, shaderProgram, stars) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.shaderProgram.use();

        this.stars = stars

        this.vertices = new Float32Array(
            stars.flatMap(star => star.get_pos())
        )

        this.magnitudes = new Float32Array(
            stars.map(star => star.magn_app)
        )

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")

        this.magnitudeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.magnitudes, this.gl.STATIC_DRAW);

        this.magnitudeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_magnitude");

    }

    draw() {
        this.shaderProgram.use();

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer);
        this.gl.vertexAttribPointer(this.magnitudeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.magnitudeAttributeLocation);

        this.gl.drawArrays(this.gl.POINTS, 0, this.stars.length);
    }
}

class ConstellationDraw {
    constructor(gl, shaderProgram, constellation) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.shaderProgram.use();

        this.constellation = constellation;

        this.vertices = [];
        
        for (var line of constellation.lines) {
            var s1 = line[0];
            var s2 = line[1];

            this.vertices = this.vertices.concat(s1.get_pos());
            this.vertices = this.vertices.concat(s2.get_pos());
        }

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")
    }

    draw() {
        this.shaderProgram.use();

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.gl.drawArrays(this.gl.LINES, 0, 2 * this.constellation.lines.length);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const canvas = document.getElementById("paintCanvas");
    const resolutionMultiplier = 1;
    
    canvas.width = canvas.clientWidth * resolutionMultiplier;
    canvas.height = canvas.clientHeight * resolutionMultiplier;

    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.log("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }

    const ext = gl.getExtension("WEBGL_depth_texture");

    const starProgram = new ShaderProgram(gl, 'star');
    await starProgram.init();

    const constellationProgram = new ShaderProgram(gl, 'constellation');
    await constellationProgram.init();

    const allStars = new AllStar(gl, starProgram, stars);

    const constelDraws = []
    for (var constel of constellations) {
        constelDraws.push(new ConstellationDraw(gl, constellationProgram, constel));
    }

    starProgram.use();

    // Clear the canvas and setup the initial env
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing for 3D rendering
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Set up the perspective matrix
    const projectionMatrix = mat4.create();
    const aspectRatio = canvas.width / canvas.height;
    const viewAngleVer = Math.PI / 3
    mat4.perspective(projectionMatrix, viewAngleVer, aspectRatio, 0.1, 2.0);
    
    const viewMatrix = mat4.create();
    const eye = [0, 0, 0];
    let yaw = 0;
    let pitch = 0;
    function computeViewMatrix() {
        let dir = [
            Math.cos(pitch) * Math.sin(yaw),
            Math.sin(pitch),
            -Math.cos(pitch) * Math.cos(yaw)
        ];
        let target = [eye[0] + dir[0], eye[1] + dir[1], eye[2] + dir[2]];
        const up = [0, 1, 0];
        mat4.lookAt(viewMatrix, eye, target, up);
        
        gl.useProgram(starProgram.program);
        gl.uniformMatrix4fv(gl.getUniformLocation(starProgram.program, "u_view"), false, viewMatrix);
        gl.useProgram(constellationProgram.program);
        gl.uniformMatrix4fv(gl.getUniformLocation(constellationProgram.program, "u_view"), false, viewMatrix);
    }
    computeViewMatrix();

    // Pass the uniform to the main shader
    gl.useProgram(starProgram.program);
    const uStarProjection = gl.getUniformLocation(starProgram.program, "u_projection");
    gl.uniformMatrix4fv(uStarProjection, false, projectionMatrix);
    const uStarView = gl.getUniformLocation(starProgram.program, "u_view");
    gl.uniformMatrix4fv(uStarView, false, viewMatrix);

    gl.useProgram(constellationProgram.program);
    const uConstelProjection = gl.getUniformLocation(constellationProgram.program, "u_projection");
    gl.uniformMatrix4fv(uConstelProjection, false, projectionMatrix);
    const uConstelView = gl.getUniformLocation(constellationProgram.program, "u_view");
    gl.uniformMatrix4fv(uConstelView, false, viewMatrix);

    starProgram.use();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Drawer
    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // console.log("Drawing", this.stars.length, "stars");
        allStars.draw();
        for (var constel of constelDraws) {
            constel.draw()
        }
    }

    // For window resizing
    function handleResize() {
        // Update the canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Update the viewport size
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Recalculate the perspective matrix
        const newAspectRatio = canvas.width / canvas.height;
        mat4.perspective(projectionMatrix, Math.PI / 4, newAspectRatio, 0.1, 100.0);

        // Pass the updated matrix to the shader
        starProgram.use()
        gl.uniformMatrix4fv(uStarProjection, false, projectionMatrix);
        constellationProgram.use()
        gl.uniformMatrix4fv(uConstelProjection, false, projectionMatrix);

        // Redraw the scene
        drawScene();
    }
    window.addEventListener("resize", handleResize);

    let isDragging = false;
    let lastX, lastY;

    canvas.addEventListener("mousedown", (event) => {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    });

    canvas.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        let deltaX = event.clientX - lastX;
        let deltaY = event.clientY - lastY;
        lastX = event.clientX;
        lastY = event.clientY;

        yaw -= deltaX * 0.005;
        pitch += deltaY * 0.005;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

        computeViewMatrix();
        drawScene()
    });

    canvas.addEventListener("mouseup", () => {
        isDragging = false;
        drawScene()
    });

    drawScene();
});
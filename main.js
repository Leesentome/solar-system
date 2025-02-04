
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

class AllPlanet {
    // constructor(gl, shaderProgram, planets, ref) {
    //     this.gl = gl;
    //     this.shaderProgram = shaderProgram;

    //     this.shaderProgram.use();

    //     this.planets = planets
    //     this.ref = ref

        // this.vertices = new Float32Array(
        //     planets.flatMap(planets => planets.get_pos() - ref.getpos())
        // )

        // this.magnitudes = new Float32Array(
        //     planets.map(planets => planets.magn_app)
        // )

        // this.vertexBuffer = this.gl.createBuffer();
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        // this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")

        // this.magnitudeBuffer = this.gl.createBuffer();
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer);
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, this.magnitudes, this.gl.STATIC_DRAW);

        // this.magnitudeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_magnitude");

    // }

    // draw() {
    //     this.shaderProgram.use();

    //     // Bind position buffer
    //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    //     this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
    //     this.gl.enableVertexAttribArray(this.positionAttributeLocation);

    //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer);
    //     this.gl.vertexAttribPointer(this.magnitudeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
    //     this.gl.enableVertexAttribArray(this.magnitudeAttributeLocation);

    //     this.gl.drawArrays(this.gl.POINTS, 0, this.stars.length);
    // }
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

class Ground {
    constructor(gl, shaderProgram, up) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.shaderProgram.use();
        
        this.model = mat4.create();
        // mat4.translate(this.model, this.model, [0, 0, -3]);
        this.uModel = this.gl.getUniformLocation(this.shaderProgram.program, "u_model");
        this.gl.uniformMatrix4fv(this.uModel, false, this.model);

        this.up = up;

        this.vertices = [
            0, 0, 0
        ];
        this.normals = [
            ...this.up
        ]
        this.colors = [
            1, 1, 1
        ]

        this.pt = 10;
        this.rad = 10;
        for (var i = 0; i < this.pt; i++) {
            this.vertices = this.vertices.concat([this.rad * Math.cos(Math.PI * 2 * i / (this.pt - 1)), 0, this.rad * -Math.sin(Math.PI * 2 * i / (this.pt - 1))])
            this.normals = this.normals.concat(this.up);
            this.colors = this.colors.concat([1, 1, 1]);
        }

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);

        this.normalAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_normal");

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);

        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_color");
    }

    draw() {
        this.shaderProgram.use();

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        
        // Bind normal buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.vertexAttribPointer(this.normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.normalAttributeLocation);
        
        // Bind color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.pt + 1);
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

    // DEFINE PROGRAMS

    const starProgram = new ShaderProgram(gl, 'star');
    await starProgram.init();

    const constellationProgram = new ShaderProgram(gl, 'constellation');
    await constellationProgram.init();

    const simpleProgram = new ShaderProgram(gl, 'simple');
    await simpleProgram.init();

    // DEFINE OBJECT
    const allStars = new AllStar(gl, starProgram, stars);

    const constelDraws = []
    for (var constel of constellations) {
        constelDraws.push(new ConstellationDraw(gl, constellationProgram, constel));
    }

    const ground = new Ground(gl, simpleProgram, [0, 1, 0]);
    const lightPos = [0, 10, 0];

    const long = 0;
    const lat = 0;
    const up = [1, 0, 0];

    // INIT ENV
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // PERSPCTIVE / VIEW
    const projectionMatrix = mat4.create();
    const aspectRatio = canvas.width / canvas.height;
    const viewAngleVer = Math.PI / 3
    mat4.perspective(projectionMatrix, viewAngleVer, aspectRatio, 0.1, 20.0);
    
    const viewMatrix = mat4.create();
    const eye = [0, 0.2, 0];
    let yaw = 0;
    let pitch = 0;
    function computeViewMatrix() {
        let dir = [
            Math.cos(pitch) * Math.sin(yaw),
            Math.sin(pitch),
            -Math.cos(pitch) * Math.cos(yaw)
        ];
        let target = [eye[0] + dir[0], eye[1] + dir[1], eye[2] + dir[2]];
        mat4.lookAt(viewMatrix, eye, target, up);
        
        gl.useProgram(starProgram.program);
        gl.uniformMatrix4fv(gl.getUniformLocation(starProgram.program, "u_view"), false, viewMatrix);
        gl.useProgram(constellationProgram.program);
        gl.uniformMatrix4fv(gl.getUniformLocation(constellationProgram.program, "u_view"), false, viewMatrix);
        gl.useProgram(simpleProgram.program);
        gl.uniformMatrix4fv(gl.getUniformLocation(simpleProgram.program, "u_view"), false, viewMatrix);
    }
    computeViewMatrix();

    // UNIFORMS
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

    gl.useProgram(simpleProgram.program);
    const uSimpleProjection = gl.getUniformLocation(simpleProgram.program, "u_projection");
    gl.uniformMatrix4fv(uSimpleProjection, false, projectionMatrix);
    const uSimpleView = gl.getUniformLocation(simpleProgram.program, "u_view");
    gl.uniformMatrix4fv(uSimpleView, false, viewMatrix);
    const uSimpleCameraPos = gl.getUniformLocation(simpleProgram.program, "u_cameraPos");
    gl.uniform4fv(uSimpleCameraPos, new Float32Array(eye.concat([1])));
    const uSimpleLightPos = gl.getUniformLocation(simpleProgram.program, "u_lightPos");
    gl.uniform4fv(uSimpleLightPos, new Float32Array(lightPos.concat([1])));

    // DRAW LOOP
    function drawScene() {
        // FAR
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        allStars.draw();
        for (var constel of constelDraws) {
            constel.draw()
        }

        gl.clear(gl.DEPTH_BUFFER_BIT);

        // CLOSE
        ground.draw();
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
        simpleProgram.use()
        gl.uniformMatrix4fv(uSimpleProjection, false, projectionMatrix);

        // Redraw the scene
        drawScene();
    }
    window.addEventListener("resize", handleResize);

   // MOVE CAM 
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

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

        this.sizes = new Float32Array(
            stars.map(star => 3)
        )

        this.colors = new Float32Array(
            stars.flatMap(star => [1, 1, 1])
        )

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")

        this.magnitudeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.magnitudes, this.gl.STATIC_DRAW);

        this.magnitudeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_magnitude");

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);

        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_color");

        this.sizeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.sizes, this.gl.STATIC_DRAW);

        this.sizeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_size");

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

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.vertexAttribPointer(this.sizeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.sizeAttributeLocation);

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

class AllPlanet {
    constructor(gl, shaderProgram, planets, ref) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.shaderProgram.use();

        this.planets = planets
        this.ref = ref

        this.vertices = new Float32Array(
            planets.flatMap(planet => {
                let [px, py, pz] = planet.get_pos(2000, 1, 1, 0, 0, 0);
                let [rx, ry, rz] = ref.get_pos(2000, 1, 1, 0, 0, 0);
                return [px - rx, py - ry, pz - rz];
            })
        );

        this.magnitudes = new Float32Array(
            planets.map(planet => 0.)
        )

        this.colors = new Float32Array(
            planets.flatMap(planet => planet.color)
        )

        this.sizes = new Float32Array(
            planets.map(planet => 8)
        )

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")

        this.magnitudeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.magnitudes, this.gl.STATIC_DRAW);

        this.magnitudeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_magnitude");

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);

        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_color");

        this.sizeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.sizes, this.gl.STATIC_DRAW);

        this.sizeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_size");

    }

    draw() {
        this.shaderProgram.use();

        let now = new Date();
        let year = now.getUTCFullYear();
        let month = now.getUTCMonth() + 1; // Months are 0-based in JS
        let day = now.getUTCDate();
        let hour = now.getUTCHours();
        let minute = now.getUTCMinutes();
        let second = now.getUTCSeconds();

        this.vertices = new Float32Array(
            this.planets.flatMap(planet => {
                let [px, py, pz] = planet.get_pos(year, month, day, hour, minute, second);
                let [rx, ry, rz] = this.ref.get_pos(year, month, day, hour, minute, second);
                const dir = [px - rx, py - ry, pz - rz]
                const nDir = Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1]+dir[2]*dir[2]);
                return [dir[0] / nDir, dir[1] / nDir, dir[2] / nDir];
            })
        );

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);

        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer);
        this.gl.vertexAttribPointer(this.magnitudeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.magnitudeAttributeLocation);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.vertexAttribPointer(this.sizeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.sizeAttributeLocation);

        this.gl.drawArrays(this.gl.POINTS, 0, this.planets.length);
    }
}

class Sun {
    constructor(gl, shaderProgram, ref) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.shaderProgram.use();

        this.ref = ref

        let [px, py, pz] = [0, 0, 0];
        let [rx, ry, rz] = ref.get_pos(2000, 1, 1, 0, 0, 0);
        const dir = [px - rx, py - ry, pz - rz]
        const nDir = Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1]+dir[2]*dir[2]);
        this.vertices = new Float32Array([dir[0] / nDir, dir[1] / nDir, dir[2] / nDir]);

        this.magnitudes = new Float32Array([0]);

        this.colors = new Float32Array([1, 1, 0]);

        this.sizes = new Float32Array([8.])

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")

        this.magnitudeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.magnitudes, this.gl.STATIC_DRAW);

        this.magnitudeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_magnitude");

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);

        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_color");

        this.sizeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.sizes, this.gl.STATIC_DRAW);

        this.sizeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_size");

    }

    draw() {
        this.shaderProgram.use();

        let now = new Date();
        let year = now.getUTCFullYear();
        let month = now.getUTCMonth() + 1; // Months are 0-based in JS
        let day = now.getUTCDate();
        let hour = now.getUTCHours();
        let minute = now.getUTCMinutes();
        let second = now.getUTCSeconds();

        
        let [px, py, pz] = [0, 0, 0];
        let [rx, ry, rz] = this.ref.get_pos(year, month, day, hour, minute, second);
        const dir = [px - rx, py - ry, pz - rz]
        const nDir = Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1]+dir[2]*dir[2]);
        this.vertices = new Float32Array([dir[0] / nDir, dir[1] / nDir, dir[2] / nDir]);

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);

        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer);
        this.gl.vertexAttribPointer(this.magnitudeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.magnitudeAttributeLocation);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.vertexAttribPointer(this.sizeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.sizeAttributeLocation);

        this.gl.drawArrays(this.gl.POINTS, 0, 1);
    }
}

class Ground {
    constructor(gl, shaderProgram, asc, decl) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.shaderProgram.use();

        this.asc = asc;
        this.decl = decl;

        this.model;

        this.vertices = [
            0, 0, 0
        ];
        this.normals = [
            0, 1, 0
        ]
        this.colors = [
            1, 1, 1
        ]

        this.pt = 10;
        this.rad = 10;
        for (var i = 0; i < this.pt; i++) {
            this.vertices = this.vertices.concat([this.rad * Math.cos(Math.PI * 2 * i / (this.pt - 1)), 0, this.rad * -Math.sin(Math.PI * 2 * i / (this.pt - 1))])
            this.normals = this.normals.concat([0, 1, 0]);
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
        
        this.uSimpleModel = this.gl.getUniformLocation(this.shaderProgram.program, "u_model");
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

        this.model = mat4.create();
        mat4.rotateY(this.model, this.model, deg2rad(this.asc));
        mat4.rotateZ(this.model, this.model, deg2rad(this.decl-90));
        this.gl.uniformMatrix4fv(this.uSimpleModel, false, this.model);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.pt + 1);
    }
}

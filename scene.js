
class AllStar {
    constructor(gl, shaderProgram, stars) {
        this.gl = gl
        this.shaderProgram = shaderProgram

        this.shaderProgram.use()

        this.stars = stars

        this.vertices = new Float32Array(
            stars.flatMap(star => star.get_pos())
        )

        this.magnitudes = new Float32Array(
            stars.map(star => star.magn_app)
        )

        this.vertexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW)

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")

        this.magnitudeBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.magnitudes, this.gl.STATIC_DRAW)

        this.magnitudeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_magnitude")
    }

    draw() {
        this.shaderProgram.use()

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.positionAttributeLocation)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.magnitudeBuffer)
        this.gl.vertexAttribPointer(this.magnitudeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.magnitudeAttributeLocation)

        this.gl.drawArrays(this.gl.POINTS, 0, this.stars.length)
    }
}

class ConstellationDraw {
    constructor(gl, shaderProgram, constellation) {
        this.gl = gl
        this.shaderProgram = shaderProgram

        this.shaderProgram.use()

        this.constellation = constellation

        this.vertices = []
        
        for (var line of constellation.lines) {
            var s1 = line[0]
            var s2 = line[1]

            this.vertices = this.vertices.concat(s1.get_pos())
            this.vertices = this.vertices.concat(s2.get_pos())
        }

        this.vertexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW)

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")
    }

    draw() {
        this.shaderProgram.use()

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.positionAttributeLocation)

        this.gl.drawArrays(this.gl.LINES, 0, 2 * this.constellation.lines.length)
    }
}

class AllPlanet {
    constructor(gl, shaderProgram, planets, ref) {
        this.gl = gl
        this.shaderProgram = shaderProgram

        this.shaderProgram.use()

        this.planets = planets
        this.ref = ref

        this.year = 2000
        this.month = 9
        this.day = 17
        this.hour = 0
        this.minute = 0
        this.second = 0

        this.vertices = new Float32Array(
            this.planets.flatMap(planet => {
                let [px, py, pz] = planet.get_pos(this.year, this.month, this.day, this.hour, this.minute, this.second)
                let [rx, ry, rz] = this.ref.get_pos(this.year, this.month, this.day, this.hour, this.minute, this.second)
                return Array(4).fill([px - rx, py - ry, pz - rz]).flat()
            })
        )

        const quadOffsets = [
            -1, -1,
             1, -1,
             1,  1,
            -1,  1,
        ]
        
        this.offsets = new Float32Array(
            this.planets.flatMap(() => quadOffsets)
        )

        this.colors = new Float32Array(
            planets.flatMap(planet => Array(4).fill(planet.color).flat())
        )

        this.sizes = new Float32Array(
            this.planets.flatMap(planet => [planet.size, planet.size, planet.size, planet.size])
        )

        const indices = []
        for (let i = 0; i < this.planets.length; i++) {
            let index = i * 4
            indices.push(index, index + 1, index + 2, index, index + 2, index + 3)
        }

        this.vertexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW)

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")

        this.offsetBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.offsetBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.offsets, this.gl.STATIC_DRAW)

        this.offsetAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_offset")

        this.sizeBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.sizes, this.gl.STATIC_DRAW)

        this.sizeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_size")

        this.colorBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW)

        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_color")

        this.indexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW)
    }

    setTime(year, month, day, hour, minute, second) {
        this.year = year
        this.month = month
        this.day = day
        this.hour = hour
        this.minute = minute
        this.second = second

        this.vertices = new Float32Array(
            this.planets.flatMap(planet => {
                let [px, py, pz] = planet.get_pos(this.year, this.month, this.day, this.hour, this.minute, this.second)
                let [rx, ry, rz] = this.ref.get_pos(this.year, this.month, this.day, this.hour, this.minute, this.second)
                return Array(4).fill([px - rx, py - ry, pz - rz]).flat()
            })
        )

        this.shaderProgram.use()

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.vertices)
    }

    draw() {
        this.shaderProgram.use()

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.positionAttributeLocation)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.offsetBuffer)
        this.gl.vertexAttribPointer(this.offsetAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.offsetAttributeLocation)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer)
        this.gl.vertexAttribPointer(this.sizeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.sizeAttributeLocation)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.colorAttributeLocation)

        this.gl.drawElements(this.gl.TRIANGLES, this.planets.length * 6, this.gl.UNSIGNED_SHORT, 0)
    }
}

class Ground {
    constructor(gl, shaderProgram, asc, decl) {
        this.gl = gl
        this.shaderProgram = shaderProgram

        this.shaderProgram.use()

        this.asc = asc
        this.decl = decl

        this.model

        this.vertices = [
            0, 0, 0
        ]
        this.normals = [
            0, 1, 0
        ]
        this.colors = [
            1, 1, 1
        ]

        this.pt = 10
        this.rad = 10
        for (var i = 0; i < this.pt; i++) {
            this.vertices = this.vertices.concat([this.rad * Math.cos(Math.PI * 2 * i / (this.pt - 1)), 0, this.rad * -Math.sin(Math.PI * 2 * i / (this.pt - 1))])
            this.normals = this.normals.concat([0, 1, 0])
            this.colors = this.colors.concat([1, 1, 1])
        }

        this.vertexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW)

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position")

        this.normalBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW)

        this.normalAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_normal")

        this.colorBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW)

        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_color")
        
        this.uSimpleModel = this.gl.getUniformLocation(this.shaderProgram.program, "u_model")
    }

    draw() {
        this.shaderProgram.use()

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.positionAttributeLocation)
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer)
        this.gl.vertexAttribPointer(this.normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.normalAttributeLocation)
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.colorAttributeLocation)

        this.model = mat4.create()
        mat4.rotateY(this.model, this.model, deg2rad(this.asc))
        mat4.rotateZ(this.model, this.model, deg2rad(this.decl-90))
        this.gl.uniformMatrix4fv(this.uSimpleModel, false, this.model)

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.pt + 1)
    }
}

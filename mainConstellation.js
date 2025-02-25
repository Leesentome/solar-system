
document.addEventListener("DOMContentLoaded", async function () {
    const canvas = document.getElementById("paintCanvas")
    const resolutionMultiplier = 1
    
    canvas.width = canvas.clientWidth * resolutionMultiplier
    canvas.height = canvas.clientHeight * resolutionMultiplier

    const gl = canvas.getContext("webgl2")

    if (!gl) {
        console.log("Unable to initialize WebGL. Your browser may not support it.")
        return
    }

    // DEFINE PROGRAMS

    const starProgram = new ShaderProgram(gl, 'star')
    await starProgram.init()

    const planetProgram = new ShaderProgram(gl, 'planet')
    await planetProgram.init()

    const constellationProgram = new ShaderProgram(gl, 'constellation')
    await constellationProgram.init()

    const simpleProgram = new ShaderProgram(gl, 'simple')
    await simpleProgram.init()

    const programs = [starProgram, planetProgram, constellationProgram, simpleProgram]

    // DEFINE OBJECT

    const allStars = new AllStar(gl, starProgram, stars)

    const filteredPlanets = planets.filter(planet => planet !== terre)
    const allPlanets = new AllPlanet(gl, planetProgram, filteredPlanets, terre)

    const constelDraws = []
    for (var constel of constellations) {
        constelDraws.push(new ConstellationDraw(gl, constellationProgram, constel))
    }
    let drawConstellation = true

    const ground = new Ground(gl, simpleProgram)
    let drawGround = true

    const lightPos = [0, 10, 0]

    // DEFINE TIME & POSITION
    
    const latInput = document.getElementById("latInput")
    const lonInput = document.getElementById("lonInput")

    const long = 4.66167
    const lat = 46.4321

    latInput.value = lat
    lonInput.value = long

    const timeInput = document.getElementById("timeInput")
    const dateInput = document.getElementById("dateInput")

    let now = new Date()

    const dateStr = now.toISOString().split("T")[0]
    dateInput.value = dateStr

    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")
    timeInput.value = `${hours}:${minutes}:${seconds}`

    let year = now.getUTCFullYear()
    let month = now.getUTCMonth() + 1
    let day = now.getUTCDate()
    let hour = now.getUTCHours()
    let minute = now.getUTCMinutes()
    let second = now.getUTCSeconds()
    let [asc, decl] = zenith_direction(lat, long, year, month, day, hour, minute, second)

    ground.asc = asc
    ground.decl = decl

    allPlanets.setTime(year, month, day, hour, minute, second)

    // INIT ENV
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // PERSPCTIVE / VIEW
    const projectionMatrix = mat4.create()
    const aspectRatio = canvas.width / canvas.height
    const viewAngleVer = Math.PI / 3
    mat4.perspective(projectionMatrix, viewAngleVer, aspectRatio, 0.1, 20.0)
    
    const viewMatrix = mat4.create()
    const eye = [0, 0.2, 0]
    let yaw = 0
    let pitch = 0
    function computeViewMatrix() {
        let dir = [
            Math.cos(pitch) * Math.cos(yaw),
            Math.sin(pitch),
            Math.cos(pitch) * Math.sin(yaw)
        ]
        let target = [eye[0] + dir[0], eye[1] + dir[1], eye[2] + dir[2]]
        mat4.lookAt(viewMatrix, eye, target, [0, 1, 0])

        mat4.rotateZ(viewMatrix, viewMatrix, deg2rad(90-decl))
        mat4.rotateY(viewMatrix, viewMatrix, deg2rad(-asc))
        
        for (let p of programs) {
            gl.useProgram(p.program)
            gl.uniformMatrix4fv(gl.getUniformLocation(p.program, "u_view"), false, viewMatrix)
        }

        const right = [viewMatrix[0], viewMatrix[4], viewMatrix[8]]
        const up = [viewMatrix[1], viewMatrix[5], viewMatrix[9]]

        
        gl.useProgram(planetProgram.program)
        gl.uniform3fv(gl.getUniformLocation(planetProgram.program, "u_camRight"), new Float32Array(right))
        gl.uniform3fv(gl.getUniformLocation(planetProgram.program, "u_camUp"), new Float32Array(up))
    }
    computeViewMatrix()

    // UNIFORMS
    for (let p of programs) {
        gl.useProgram(p.program)
        gl.uniformMatrix4fv(gl.getUniformLocation(p.program, "u_projection"), false, projectionMatrix)
    }

    gl.useProgram(simpleProgram.program)
    gl.uniform4fv(gl.getUniformLocation(simpleProgram.program, "u_cameraPos"), new Float32Array(eye.concat([1])))
    gl.uniform4fv(gl.getUniformLocation(simpleProgram.program, "u_lightPos"), new Float32Array(lightPos.concat([1])))

    // DRAW LOOP
    function drawScene() {
        // FAR
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        allStars.draw()
        
        if (drawConstellation) {
            for (var constel of constelDraws) {
                constel.draw()
            }
        }
        allPlanets.draw()

        gl.clear(gl.DEPTH_BUFFER_BIT)

        // CLOSE
        if (drawGround) ground.draw()
    }


    // HANLDERS
    document.getElementById("toggleGroundBtn").addEventListener("click", () => {
        drawGround = !drawGround
        drawScene()
    })

    document.getElementById("toggleConstellationBtn").addEventListener("click", () => {
        drawConstellation = !drawConstellation
        drawScene()
    })

    function handleInput() {
        const lat = Math.max(-90, Math.min(90, parseFloat(latInput.value)))
        const lon = Math.max(-180, Math.min(180, parseFloat(lonInput.value)))

        if (!isNaN(lat) && lat > -90 && lat < 90 && !isNaN(lon) && lon > -180 && lon < 180) {
            [asc, decl] = zenith_direction(lat, lon, year, month, day, hour, minute, second)
            computeViewMatrix()
            ground.asc = asc
            ground.decl = decl
            drawScene()
        }
    }
    latInput.addEventListener("input", handleInput)
    lonInput.addEventListener("input", handleInput)

    function handleTimeChange() {
        const dateParts = dateInput.value.split("-")
        if (dateParts.length === 3) {
            year = parseInt(dateParts[0])
            month = parseInt(dateParts[1])
            day = parseInt(dateParts[2])
        }

        const timeParts = timeInput.value.split(":")
        if (timeParts.length >= 2) {
            hour = parseInt(timeParts[0])
            minute = parseInt(timeParts[1])
            second = timeParts.length === 3 ? parseInt(timeParts[2]) : 0
        }

        [asc, decl] = zenith_direction(lat, long, year, month, day, hour, minute, second)
        computeViewMatrix()
        ground.asc = asc
        ground.decl = decl

        allPlanets.setTime(year, month, day, hour, minute, second)

        drawScene()
    }
    timeInput.addEventListener("input", handleTimeChange)
    dateInput.addEventListener("input", handleTimeChange)


    function handleResize() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        gl.viewport(0, 0, canvas.width, canvas.height)

        const newAspectRatio = canvas.width / canvas.height
        mat4.perspective(projectionMatrix, Math.PI / 4, newAspectRatio, 0.1, 100.0)

        for (let p of programs) {
            p.use()
            gl.uniformMatrix4fv(gl.getUniformLocation(p.program, "u_projection"), false, projectionMatrix)
        }

        drawScene()
    }
    window.addEventListener("resize", handleResize)

   // MOVE CAM 
    let isDragging = false
    let lastX, lastY

    canvas.addEventListener("mousedown", (event) => {
        isDragging = true
        lastX = event.clientX
        lastY = event.clientY
    })

    canvas.addEventListener("mousemove", (event) => {
        if (!isDragging) return
        let deltaX = event.clientX - lastX
        let deltaY = event.clientY - lastY
        lastX = event.clientX
        lastY = event.clientY

        yaw -= deltaX * 0.005
        pitch += deltaY * 0.005
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch))

        computeViewMatrix()
        drawScene()
    })

    canvas.addEventListener("mouseup", () => {
        isDragging = false
        drawScene()
    })

    drawScene()
})
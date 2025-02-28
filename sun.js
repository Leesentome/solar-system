
class Sun {
    constructor(nom, color, size) {
        this.name = nom
        this.color = color
        this.size = size * KMTOUA
    }

    get_pos(year, month, day, hour, minute, second) {
        return this.get_pos()
    }
    get_pos() {
        return [0, 0, 0]
    }
}


sun = new Sun("Sun", [1, 0.9, 0.5], 696342)

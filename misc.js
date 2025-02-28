
KMTOUA = 1/149597870.700

function dot(a1, a2) {
    if (a1.lenght == a2.lenght) {
        return a1.map((u1, i) => u1 * a2[i]).reduce((acc, val) => acc + val, 0)
    }
}

function cross(v1, v2) {
    return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0] 
    ]
}

function hourMinSec2deg(h, m, s) {
    return 360/24 * (h + m/60 + s/3600)
}

function degMinSec2deg(d, m, s) {
    return Math.sign(d) * (Math.abs(d) + m/60 + s/3600)
}

function deg2rad(d) {
    return d * Math.PI / 180
}

function julianDay(year, month, day){
    if (month <= 2) {
        month += 12
        year -= 1
    }

    A = Math.floor(year / 100)
    
    if (year < 1582) {B = 0}
    else {B = Math.floor(2 - A + Math.floor(A / 4))}

    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5
}

function sideralTimeGreewich(julianday) {
    T = (julianday - 2451545.0) / 36525
    temp  = (280.46061837 + 360.98564736629 * (julianday - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000) % 360
    return temp
}

function localSideralTime(longitude, year, month, day, hour, minute, second) {
    D = day + hour / 24 + minute / 1440 + second / 86400
    return sideralTimeGreewich(julianDay(year, month, D)) + longitude
}

function zenith_direction(latitude, longitude, year, month, day, hour, minute, second) {
    lst = localSideralTime(longitude, year, month, day, hour, minute, second)
    return [lst, latitude]
}

function normalize(array) {
    return array.map(u => u / Math.sqrt(array.reduce((acc, u) => acc + u * u, 0)))
}

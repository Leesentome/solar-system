
import time
import numpy as np
import matplotlib.pyplot as plt

from stars import Star, hourMinSec2deg, degMinSec2deg
# from constellations import constellations
from constellations import *
from stars import stars

# Limit : 1900 - 2050

mois = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

class Planet:
    def __init__(self, nom, tpsRev, a0, ap, e0, ep, I0, Ip, L0, Lp, om0, omp, Om0, Omp, b=0, c=0, s=0, f=0):
        self.name = nom
        self.tpsRev = tpsRev
        self.a0 = a0
        self.ap = ap
        self.e0 = e0
        self.ep = ep
        self.I0 = I0
        self.Ip = Ip
        self.L0 = L0
        self.Lp = Lp
        self.om0 = om0
        self.omp = omp
        self.Om0 = Om0
        self.Omp = Omp
        self.b = b
        self.c = c
        self.s = s
        self.f = f

    def get_pos(self, year, month, day, hour, minute, second):
        if month <= 2:
            year -= 1
            month += 12
        Teph = int(365.25 * year) + int(30.6001 * (month + 1)) + day + hour / 24 + minute / 1440 + second / 86400 + 1720981.5
        T = (Teph - 2451545) / 36525

        a = self.a0 + self.ap * T
        e = self.e0 + self.ep * T
        I = self.I0 + self.Ip * T
        L = self.L0 + self.Lp * T
        om = self.om0 + self.omp * T
        Om = self.Om0 + self.Omp * T

        omega = om - Om
        M = L - om + self.b * T * T + self.c * np.cos(self.f * T) + self.s * np.sin(self.f * T)
        M = ((M + 180) % 360) - 180

        estar = 180/np.pi * e

        E = M + estar * np.sin(np.deg2rad(M))
        DM = M - (E - estar * np.sin(np.deg2rad(E)))
        DE = DM / (1 - e * np.cos(np.deg2rad(E)))

        while np.abs(DE) > 10**-6:
            E += DE
            DM = M - (E - estar * np.sin(np.deg2rad(E)))
            DE = DM / (1 - e * np.cos(np.deg2rad(E)))

        xprime = a * (np.cos(np.deg2rad(E)) - e)
        yprime = a * np.sqrt(1 - e * e) * np.sin(np.deg2rad(E))
        zprime = 0

        xecl = (np.cos(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) - np.sin(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * xprime + (-np.sin(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) - np.cos(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * yprime
        yecl = (np.cos(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) + np.sin(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * xprime + (-np.sin(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) + np.cos(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * yprime
        zecl = np.sin(np.deg2rad(omega)) * np.sin(np.deg2rad(I)) * xprime + np.cos(np.deg2rad(omega)) * np.sin(np.deg2rad(I)) * yprime

        epsilon = 23.43928
        xeq = xecl
        yeq = np.cos(np.deg2rad(epsilon)) * yecl - np.sin(np.deg2rad(epsilon)) * zecl
        zeq = np.sin(np.deg2rad(epsilon)) * yecl + np.cos(np.deg2rad(epsilon)) * zecl

        return xeq, yeq, zeq

mercure = Planet("Mercure", 88, 0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081)
venus = Planet("Venus", 225, 0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418)
terre = Planet("Terre", 365, 1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0, 0)
mars = Planet("Mars", 687, 1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343)
jupiter = Planet("Jupiter", 4333, 5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106)
saturne = Planet("Saturne", 10759, 9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794)
uranus = Planet("Uranus", 30685, 19.18916464, -0.00196176, 0.04725744, -0.00004397, 0.77263783, -0.00242939, 313.23810451, 428.48202785, 170.95427630, 0.40805281, 74.01692503, 0.04240589)
neptune = Planet("Neptune", 60226, 30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664)

# planetes = [mercure, venus, terre, mars, jupiter, saturne, uranus, neptune]
planetes = [terre]

def julianDay(year, month, day):
    if month <= 2:
        month += 12
        year -= 1
    
    A = int(year / 100)
    
    if(year < 1582):
        B = 0
    else:
        B = int(2 - A + int(A / 4))
    
    return int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day + B - 1524.5

def sideralTimeGreewich(julianday):
    T = (julianday - 2451545.0) / 36525
    temp  = (280.46061837 + 360.98564736629 * (julianday - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000) % 360
    return temp

def localSideralTime(longitude, year, month, day, hour, minute, second):
    D = day + hour / 24 + minute / 1440 + second / 86400
    return sideralTimeGreewich(julianDay(year, month, D)) + longitude

def zenith_direction(latitude, longitude, year, month, day, hour, minute, second):
    lst = localSideralTime(longitude, year, month, day, hour, minute, second)
    return lst, latitude

UA = 149597870700

def plotPlaneteOrbit():
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    X = [[] for p in planetes]
    Y = [[] for p in planetes]
    Z = [[] for p in planetes]

    for year in range(1900, 2051):
        for m, lenm in enumerate(mois):
            if (year%4 == 0) and (m == 2):
                lenm += 1
            for j in range(1, lenm + 1):
                print(f"\r{j:02}/{m+1:02}/{year}", end="")
                for i,p in enumerate(planetes):
                    x, y, z = p.get_pos(year, m+1, j, 12, 0, 0)
                    X[i].append(x)
                    Y[i].append(y)
                    Z[i].append(z)
    print()
    
    for i, p in enumerate(planetes):
        # nbPts = min(int(p.tpsRev * 0.9), len(X[0])-1)
        # ax.plot(X[i][-nbPts:], Y[i][-nbPts:], Z[i][-nbPts:])
        ax.plot(X[i], Y[i], Z[i])
        # for k in range(nbPts-1):
        #     ax.plot([X[i][-2-k], X[i][-1-k]], [Y[i][-2-k], Y[i][-1-k]], [Z[i][-2-k], Z[i][-1-k]], color=f"C{i}", alpha=1-k/nbPts, label=f"{p.name}")
    ax.plot(0, 0, 0, marker='o', markersize=12)
    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.set_zlabel("Z")
    ax.set_title(f"Year: {year}, Month: {m+1}, Day: {j}")
    ax.view_init(elev=54, azim=-93, roll=0)
    ax.axis("equal")
    # ax.legend()
    plt.show()

def plotEarthRot():
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    lat = 46.5
    lon = 4.9
    # year = 2025
    # month = 2
    # day = 3
    # hour = 12
    # minu = 0
    # sec = 0
    while True:
        t = time.time()
        t_struct = time.localtime(t)

        year = t_struct.tm_year
        month = t_struct.tm_mon
        day = t_struct.tm_mday
        hour = t_struct.tm_hour
        minu = t_struct.tm_min
        sec = t_struct.tm_sec

        # minu += 1
        # if minu >= 60:
        #     minu = 0
        #     hour += 1
        #     if hour >= 24:
        #         hour = 0
        #         day += 1
        #         if day > mois[month - 1]:
        #             day = 1
        #             month += 1
        #             if month > 12:
        #                 month = 1
        #                 year += 1

        x, y, z = terre.get_pos(year, month, day, hour, minu, sec)
        asc, decl = zenith_direction(lat, lon, year, month, day, hour, minu, sec)
        plt.plot([0, x], [0, y], [0, z])

        r = 0.01

        u = np.linspace(0, 2 * np.pi, 30)
        v = np.linspace(0, np.pi, 15)
        X = r * np.outer(np.cos(u), np.sin(v)) + x
        Y = r * np.outer(np.sin(u), np.sin(v)) + y
        Z = r * np.outer(np.ones(np.size(u)), np.cos(v)) + z

        dx = 2 * r * np.cos(np.deg2rad(asc)) * np.cos(np.deg2rad(decl))
        dy = 2 * r * np.sin(np.deg2rad(asc)) * np.cos(np.deg2rad(decl))
        dz = 2 * r * np.sin(np.deg2rad(decl))

        sunDir = -np.array([x, y, z])
        up = np.array([dx, dy, dz])
        isDay = np.dot(sunDir, up) > 0
        pr = "Day  " if isDay else "Night"
        
        print(f"\r{hour:02}:{minu:02}:{sec:02}, {day:02}/{month:02}/{year} -> {pr}", end="")

        ax.cla()
        ax.plot([0], [0], [0], 'o', color="yellow")
        ax.plot([x], [y], [z], 'o', color="blue")

        ax.plot_surface(X, Y, Z, color='b', alpha=0.6)

        ax.plot([x, x+dx], [y, y+dy], [z, z+dz], color='black')
        ax.plot([x, x], [y, y], [z, z+2*r], color='black')
        ax.axis("equal")
        plt.pause(0.1)
    plt.plot()

def earthRotation2():
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')
    
    year = 2025
    month = 2
    day = 3
    hour = 12
    minu = 0
    sec = 0

    vDir = []
    for i in range(2):
        x, y, z = terre.get_pos(year, month, day, hour, minu, sec)
        vDir.append([x, y, z])
        month += 3

    v1 = np.array(vDir[0])
    v2 = np.array(vDir[1])
    upDir = np.cross(v1, v2)
    upDir = upDir / np.linalg.norm(upDir)

    print(np.rad2deg(np.acos(np.dot(upDir, [0, 0, 1]))))

    plt.plot([0, upDir[0]], [0, upDir[1]], [0, upDir[2]])
    plt.plot([0, 0], [0, 0], [0, 1])
    plt.axis("equal")
    plt.show()

def plotEarthRotDay():
    lat = 46.5
    lon = 4.9
    year = 2025
    month = 2
    day = 4
    aurora = 0
    nightfall = 0
    wasDay = False
    for h in range(1, 24):
        for m in range(0, 60, 1):
            print(f"\r{h+1:02}:{m:02}:{0:02}, {day:02}/{month:02}/{year}", end="")
            x, y, z = terre.get_pos(year, month, day, h, m, 0)
            asc, decl = zenith_direction(lat, lon, year, month, day, h, m, 0)
            dx = np.cos(np.deg2rad(asc)) * np.cos(np.deg2rad(decl))
            dy = np.sin(np.deg2rad(asc)) * np.cos(np.deg2rad(decl))
            dz = np.sin(np.deg2rad(decl))

            sDir = -np.array([x, y, z])
            zDir = np.array([dx, dy, dz])
            isDay = np.dot(sDir, zDir) > 0
            if not(wasDay) and isDay:
                aurora = (h+1, m)
            if wasDay and not(isDay):
                nightfall = (h+1, m)
            wasDay = isDay

            ax.cla()
            ax.plot([x, x+.1*dx], [y, y+.1*dy], [z, z+.1*dz])
            ax.plot([x, x], [y, y], [z-0.1, z+0.1])
            ax.plot(0, 0, 0, marker='o', markersize=12)
            plt.pause(0.1)
    print()
    print(aurora, nightfall)

def plotStars():
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    # t = np.linspace(0, 2*np.pi, 100)
    # z = np.zeros(t.shape)
    # c = np.cos(t)
    # s = np.sin(t)
    # ax.plot(z, c, s, 'black')
    # ax.plot(c, z, s, 'black')
    # ax.plot(c, s, z, 'black')

    # consts = [velorum]
    consts = constellations
    greek_letters = [
        "alpha",
        "beta",
        "gamma",
        "delta",
        "epsilon",
        "zeta",
        "eta",
        "theta",
        "iota",
        "kappa",
        "lambda",
        "mu",
        "nu",
        "xi",
        "omicron",
        "pi",
        "rho",
        "sigma",
        "tau",
        "upsilon",
        "phi",
        "chi",
        "psi",
        "omega",
    ]
    for i, c in enumerate(consts):
        if len(consts) == 1:
            for s in c.stars:
                x, y, z = s.get_pos()
                if s.magn_app < 6: # and z > 1/np.sqrt(2):
                    ax.plot(x, y, z, 'o', color=f"C{2 * i}", markersize=2)
                    ax.text(x, y, z, s.name)

        d = {}
        for l in c.lines:
            s1, s2 = l
            d[s1.name] = s1
            d[s2.name] = s2

        for n in d:
            s = d[n]
            x, y, z = s.get_pos()
            ax.plot(x, y, z, 'o', color=f"C{2 * i}", markersize=2)


        for l in c.lines:
            s1, s2 = l[0], l[1]
            x1, y1, z1 = s1.get_pos()
            x2, y2, z2 = s2.get_pos()
            p = 0.9
            ax.plot([p*x1+(1-p)*x2, (1-p)*x1+p*x2], [p*y1+(1-p)*y2, (1-p)*y1+p*y2], [p*z1+(1-p)*z2, (1-p)*z1+p*z2], color=f"C{2 * i + 1}")

    ax.view_init(elev=-30, azim=-45, roll=0)
    ax.axis('equal')

    plt.show()

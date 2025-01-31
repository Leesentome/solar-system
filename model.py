
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

    def get_pos(self, year, month, day, hour):
        if month <= 2:
            year -= 1
            month += 12
        Teph = int(365.25 * year) + int(30.6001 * (month + 1)) + day + hour / 24 + 1720981.5
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
        yprime = a * np.sqrt(1 - e * e)* np.sin(np.deg2rad(E))
        zprime = 0

        xecl = (np.cos(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) - np.sin(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * xprime + (-np.sin(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) - np.cos(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * yprime
        yecl = (np.cos(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) + np.sin(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * xprime + (-np.sin(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) + np.cos(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * yprime
        zecl = np.sin(np.deg2rad(omega)) * np.sin(np.deg2rad(I)) * xprime + np.cos(np.deg2rad(omega)) * np.sin(np.deg2rad(I)) * yprime

        epsilon = 23.43928
        xeq = xecl
        yeq = np.cos(epsilon) * yecl - np.sin(epsilon) * zecl
        zeq = np.sin(epsilon) * yecl + np.cos(epsilon) * zecl

        return xeq, yeq, zeq

mercure = Planet("Mercure", 88, 0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081)
venus = Planet("Venus", 225, 0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418)
terre = Planet("Terre", 365, 1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0, 0)
mars = Planet("Mars", 687, 1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343)
jupiter = Planet("Jupiter", 4333, 5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106)
saturne = Planet("Saturne", 10759, 9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794)
uranus = Planet("Uranus", 30685, 19.18916464, -0.00196176, 0.04725744, -0.00004397, 0.77263783, -0.00242939, 313.23810451, 428.48202785, 170.95427630, 0.40805281, 74.01692503, 0.04240589)
neptune = Planet("Neptune", 60226, 30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664)

planetes = [mercure, venus, terre, mars, jupiter, saturne, uranus, neptune]

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# X = [[] for p in planetes]
# Y = [[] for p in planetes]
# Z = [[] for p in planetes]

# for year in range(1900, 2050):
#     for m, lenm in enumerate(mois):
#         if (year%4 == 0) and (m == 2):
#             lenm += 1
#         for j in range(1, lenm + 1):
#             print(f"\r{j:02}/{m+1:02}/{year}", end="")
#             for i,p in enumerate(planetes):
#                 x, y, z = p.get_pos(year, m+1, j, 12)
#                 X[i].append(x)
#                 Y[i].append(y)
#                 Z[i].append(z)
# print()

# for i, p in enumerate(planetes):
#     nbPts = min(int(p.tpsRev * 0.9), len(X[0])-1)
#     ax.plot(X[i][-nbPts:], Y[i][-nbPts:], Z[i][-nbPts:])
#     # for k in range(nbPts-1):
#     #     ax.plot([X[i][-2-k], X[i][-1-k]], [Y[i][-2-k], Y[i][-1-k]], [Z[i][-2-k], Z[i][-1-k]], color=f"C{i}", alpha=1-k/nbPts, label=f"{p.name}")
# ax.plot(0, 0, 0, marker='o', markersize=12)
# ax.set_xlabel("X")
# ax.set_ylabel("Y")
# ax.set_zlabel("Z")
# ax.set_title(f"Year: {year}, Month: {m+1}, Day: {j}")
# ax.view_init(elev=54, azim=-93, roll=0)
# ax.legend()
# plt.show()

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


class Planet {
    constructor(nom, tpsRev, a0, ap, e0, ep, I0, Ip, L0, Lp, om0, omp, Om0, Omp, b=0, c=0, s=0, f=0) {
        this.name = nom;
        this.tpsRev = tpsRev;
        this.a0 = a0;
        this.ap = ap;
        this.e0 = e0;
        this.ep = ep;
        this.I0 = I0;
        this.Ip = Ip;
        this.L0 = L0;
        this.Lp = Lp;
        this.om0 = om0;
        this.omp = omp;
        this.Om0 = Om0;
        this.Omp = Omp;
        this.b = b;
        this.c = c;
        this.s = s;
        this.f = f;
    }

    get_pos(year, month, day, hour, minute, second) {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        const Teph = int(365.25 * year) + int(30.6001 * (month + 1)) + day + hour / 24 + minute / 1440 + second / 86400 + 1720981.5;
        const T = (Teph - 2451545) / 36525;

        const a = this.a0 + this.ap * T;
        const e = this.e0 + this.ep * T;
        const I = this.I0 + this.Ip * T;
        const L = this.L0 + this.Lp * T;
        const om = this.om0 + this.omp * T;
        const Om = this.Om0 + this.Omp * T;

        const omega = om - Om;
        var M = L - om + this.b * T * T + this.c * np.cos(this.f * T) + this.s * np.sin(this.f * T);
        var M = ((M + 180) % 360) - 180;

        const estar = 180/np.pi * e;

        var E = M + estar * np.sin(np.deg2rad(M));
        var DM = M - (E - estar * np.sin(np.deg2rad(E)));
        var DE = DM / (1 - e * np.cos(np.deg2rad(E)));

        while (np.abs(DE) > 10**-6) {
            E += DE;
            DM = M - (E - estar * np.sin(np.deg2rad(E)));
            DE = DM / (1 - e * np.cos(np.deg2rad(E)));
        }

        const xprime = a * (np.cos(np.deg2rad(E)) - e);
        const yprime = a * np.sqrt(1 - e * e)* np.sin(np.deg2rad(E));
        const zprime = 0;

        const xecl = (np.cos(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) - np.sin(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * xprime + (-np.sin(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) - np.cos(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * yprime;
        const yecl = (np.cos(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) + np.sin(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * xprime + (-np.sin(np.deg2rad(omega)) * np.sin(np.deg2rad(Om)) + np.cos(np.deg2rad(omega)) * np.cos(np.deg2rad(Om)) * np.cos(np.deg2rad(I))) * yprime;
        const zecl = np.sin(np.deg2rad(omega)) * np.sin(np.deg2rad(I)) * xprime + np.cos(np.deg2rad(omega)) * np.sin(np.deg2rad(I)) * yprime;

        const epsilon = 23.43928;
        const xeq = xecl;
        const yeq = np.cos(epsilon) * yecl - np.sin(epsilon) * zecl;
        const zeq = np.sin(epsilon) * yecl + np.cos(epsilon) * zecl;

        return xeq, yeq, zeq;
    }
}
mercure = new Planet("Mercure", 88, 0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081);
venus = new Planet("Venus", 225, 0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418);
terre = new Planet("Terre", 365, 1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0, 0);
mars = new Planet("Mars", 687, 1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343);
jupiter = new Planet("Jupiter", 4333, 5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106);
saturne = new Planet("Saturne", 10759, 9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794);
uranus = new Planet("Uranus", 30685, 19.18916464, -0.00196176, 0.04725744, -0.00004397, 0.77263783, -0.00242939, 313.23810451, 428.48202785, 170.95427630, 0.40805281, 74.01692503, 0.04240589);
neptune = new Planet("Neptune", 60226, 30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664);

planetes = [mercure, venus, terre, mars, jupiter, saturne, uranus, neptune];

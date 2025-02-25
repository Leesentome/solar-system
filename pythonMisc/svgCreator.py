
import numpy as np

# filename = "image.svg"
# with open(filename, "w") as fch:
#     fch.write("""<svg version="1.1" viewBox="0 0 100 100" xml:space="preserve">\n""")
    
#     fch.write("""\t<path stroke="#008000" fill="transparent" d="\n""")

#     stars = [(20, 20), (80, 40), (40, 80)]
#     for xc, yc in stars:
#         rad = 10
#         modu = 3
#         t = np.linspace(0, 2 * np.pi, 11)
#         x = xc + (rad + modu * np.cos(5 * t)) * np.sin(t)
#         y = yc - (rad + modu * np.cos(5 * t)) * np.cos(t)

#         l = "\t\tM"
#         for (xi, yi) in zip(x[:-1], y[:-1]):
#             fch.write(f"""{l} {xi} {yi} """)
#             l = "L"
#         fch.write("Z\n")

#     fch.write("""\t"/>\n""")

#     pair = [
#         (stars[0], stars[1], 10, 14),
#         (stars[1], stars[2], 14, 10),
#         (stars[2], stars[0], 12, 12)
#     ]

#     fch.write("""\t<g stroke="#008000" stroke-dasharray="3,2" fill="none">\n""")
#     for (s1, s2, shrink1, shrink2) in pair:
#         (x1, y1), (x2, y2) = s1, s2

#         dx, dy = x2 - x1, y2 - y1
#         dist = np.hypot(dx, dy)

#         x1_adj = x1 + (dx * shrink1 / dist)
#         y1_adj = y1 + (dy * shrink1 / dist)
#         x2_adj = x2 - (dx * shrink2 / dist)
#         y2_adj = y2 - (dy * shrink2 / dist)

#         fch.write(f"\t\t<line x1='{x1_adj}' y1='{y1_adj}' x2='{x2_adj}' y2='{y2_adj}'/>\n")

#     fch.write("""\t</g>\n""")

#     fch.write("""</svg>""")

x = 400
y = 150

t = np.linspace(0, 2*np.pi, 11)[:-1]

radius = 40
wiggle = 20

for a in t:
    px = x + (radius + wiggle * np.cos(5 * a)) * np.sin(a)
    py = y + (radius + wiggle * np.cos(5 * a)) * np.cos(a)
    print(int(px), int(py))
    

def clipBoardOld():
    import pyperclip

    # 18h 36m 56,19s	+38° 46′ 58,8″
    # hourMinSec2deg(18, 36, 56.19), degMinSec2deg(38, 46, 58.8)

    def convertClipboard():
        
        clipboard_content = pyperclip.paste()
        bloc1, bloc2 = clipboard_content.split("\t")
        splited1 = bloc1.split(" ")
        splited2 = bloc2.split(" ")
        
        res1 = f"""hourMinSec2deg({int(splited1[0][:-1])}, {int(splited1[1][:-1])}, {".".join(splited1[2][:-1].split(","))})"""
        res2 = f"""degMinSec2deg({int(splited2[0][1:-1])}, {int(splited2[1][:-1])}, {".".join(splited2[2][:-1].split(","))})"""

        pyperclip.copy(f"{res1}, {res2}")

    convertClipboard()

import requests
import pyperclip
from bs4 import BeautifulSoup
from unidecode import  unidecode
from urllib.parse import unquote

WIKI_BASE_URL = "https://fr.wikipedia.org"

class ConstellationWiki:
    def __init__(self, genitive, star_list_url):
        self.genitive = genitive
        self.star_list_url = WIKI_BASE_URL + star_list_url if star_list_url else None
        self.stars = []
        self.stars_pyName = []

    def fetch_wiki_table(self):
        """Fetches the Wikipedia page and extracts the table div."""
        if not self.star_list_url:
            return None

        response = requests.get(self.star_list_url)
        if response.status_code != 200:
            print(f"Failed to retrieve {self.star_list_url}")
            return None

        soup = BeautifulSoup(response.text, "html.parser")
        table = soup.find("table")  # Assuming the first <table> contains stars
        if not table:
            print(f"No table found for {self.genitive}")
            return None

        tbody = table.find("tbody")
        if not tbody:
            print(f"No tbody found for {self.genitive}")
            return None

        # Extract star data from each row
        for row in tbody.find_all("tr"):
            cols = row.find_all("td")
            if len(cols) < 8:  # Ensure enough columns exist
                continue

            names = [
                a["href"] for a in cols[0].find_all("a") if a.get("href")
            ]
            name = cols[0].get_text(strip=True)  # Star name
            if len(names) > 0 and names[0][:5] == "/wiki":
                name = unquote(names[0].split("/")[2])
            index = 1
            while index < len(cols) and "°" not in cols[index].get_text(strip=True):
                index += 1
            if index == len(cols):
                continue
            ascension = cols[index-1].get_text(strip=True)  # Right ascension
            declination = cols[index].get_text(strip=True)  # Declination
            magnitude = cols[index +1].get_text(strip=True)  # Magnitude Apparente
            
            self.stars.append((name, ascension, declination, magnitude))

    def __str__(self):
        return f"Constellation({self.genitive}, Stars: {self.stars})"
    
    def __repr__(self):
        return f"Constellation({self.genitive}, {self.star_list_url})"

def parse_constellation_table(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    table_rows = soup.find_all("tr")

    constellations = []

    for row in table_rows:
        cols = row.find_all("td")
        if not cols:
            continue

        genitive = cols[3].get_text(strip=True)

        notable_stars_links = {
            a.get_text(strip=True): a["href"] for a in cols[14].find_all("a") if a.get("href")
        }
        if 'L' in notable_stars_links.keys():
            star_link = notable_stars_links['L']
        else:
            star_link = None

        constellations.append(ConstellationWiki(genitive, star_link))

    return constellations

def reader(file):
    with open(file, "r") as fch:
        content = fch.read()
    
    return parse_constellation_table(content)

noNameIndex = 1
greek_letters = [
    ("α", "alpha"),
    ("β", "beta"),
    ("γ", "gamma"),
    ("δ", "delta"),
    ("ε", "epsilon"),
    ("ζ", "zeta"),
    ("η", "eta"),
    ("θ", "theta"),
    ("ι", "iota"),
    ("κ", "kappa"),
    ("λ", "lambda"),
    ("μ", "mu"),
    ("ν", "nu"),
    ("ξ", "xi"),
    ("ο", "omicron"),
    ("π", "pi"),
    ("ρ", "rho"),
    ("σ", "sigma"),
    ("τ", "tau"),
    ("υ", "upsilon"),
    ("φ", "phi"),
    ("χ", "chi"),
    ("ψ", "psi"),
    ("ω", "omega"),
]
def starConverter(star):
    global noNameIndex
    n, a, d, mag = star

    pyname = n.lower().replace(" ", "_")
    for l in greek_letters:
        pyname = pyname.replace(l[0], l[1])
    pyname = unidecode(pyname)
    if pyname[:2] == "hd":
        pyname = "hd_" + pyname[3:]
    pyname = pyname.replace("+", "p")
    pyname = pyname.replace("-", "m")
    pyname = pyname.replace(".", "_")
    pyname = pyname.replace("'", "_")
    pyname = pyname.replace("(", "_")
    pyname = pyname.replace(")", "_")
    if pyname == "":
        pyname = f"noName_n{noNameIndex}"
        noNameIndex += 1
    if pyname[0].isnumeric():
        pyname = "n_" + pyname

    h, r = a.split("h")
    m, r = r.split("m")
    s = r[:-1].replace(",", ".")

    if "," in m:
        m, s = m.split(",")
        s = f"""{60 * float("0." + s)}"""

    dsplited = d.split("\xa0")
    if len(dsplited) < 3:
        if "," in dsplited[1]:
            mi, sec = dsplited[1].split(",")
            dsplited[1] = f"{mi}'"
            sec = f"""{float("0." + sec[:-1]) * 60}\""""
            dsplited.append(sec)
        else:
            sec = "0\""
            dsplited.append(sec)
    de, mi, se = dsplited

    if "/" in se:
        se = se.split("/")[-1]

    # print(n, mag)
    if mag == "" or mag == "n/a":
        mag = "None"
    elif "(" in mag:
        mag = mag.split("(")[0]
    elif "–" in mag:
        mag = mag.split("–")[1]
    elif mag.split("-")[0] != "":
        mag = mag.split("-")[0]
    if mag != "None":
        wr_mag = float(mag.replace(",", ".").replace("−", "-"))
    else:
        wr_mag = "None"

    return pyname, f"""{pyname} = Star("{n.replace("_", " ")}", hourMinSec2deg({int(h)}, {int(m)}, {float(s.replace("n", ".").replace(";", "."))}), degMinSec2deg({int(de[:-1].replace("−", "-"))}, {int(mi[:-1])}, {float(se[:-1].replace("," ,"."))}), {wr_mag})"""

constellations = reader("constellationList.html")

# for constellation in constellations
with open("stars.py", "a") as fch:
    # res = ""
    stars = []
    for i, c in enumerate(constellations):
        print(f"\r{i+1:{len(str(len(constellations)))}}/{len(constellations)} : {c.genitive:<25}", end="")
        c.fetch_wiki_table()
        stars_list = []
        # res += f"# {c.genitive}\n\n"
        fch.write(f"# {c.genitive}\n\n")
        for s in c.stars:
            pyName, starGen = starConverter(s)
            stars_list.append(pyName)
            # res += starGen + "\n"
            fch.write(starGen + "\n")
        # res += f"""\n{c.genitive.lower().replace(" ", "_")}_stars = [{stars_list[:-2]}]\n\n"""
        fch.write(f"""\n{c.genitive.lower().replace(" ", "_")}_stars = [{", ".join(stars_list)}]\n\n""")
        # print(f"""{c.genitive.lower().replace(" ", "_")} = Constellation("{c.genitive}", {c.genitive.lower().replace(" ", "_")}_stars, [])""")
        stars.append(stars_list)
    print()
    # res += f"\n# Stars\n\nstars = [{stars[:-2]}]"
    fch.write(f"\n# Stars\n\nstars = [\n")
    for l in stars:
        fch.write("\t" + ", ".join(l) + ",\n")
    fch.write(f"]\n\n")

# pyperclip.copy(res)

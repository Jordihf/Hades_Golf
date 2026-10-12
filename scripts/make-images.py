"""Genera static/og-hades.png (1200×630) y static/apple-touch-icon.png (180×180).

Uso: python3 scripts/make-images.py  (necesita Pillow y las fuentes libres URW base35 —P052, la serifa
tipo Palatino de la web— y DejaVu del sistema). Se dibuja a 3× y se reduce con LANCZOS para que los bordes
redondeados salgan suaves. Solo hace falta volver a ejecutarlo si cambia la marca; los PNG se versionan.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "static"
URW = Path("/usr/share/fonts/opentype/urw-base35")
DEJAVU = Path("/usr/share/fonts/truetype/dejavu")
SS = 3  # sobremuestreo

PINE = (15, 59, 46)
PINE_2 = (26, 82, 64)
GREEN = (79, 132, 102)
SAND = (239, 231, 214)
BRASS = (217, 183, 126)
WHITE = (255, 255, 255)
HEAT = [(239, 231, 214), (207, 220, 200), (147, 181, 154), (79, 132, 102), (26, 82, 64)]
LEVEL = [[3, 3, 3, 3, 3, 4, 4], [2, 2, 3, 2, 3, 4, 4], [1, 1, 1, 1, 2, 3, 2]]


def font(path, size):
    return ImageFont.truetype(str(path), size * SS)


def S(*v):
    """Coordenadas de diseño (1×) a coordenadas de dibujo (3×)."""
    return [round(x * SS) for x in v]


def mark(d, x, y, s, bg=PINE_2):
    """Bandera de la marca (la de static/favicon.svg) dentro de un cuadrado redondeado de lado s."""
    k = s / 32
    d.rounded_rectangle(S(x, y, x + s, y + s), radius=round(8 * k * SS), fill=bg)
    d.ellipse(S(x + 5.5 * k, y + 22.2 * k, x + 25.5 * k, y + 27.8 * k), fill=GREEN)
    d.line(S(x + 12 * k, y + 5.5 * k, x + 12 * k, y + 25 * k), fill=SAND, width=round(2 * k * SS))
    d.polygon(S(x + 12.5 * k, y + 5.5 * k, x + 23.5 * k, y + 9.75 * k, x + 12.5 * k, y + 14 * k), fill=BRASS)
    r = 1.7 * k
    d.ellipse(S(x + 20.5 * k - r, y + 24.2 * k - r, x + 20.5 * k + r, y + 24.2 * k + r), fill=WHITE)


def finish(img, size, name):
    img.resize(size, Image.LANCZOS).save(OUT / name, optimize=True)


def og():
    W, H = 1200, 630
    img = Image.new("RGB", (W * SS, H * SS), PINE)
    d = ImageDraw.Draw(img)
    for i in range(8):  # curvas de nivel decorativas
        rx, ry = 90 + i * 60, 55 + i * 38
        d.ellipse(S(900 - rx, 330 - ry, 900 + rx, 330 + ry), outline=(22, 72, 56), width=2 * SS)
    mark(d, 80, 70, 64)
    # Logotipo como en la web: «Hades» en serifa negrita y «Golf» en cursiva.
    bold, italic = font(URW / "P052-Bold.otf", 46), font(URW / "P052-Italic.otf", 46)
    d.text(S(164, 76), "Hades", font=bold, fill=SAND)
    gx = 164 + d.textlength("Hades ", font=bold) / SS
    d.text(S(gx, 76), "Golf", font=italic, fill=BRASS)
    title = font(URW / "P052-Bold.otf", 54)
    for i, line in enumerate(["Datos y automatización", "para la gerencia de", "tu campo de golf"]):
        d.text(S(80, 215 + i * 68), line, font=title, fill=WHITE)
    d.text(S(80, 470), "Arma tu plan según tu objetivo · hadesgolf.com", font=font(DEJAVU / "DejaVuSans.ttf", 26), fill=BRASS)

    # Mapa de calor de ejemplo, marcado como tal.
    x0, y0 = 760, 200
    d.rounded_rectangle(S(x0 - 30, y0 - 80, x0 + 380, y0 + 230), radius=22 * SS, fill=WHITE)
    d.rounded_rectangle(S(x0 - 8, y0 - 62, x0 + 222, y0 - 30), radius=8 * SS, fill=(254, 243, 199))
    d.text(S(x0 + 4, y0 - 58), "DATOS DE EJEMPLO", font=font(DEJAVU / "DejaVuSans-Bold.ttf", 18), fill=(124, 45, 18))
    small = font(DEJAVU / "DejaVuSans.ttf", 18)
    for c, day in enumerate("LMXJVSD"):
        d.text(S(x0 + 92 + c * 40, y0 - 18), day, font=small, fill=(60, 70, 66))
    for r, slot in enumerate(["Mañana", "Mediodía", "Tarde"]):
        d.text(S(x0 - 8, y0 + 16 + r * 62), slot, font=small, fill=(60, 70, 66))
        for c, v in enumerate(LEVEL[r]):
            x, y = x0 + 82 + c * 40, y0 + 6 + r * 62
            d.rounded_rectangle(S(x, y, x + 34, y + 52), radius=6 * SS, fill=HEAT[v])
    d.text(S(x0 - 8, y0 + 196), "Campo ficticio", font=small, fill=(90, 100, 96))
    finish(img, (W, H), "og-hades.png")


def touch_icon():
    img = Image.new("RGB", (180 * SS, 180 * SS), PINE)
    d = ImageDraw.Draw(img)
    # iOS recorta las esquinas: el fondo ocupa todo el cuadrado.
    mark(d, 0, 0, 180, bg=PINE)
    finish(img, (180, 180), "apple-touch-icon.png")


if __name__ == "__main__":
    og()
    touch_icon()
    print("Generados static/og-hades.png y static/apple-touch-icon.png")

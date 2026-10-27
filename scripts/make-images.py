"""Genera static/og-hades.png (1200x630), static/apple-touch-icon.png, favicons e icon-512 a partir de la «H» oficial.

Uso: npm run images  (Python + Pillow + fontTools). Fuente: static/fonts/archivo-latin.woff2 (OFL). Logo: static/brand/*.webp,
recortado sin redibujar del original de marca. Solo hace falta volver a ejecutarlo si cambia la marca; los PNG se versionan.
"""
import io
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
S = ROOT / "static"
BRAND, DEEP, SAGE, LIME, BG = (28, 54, 47), (13, 38, 34), (143, 174, 150), (215, 243, 106), (248, 247, 243)

ttf = io.BytesIO()
f = TTFont(S / "fonts" / "archivo-latin.woff2")
f.flavor = None
f.save(ttf)


def font(size, wght=880, wdth=64):
    ttf.seek(0)
    ft = ImageFont.truetype(ttf, size)
    try:
        ft.set_variation_by_axes([wght, wdth])
    except Exception:
        pass
    return ft


H = Image.open(S / "brand" / "hades-h.webp").convert("RGBA")
HW = Image.open(S / "brand" / "hades-h-blanco.webp").convert("RGBA")
WORD_W = Image.open(S / "brand" / "hades-wordmark-blanco.webp").convert("RGBA")


def gradient(w, h):
    g = Image.new("RGB", (w, h), DEEP)
    px = g.load()
    for y in range(h):
        for x in range(w):
            t = min(1, max(0, (x / w) * 0.75 + (1 - y / h) * 0.35 - 0.1))
            c = [round(DEEP[i] + (SAGE[i] - DEEP[i]) * t ** 1.6) for i in range(3)]
            px[x, y] = tuple(c)
    return g


def og():
    W, Hh = 1200, 630
    im = gradient(W, Hh).convert("RGBA")
    d = ImageDraw.Draw(im)
    for y in range(0, Hh, 14):  # trama de puntos arriba a la derecha
        for x in range(700, W, 14):
            a = max(0, 1 - (((x - W) ** 2 + y ** 2) ** 0.5) / 520)
            if a > 0:
                d.ellipse((x - 1.6, y - 1.6, x + 1.6, y + 1.6), fill=(255, 255, 255, round(90 * a)))
    mark = HW.copy()
    mark.thumbnail((560, 700))
    ghost = mark.copy()
    ghost.putalpha(mark.getchannel("A").point(lambda v: v * 0.1))
    im.alpha_composite(ghost, (W - mark.width - 30, (Hh - mark.height) // 2 + 40))
    word = WORD_W.copy()
    word.thumbnail((260, 80))
    h_small = HW.copy()
    h_small.thumbnail((70, 70))
    im.alpha_composite(h_small, (72, 64))
    im.alpha_composite(word, (72 + h_small.width + 18, 64 + (h_small.height - word.height) // 2))
    big = font(118)
    d.text((70, 250), "LA IA QUE", font=big, fill="white")
    d.text((70, 362), "LLENA TU CAMPO", font=big, fill="white")
    small = font(30, 600, 100)
    d.rounded_rectangle((72, 508, 72 + 470, 560), radius=26, fill=LIME)
    d.text((96, 517), "La tienda de IA para el golf", font=small, fill=DEEP)
    im.convert("RGB").save(S / "og-hades.png", optimize=True)


def icon(size, bg, pad, out):
    c = Image.new("RGBA", (size, size), bg)
    h = H.copy()
    h.thumbnail((size - 2 * pad, size - 2 * pad), Image.LANCZOS)
    c.alpha_composite(h, ((size - h.width) // 2, (size - h.height) // 2))
    (c.convert("RGB") if bg[3] == 255 else c).save(S / out, optimize=True)


og()
icon(180, (*BG, 255), 22, "apple-touch-icon.png")
icon(512, (*BG, 255), 70, "icon-512.png")
icon(64, (0, 0, 0, 0), 3, "favicon-64.png")
icon(32, (0, 0, 0, 0), 1, "favicon-32.png")
print("og-hades.png, apple-touch-icon.png, icon-512.png y favicons generados.")

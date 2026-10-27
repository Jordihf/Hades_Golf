#!/usr/bin/env python3
"""Prepara las fotos de los huecos de la web (src/data/images.json).

Uso:
  1. Deja el original en static/img/<hueco>.jpg (o .png), p. ej. static/img/hero.jpg (2400x1350).
  2. npm run images:opt   (o: python3 scripts/optimize-images.py)

Para cada hueco con original:
  · comprueba la proporción (máx. 2 % de diferencia) y que tenga el ancho mínimo («min» del hueco o, si no hay, 2/3 del pedido);
  · recorta al centro a la proporción exacta si hace falta (avisa);
  · genera <hueco>@2x.webp (ancho pedido) y <hueco>.webp (mitad), cada uno < 250 KB.
Los huecos sin original se quedan con el marcador de marca (degradado + trama + «H»): el build no falla.
Sale con código 1 si algún original no cumple las medidas.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "static" / "img"
SLOTS = json.loads((ROOT / "src" / "data" / "images.json").read_text(encoding="utf-8"))["slots"]
MAX_BYTES = 250_000
RATIO_TOL = 0.02


def save_webp(im: Image.Image, out: Path) -> tuple[int, int]:
    """Guarda en WebP bajando la calidad hasta quedar por debajo de MAX_BYTES."""
    for q in (84, 80, 76, 72, 68, 64, 60, 55, 50, 45):
        im.save(out, "WEBP", quality=q, method=6)
        size = out.stat().st_size
        if size < MAX_BYTES:
            return q, size
    return q, size


def original(name: str) -> Path | None:
    for ext in ("jpg", "jpeg", "png", "JPG", "JPEG", "PNG"):
        p = IMG / f"{name}.{ext}"
        if p.exists():
            return p
    return None


def main() -> int:
    IMG.mkdir(parents=True, exist_ok=True)
    errors = 0
    for slot in SLOTS:
        name, W, H = slot["name"], slot["w"], slot["h"]
        src = original(name)
        if not src:
            print(f"·  {name:<20} sin original ({W}x{H}): se usa el marcador")
            continue
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        w, h = im.size
        want, got = W / H, w / h
        if abs(got - want) / want > RATIO_TOL:
            print(f"✗  {name:<20} {w}x{h}: proporción {got:.3f}, se pide {want:.3f} ({W}x{H})")
            errors += 1
            continue
        min_w = slot.get("min", round(W * 2 / 3))
        if w < min_w:
            print(f"✗  {name:<20} {w}x{h}: demasiado pequeña (mínimo {min_w} px de ancho; ideal {W})")
            errors += 1
            continue
        if abs(got - want) / want > 0.005:
            # Recorte al centro a la proporción exacta.
            if got > want:
                nw = round(h * want)
                im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
            else:
                nh = round(w / want)
                im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
            print(f"!  {name:<20} recortada al centro a {im.size[0]}x{im.size[1]}")
        big_w = min(W, im.size[0])
        big = im.resize((big_w, round(big_w * H / W)), Image.LANCZOS)
        small = im.resize((W // 2, H // 2), Image.LANCZOS)
        q2, s2 = save_webp(big, IMG / f"{name}@2x.webp")
        q1, s1 = save_webp(small, IMG / f"{name}.webp")
        warn = " (no baja de 250 KB: revisa la foto)" if max(s1, s2) >= MAX_BYTES else ""
        if w < W:
            warn += f" (original {w} px: el 2x queda a {big_w} px)"
        print(f"✓  {name:<20} 1x {W // 2}px {s1 // 1024} KB (q{q1}) · 2x {big_w}px {s2 // 1024} KB (q{q2}){warn}")
    print("Hecho. Ejecuta npm run build para publicar con las fotos nuevas.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

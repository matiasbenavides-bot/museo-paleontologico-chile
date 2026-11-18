#!/usr/bin/env python3
"""
CR-126 · Genera la imagen que se ve al compartir el sitio (og:image).

PROPÓSITO
    Producir `assets/img/og-mpch.jpg` (1200x630, JPG opaco) a partir de
    material YA AUTORIZADO del museo (fotos de la galería) + el logo.

POR QUÉ 1200x630
    Es la proporción 1.91:1 que usan WhatsApp, Facebook, LinkedIn y X para la
    tarjeta grande. El mínimo de Facebook es 600x315; 1200x630 es el tamaño que
    recomienda su propia documentación y el que no se recorta.

POR QUÉ JPG Y NO PNG
    Medido: `logo-mpch-placa.png` es RGBA (790x336). WhatsApp y Facebook NO
    muestran transparencia en las tarjetas: un PNG con alfa aparece con fondo
    negro o con bordes sucios. Además un JPG de 1200x630 pesa ~10x menos que el
    PNG equivalente, y la tarjeta se descarga al compartir.

REGLA DE ORO DEL PROYECTO
    No se inventa material. La foto base tiene que ser una foto REAL de la
    galería del museo (autorizada en bloque por el dueño, sin alt ni pie).
    El logo va encima como lo que es: la marca del museo.

USO
    .venv/bin/python scripts/genera-og-image.py [foto_base] [-o salida]

    Sin argumentos usa la foto base por defecto de FOTO_BASE.

SALIDA
    Código 0 y el PNG de control al Escritorio (/mnt/c/Users/logic/Desktop)
    para que el dueño la MIRE antes de publicar. Nunca publica sola.
"""

import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFilter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(RAIZ, "assets", "img")

# Foto real del museo, de la galería ya publicada. 900x900 -> se recorta a 1.91:1.
FOTO_BASE = os.path.join(ASSETS, "galeria", "muestra-5.jpg")
LOGO = os.path.join(ASSETS, "logo-mpch-placa.png")

ANCHO, ALTO = 1200, 630

# Paleta del sitio (--azul-profundo / --celeste). Se muestrean del CSS real,
# no se inventan: ver css/main.css :root.
AZUL = (2, 21, 63)
CELESTE = (81, 173, 198)


def recorta_a_proporcion(im, ancho, alto):
    """Recorta al centro con la proporción pedida, sin deformar."""
    objetivo = ancho / alto
    w, h = im.size
    actual = w / h
    if actual > objetivo:            # sobra ancho
        nuevo_w = int(h * objetivo)
        x = (w - nuevo_w) // 2
        im = im.crop((x, 0, x + nuevo_w, h))
    else:                            # sobra alto
        nuevo_h = int(w / objetivo)
        y = (h - nuevo_h) // 2
        im = im.crop((0, y, w, nuevo_h))
    return im.resize((ancho, alto), Image.LANCZOS)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("foto", nargs="?", default=FOTO_BASE)
    p.add_argument("-o", "--salida", default=os.path.join(ASSETS, "og-mpch.jpg"))
    args = p.parse_args()

    if not os.path.exists(args.foto):
        sys.exit(f"ERROR: no existe la foto base: {args.foto}")

    base = Image.open(args.foto).convert("RGB")
    print(f"foto base      {args.foto}  {base.size[0]}x{base.size[1]}")

    # 1. recorte 1.91:1
    lienzo = recorta_a_proporcion(base, ANCHO, ALTO)

    # 2. velo azul degradado: oscurece abajo para que el texto/logo se lea
    velo = Image.new("RGBA", (ANCHO, ALTO), (0, 0, 0, 0))
    dv = ImageDraw.Draw(velo)
    for y in range(ALTO):
        t = y / (ALTO - 1)
        # de 0.15 arriba a 0.90 abajo, sobre el azul del sitio
        a = int(255 * (0.15 + 0.75 * (t ** 1.6)))
        dv.line([(0, y), (ANCHO, y)], fill=AZUL + (a,))
    lienzo = Image.alpha_composite(lienzo.convert("RGBA"), velo)

    # 3. logo arriba a la izquierda, con aire
    if os.path.exists(LOGO):
        logo = Image.open(LOGO).convert("RGBA")
        # alto objetivo 150 px, proporción respetada
        lh = 150
        lw = int(logo.size[0] * lh / logo.size[1])
        logo = logo.resize((lw, lh), Image.LANCZOS)
        margen = 60
        lienzo.alpha_composite(logo, (margen, 45))
        print(f"logo           {LOGO}  {lw}x{lh} en ({margen},45)")

    # 4. banda celeste inferior: firma del sitio, sin texto inventado
    db = ImageDraw.Draw(lienzo)
    db.rectangle([0, ALTO - 14, ANCHO, ALTO], fill=CELESTE + (255,))

    final = lienzo.convert("RGB")
    final = final.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=3))
    final.save(args.salida, "JPEG", quality=88, optimize=True, progressive=True)

    kb = os.path.getsize(args.salida) / 1024
    print(f"salida         {args.salida}  {ANCHO}x{ALTO}  {kb:.0f} KB")

    # 5. copia de CONTROL para que el dueño la MIRE, sin publicar
    control_dir = "/mnt/c/Users/logic/Desktop"
    if os.path.isdir(control_dir):
        control = os.path.join(control_dir, "MPCH-imagen-para-compartir.jpg")
        final.save(control, "JPEG", quality=92)
        print(f"PARA MIRAR     {control}")

    # 6. aviso si excede lo que Facebook recomienda (< 8 MB, y ~100 KB ideal)
    if kb > 300:
        print("AVISO: sobre 300 KB, la tarjeta puede tardar en cargar.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""mide-lamina.py — mide la relacion entre el FONDO BLANCO y el DIBUJO de un SVG.

El dueno eligio «LAMINA BLANCA COMPLETA»: el fondo blanco debe llenar el marco
entero, sin que asome el azul de la tarjeta.

Para eso hay que saber, DENTRO DEL ARCHIVO:
  1. donde esta el `<rect id="rect-blanca-para-texto">` (coords de usuario)
  2. donde esta el DIBUJO (tinta NO blanca) en coords de usuario
  3. donde estan los ROTULOS (texto), para no dejarlos fuera del blanco

⚠️ TRAMPA YA PAGADA: «blanco» no distingue «vacio» de «pintado de blanco».
Por eso aca se reportan las dos cosas por separado:
  - caja del RECTANGULO BLANCO (declarada en el archivo)
  - caja de la TINTA OSCURA  (pixeles que NO son ni blancos ni casi-blancos)

Uso: .venv/bin/python scripts/mide-lamina.py
"""
import glob
import os
import re
import subprocess
import sys
import tempfile

from PIL import Image

CHROMIUM = None
for pat in (
    os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"),
    os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux/chrome"),
):
    hits = sorted(glob.glob(pat))
    if hits:
        CHROMIUM = hits[-1]
        break
if not CHROMIUM:
    sys.exit("No encontre Chromium de Playwright")

OBJETIVO = [
    "assets/img/trilobites/cefalon-numerado.svg",
    "assets/img/trilobites/cranidio-numerado.svg",
]

# umbral: «tinta» = pixel claramente mas oscuro que el blanco
TINTA = 200


def leer_header(ruta):
    txt = open(ruta, encoding="utf-8", errors="replace").read()
    m_vb = re.search(r'<svg[^>]*\bviewBox="([^"]+)"', txt)
    m_w = re.search(r'<svg[^>]*\bwidth="([\d.]+)"', txt)
    m_h = re.search(r'<svg[^>]*\bheight="([\d.]+)"', txt)
    vb = [float(x) for x in m_vb.group(1).split()] if m_vb else None
    return txt, (float(m_w.group(1)) if m_w else 600.0,
                 float(m_h.group(1)) if m_h else 400.0), vb


def render(ruta, png):
    txt, (w, h), _ = leer_header(ruta)
    html = ('<!DOCTYPE html><html><head><meta charset="utf-8">'
            '<style>html,body{margin:0;padding:0;background:#fff;overflow:hidden}'
            'svg{display:block}</style></head><body>%s</body></html>' % txt)
    rh = png.replace(".png", ".html")
    open(rh, "w", encoding="utf-8").write(html)
    cmd = [CHROMIUM, "--headless", "--disable-gpu", "--no-sandbox",
           "--hide-scrollbars", "--force-device-scale-factor=1",
           f"--window-size={int(w)},{int(h)}", f"--screenshot={png}",
           "--default-background-color=FFFFFFFF", "file://" + os.path.abspath(rh)]
    subprocess.run(cmd, capture_output=True, timeout=120)
    return os.path.exists(png)


def caja_tinta(png):
    """bbox de la tinta OSCURA (el dibujo y los rotulos), en pixeles."""
    im = Image.open(png).convert("RGB")
    w, h = im.size
    px = im.load()
    x0, y0, x1, y1 = w, h, -1, -1
    n = 0
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            if p[0] < TINTA and p[1] < TINTA and p[2] < TINTA:
                n += 1
                if x < x0: x0 = x
                if x > x1: x1 = x
                if y < y0: y0 = y
                if y > y1: y1 = y
    return (None, (w, h)) if x1 < 0 else ((x0, y0, x1, y1, n), (w, h))


def main():
    tmp = tempfile.mkdtemp(prefix="lamina-")
    print("=" * 80)
    print("LAMINA: fondo blanco vs. dibujo+rotulos")
    print("=" * 80)

    for ruta in OBJETIVO:
        nombre = os.path.basename(ruta)
        txt, (w_css, h_css), vb = leer_header(ruta)

        # 1. el rectangulo blanco, tal como esta declarado
        m = re.search(r'<rect[^>]*id="rect-blanca-para-texto"[^>]*>', txt)
        print(f"\n  {nombre}")
        if m:
            tag = m.group(0)
            at = {k: v for k, v in re.findall(r'(\w[\w-]*)="([^"]*)"', tag)}
            print(f"    rect blanco      : x={at.get('x')} y={at.get('y')} "
                  f"w={at.get('width')} h={at.get('height')} fill={at.get('fill')}")
        else:
            print("    rect blanco      : NO ENCONTRADO")

        print(f"    viewBox          : {vb}")
        print(f"    width/height     : {w_css} x {h_css}   proporcion {w_css/h_css:.3f}")

        # 2. render y medicion de tinta por pixeles
        png = os.path.join(tmp, nombre + ".png")
        if not render(ruta, png):
            print("    RENDER FALLO")
            continue
        bb, (pw, ph) = caja_tinta(png)
        if bb is None:
            print("    tinta            : NO SE DETECTO TINTA (medicion invalida)")
            continue

        x0, y0, x1, y1, n = bb
        print(f"    render           : {pw} x {ph} px")
        print(f"    tinta (dibujo+rotulos): x={x0}..{x1}  y={y0}..{y1}   ({n} px)")

        # 3. traducir pixeles -> unidades de usuario (regla de tres)
        if vb:
            vx, vy, vw, vh = vb
            ex, ey = vw / pw, vh / ph
            ux0 = vx + x0 * ex
            uy0 = vy + y0 * ey
            ux1 = vx + (x1 + 1) * ex
            uy1 = vy + (y1 + 1) * ey
            print(f"    tinta en usuario : x={ux0:.1f}..{ux1:.1f}  y={uy0:.1f}..{uy1:.1f}")

            if m:
                at = {k: v for k, v in re.findall(r'(\w[\w-]*)="([^"]*)"', m.group(0))}
                try:
                    rx, ry = float(at['x']), float(at['y'])
                    rw, rh = float(at['width']), float(at['height'])
                    dentro = (ux0 >= rx - 0.5 and uy0 >= ry - 0.5
                              and ux1 <= rx + rw + 0.5 and uy1 <= ry + rh + 0.5)
                    print(f"    ¿la tinta cabe en el rect blanco? "
                          f"{'SI' if dentro else 'NO — hay tinta FUERA del blanco'}")
                except (KeyError, ValueError):
                    pass

        # 4. perfil: cuanta tinta por banda horizontal (donde esta el contenido)
        print("    perfil de tinta (cada 10px de ancho):")
        im = Image.open(png).convert("RGB")
        pxo = im.load()
        for bx in range(0, pw, max(10, pw // 12)):
            c = 0
            for x in range(bx, min(bx + max(10, pw // 12), pw)):
                for y in range(ph):
                    p = pxo[x, y]
                    if p[0] < TINTA and p[1] < TINTA and p[2] < TINTA:
                        c += 1
            print(f"      x={bx:4d}  {c:5d} {'#' * min(50, c // 20)}")

    print(f"\ntmp: {tmp}")


if __name__ == "__main__":
    main()

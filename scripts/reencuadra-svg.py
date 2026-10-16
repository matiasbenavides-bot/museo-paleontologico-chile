"""reencuadra-svg.py — recalcula el viewBox de un SVG para que encuadre el DIBUJO.

SINTOMA DEL DUENO: «las imagenes salen descentradas / recortadas a la mitad
sin considerar que el objeto estaba en el centro».
CAUSA MEDIDA: el `viewBox` es mas ancho que el DIBUJO y el contenido quedo
pegado al borde DERECHO. En `cefalon-numerado.svg`, el 57% del lienzo
(x=0..170 de 298) esta VACIO. No es CSS: se ve asi en cualquier visor.

🔴 POR QUE NO SE USA `getBBox()`  (medido 2026-10-16, y casi se aplica el parche)
Se probo primero con `svg.getBBox()` y devolvio, para el cefalon:
      x=-330  y=-93  w=587.34  h=329
o sea: origen IDENTICO al del viewBox actual (-330 -93) y ancho casi igual
(546 -> 587). Si el dibujo estuviera pegado a la derecha con 57% vacio a la
izquierda, su bbox NO puede empezar en el borde izquierdo.
⇒ `getBBox()` devuelve la union de TODOS los nodos, incluidos rectangulos de
  fondo transparentes (aqui un `<g transform="translate(747.57,482.90)">`),
  asi que mide el LIENZO, no el DIBUJO. Aplicar ese viewBox no arreglaba nada.
⇒ La medicion valida es POR PIXELES sobre el render real, que es lo unico que
  distingue «hay tinta» de «hay un nodo vacio».

METODO: se renderiza el SVG a PNG con Chromium (viewport = tamano exacto del
SVG, sin margenes), se busca el bbox de los pixeles con tinta, y se recalcula
el viewBox por REGLA DE TRES entre pixeles y unidades de usuario.

NO toca ningun trazo, texto, rotulo ni transform. Reversible.

Uso:
    .venv/bin/python scripts/reencuadra-svg.py             # solo medir
    .venv/bin/python scripts/reencuadra-svg.py --aplicar   # reescribir
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

# Margen de respiro alrededor del dibujo, en unidades de usuario del SVG.
MARGEN = 3.0

# Umbral de «tinta»: un pixel es tinta si NO es casi-blanco.
UMBRAL = 248


def leer_header(ruta):
    txt = open(ruta, encoding="utf-8", errors="replace").read()
    m_w = re.search(r'<svg[^>]*\bwidth="([\d.]+)"', txt)
    m_h = re.search(r'<svg[^>]*\bheight="([\d.]+)"', txt)
    m_vb = re.search(r'<svg[^>]*\bviewBox="([^"]+)"', txt)
    w = float(m_w.group(1)) if m_w else 600.0
    h = float(m_h.group(1)) if m_h else 400.0
    vb = None
    if m_vb:
        p = [float(x) for x in m_vb.group(1).split()]
        if len(p) == 4:
            vb = p
    return txt, w, h, vb


def render(ruta, png):
    """Renderiza el SVG con viewport = tamano exacto del SVG, sin margenes."""
    txt, w, h, _ = leer_header(ruta)
    html = (
        '<!DOCTYPE html><html><head><meta charset="utf-8">'
        '<style>html,body{margin:0;padding:0;background:#fff;overflow:hidden}'
        'svg{display:block}</style></head><body>%s</body></html>' % txt
    )
    ruta_html = png.replace(".png", ".html")
    open(ruta_html, "w", encoding="utf-8").write(html)
    cmd = [
        CHROMIUM, "--headless", "--disable-gpu", "--no-sandbox",
        "--hide-scrollbars", "--force-device-scale-factor=1",
        f"--window-size={int(w)},{int(h)}",
        f"--screenshot={png}",
        "--default-background-color=FFFFFFFF",
        "file://" + os.path.abspath(ruta_html),
    ]
    subprocess.run(cmd, capture_output=True, timeout=120)
    return os.path.exists(png), w, h


def bbox_tinta(png):
    """bbox EN PIXELES de los pixeles con tinta. None si no hay tinta."""
    im = Image.open(png).convert("RGB")
    w, h = im.size
    px = im.load()
    x0, y0, x1, y1 = w, h, -1, -1
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            if not (p[0] >= UMBRAL and p[1] >= UMBRAL and p[2] >= UMBRAL):
                if x < x0: x0 = x
                if x > x1: x1 = x
                if y < y0: y0 = y
                if y > y1: y1 = y
    if x1 < 0:
        return None, (w, h)
    return (x0, y0, x1, y1), (w, h)


def control_negativo(tmp):
    """Un SVG centrado y uno corrido. Si el medidor no los distingue, no mide."""
    casos = {
        "centrado": (100, 60, 200, 80),
        "corrido":  (250, 60, 140, 80),
    }
    print("  CONTROL DEL INSTRUMENTO")
    ok_total = True
    for nombre, (rx, ry, rw, rh) in casos.items():
        f = os.path.join(tmp, f"c-{nombre}.svg")
        open(f, "w").write(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" '
            'viewBox="0 0 400 200"><rect x="%d" y="%d" width="%d" height="%d" '
            'fill="#000"/></svg>' % (rx, ry, rw, rh))
        png = f + ".png"
        render(f, png)
        bb, (w, h) = bbox_tinta(png)
        izq = bb[0]; der = w - 1 - bb[2]
        print(f"    {nombre:9s} franja izq={izq:4d}  der={der:4d}  "
              f"{'(ok)' if (nombre == 'centrado' and izq == der) or (nombre == 'corrido' and abs(izq-der) > 50) else '(REVISAR)'}")
        if nombre == "centrado" and izq != der:
            ok_total = False
    return ok_total


def main():
    aplicar = "--aplicar" in sys.argv
    tmp = tempfile.mkdtemp(prefix="svgref2-")

    print("=" * 78)
    print("REENCUADRE DEL viewBox AL DIBUJO" + ("   [APLICAR]" if aplicar else "   [solo medir]"))
    print("=" * 78)
    print(control_negativo(tmp))
    print()

    for ruta in OBJETIVO:
        nombre = os.path.basename(ruta)
        txt, w_css, h_css, vb = leer_header(ruta)
        if vb is None:
            print(f"  {nombre:26s} SIN viewBox — se omite")
            continue

        png = os.path.join(tmp, nombre + ".png")
        ok, _, _ = render(ruta, png)
        if not ok:
            print(f"  {nombre:26s} FALLO EL RENDER")
            continue

        bb, (pw, ph) = bbox_tinta(png)
        if bb is None:
            print(f"  {nombre:26s} el render salio VACIO — no se concluye nada")
            continue

        # ---- regla de tres: pixeles -> unidades de usuario ----
        # el PNG mide (pw x ph) y representa el viewBox (vx vy vw vh)
        vx, vy, vw, vh = vb
        ex = vw / pw          # unidades de usuario por pixel (eje x)
        ey = vh / ph          # idem eje y
        x0, y0, x1, y1 = bb
        ux0 = vx + x0 * ex
        uy0 = vy + y0 * ey
        ux1 = vx + (x1 + 1) * ex
        uy1 = vy + (y1 + 1) * ey

        nuevo_vb = (round(ux0 - MARGEN, 2), round(uy0 - MARGEN, 2),
                    round((ux1 - ux0) + MARGEN * 2, 2),
                    round((uy1 - uy0) + MARGEN * 2, 2))

        franja_izq = x0
        franja_der = pw - 1 - x1
        pct_izq = round(100 * franja_izq / pw, 1)
        pct_der = round(100 * franja_der / pw, 1)

        print(f"  {nombre}")
        print(f"    viewBox actual  : {vb[0]} {vb[1]} {vb[2]} {vb[3]}")
        print(f"    render          : {pw} x {ph} px")
        print(f"    tinta           : x={x0}..{x1}  y={y0}..{y1}")
        print(f"    franjas vacias  : izq {franja_izq}px ({pct_izq}%)   der {franja_der}px ({pct_der}%)")
        print(f"    viewBox NUEVO   : {nuevo_vb[0]} {nuevo_vb[1]} {nuevo_vb[2]} {nuevo_vb[3]}")
        print(f"    width/height    : {w_css} x {h_css}  (se conservan)")

        if not aplicar:
            print()
            continue

        vb_txt = " ".join(str(v) for v in nuevo_vb)
        antes = txt
        nuevo = re.sub(r'(<svg[^>]*\bviewBox=")[^"]*(")', r"\g<1>" + vb_txt + r"\g<2>", antes, count=1)
        if nuevo == antes:
            print("    🔴 NO SE PUDO REESCRIBIR\n")
            continue
        open(ruta, "w", encoding="utf-8").write(nuevo)
        print(f"    ✅ APLICADO ({len(antes)} -> {len(nuevo)} bytes)\n")

    if aplicar:
        print("Verificar con: .venv/bin/python scripts/mide-svg-recorte.py")
    else:
        print("Nada modificado. Para aplicar: --aplicar")
    print(f"tmp: {tmp}")


if __name__ == "__main__":
    main()

"""mide-svg-recorte.py — mide DONDE ESTA EL DIBUJO dentro de un SVG.

Regla del proyecto: para «¿se ve?» se cuentan PIXELES, no propiedades.
Acá se renderiza el SVG con Chromium y se busca el bbox del contenido
no-blanco, para saber si el lienzo tiene una franja vacia a un costado
(que es lo que el dueno reporta como «descentrado / recortado a la mitad»).

CONTROL NEGATIVO: se renderiza tambien un SVG de prueba con un rectangulo
centrado conocido. Si el medidor no distingue «centrado» de «corrido»,
el medidor esta mal, no el archivo.

Uso:  .venv/bin/python scripts/mide-svg-recorte.py
"""
import base64
import glob
import os
import subprocess
import sys
import tempfile
from PIL import Image

CHROMIUM = None
for pat in (
    # ⚠️ Los dos nombres de carpeta existen segun la version de Playwright:
    #    `chrome-linux64` (las nuevas) y `chrome-linux` (las viejas).
    os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"),
    os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux/chrome"),
    os.path.expanduser("~/.cache/ms-playwright/chromium_headless_shell-*/chrome-linux/headless_shell"),
    os.path.expanduser("~/.cache/ms-playwright/chromium_headless_shell-*/chrome-linux64/headless_shell"),
):
    hits = sorted(glob.glob(pat))
    if hits:
        CHROMIUM = hits[-1]
        break

if not CHROMIUM:
    sys.exit("No encontre Chromium de Playwright")

ANCHO_VISTA = 1200


def render_svg(ruta_svg, salida_png, ancho=ANCHO_VISTA):
    """Renderiza el SVG a PNG con Chromium headless.

    🔴 TRAMPA MEDIDA (2026-10-16): `--screenshot` captura la VENTANA COMPLETA
    (1200x900), no el SVG. Al medir el bbox sobre esa captura, la «franja
    derecha» era el resto de la ventana vacia y el CONTROL NEGATIVO (un
    rectangulo perfectamente centrado) daba 66,7% de desbalance. Un centrado
    no puede dar 66,7%: el medidor estaba mal, no el archivo.

    ⇒ Se renderiza dentro de una pagina propia que fija el viewport al tamano
    EXACTO del SVG, con `body{margin:0}` y el SVG a `width:100%`. Asi el
    pixel 0..w-1 es el lienzo real del SVG y las franjas que se miden son
    las del archivo.
    """
    # el tamano del SVG se lee de su propio header
    import re
    txt = open(ruta_svg, encoding="utf-8", errors="replace").read()
    m_w = re.search(r'<svg[^>]*\bwidth="([\d.]+)"', txt)
    m_h = re.search(r'<svg[^>]*\bheight="([\d.]+)"', txt)
    m_vb = re.search(r'<svg[^>]*\bviewBox="([^"]+)"', txt)
    w_css = int(float(m_w.group(1))) if m_w else 600
    h_css = int(float(m_h.group(1))) if m_h else 400

    # pagina envoltorio: el SVG al 100% del viewport, sin margenes.
    # ⚠️ Se copia el archivo tal cual (no se reescribe), para medir EL ARCHIVO.
    html = (
        '<!DOCTYPE html><html><head><meta charset="utf-8">'
        '<style>html,body{margin:0;padding:0;background:#fff;overflow:hidden}'
        'svg{display:block;width:%dpx;height:%dpx}</style></head><body>%s</body></html>'
        % (w_css, h_css, txt)
    )
    tmp_html = salida_png.replace(".png", ".html")
    with open(tmp_html, "w", encoding="utf-8") as fh:
        fh.write(html)

    cmd = [
        CHROMIUM, "--headless", "--disable-gpu", "--no-sandbox",
        "--hide-scrollbars", "--force-device-scale-factor=1",
        f"--window-size={w_css},{h_css}",
        f"--screenshot={salida_png}",
        "--default-background-color=FFFFFFFF",
        "file://" + os.path.abspath(tmp_html),
    ]
    subprocess.run(cmd, capture_output=True, timeout=90)
    return os.path.exists(salida_png), w_css, h_css


def bbox_contenido(png, umbral=248):
    """bbox de los pixeles NO blancos + franjas vacias a cada lado."""
    im = Image.open(png).convert("RGB")
    w, h = im.size
    px = im.load()

    def blanco(p):
        return p[0] >= umbral and p[1] >= umbral and p[2] >= umbral

    x0, y0, x1, y1 = w, h, -1, -1
    no_blanco = 0
    for y in range(h):
        for x in range(w):
            if not blanco(px[x, y]):
                no_blanco += 1
                if x < x0: x0 = x
                if x > x1: x1 = x
                if y < y0: y0 = y
                if y > y1: y1 = y

    if x1 < 0:
        return {"vacio": True, "w": w, "h": h}

    izq = x0
    der = w - 1 - x1
    arr = y0
    aba = h - 1 - y1
    return {
        "vacio": False, "w": w, "h": h, "pixeles": no_blanco,
        "bbox": (x0, y0, x1, y1),
        "franja_izq": izq, "franja_der": der,
        "franja_arr": arr, "franja_aba": aba,
        "pct_izq": round(100 * izq / w, 1),
        "pct_der": round(100 * der / w, 1),
        # desbalance = diferencia entre franjas laterales / ancho
        "desbalance_pct": round(100 * abs(izq - der) / w, 1),
    }


def main():
    tmp = tempfile.mkdtemp(prefix="svgmed-")

    # ---------- CONTROL NEGATIVO ----------
    # 1) rectangulo CENTRADO -> debe dar desbalance ~0
    centrado = os.path.join(tmp, "control-centrado.svg")
    with open(centrado, "w") as fh:
        fh.write('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" '
                 'viewBox="0 0 400 200"><rect x="100" y="60" width="200" height="80" '
                 'fill="#000"/></svg>')
    # 2) rectangulo CORRIDO a la derecha -> debe dar desbalance ALTO
    corrido = os.path.join(tmp, "control-corrido.svg")
    with open(corrido, "w") as fh:
        fh.write('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" '
                 'viewBox="0 0 400 200"><rect x="250" y="60" width="140" height="80" '
                 'fill="#000"/></svg>')

    print("=" * 74)
    print("CONTROL DEL INSTRUMENTO  (si no distingue estos dos, el medidor miente)")
    print("=" * 74)
    for nombre, ruta in (("centrado (esperado ~0%)", centrado),
                         ("corrido  (esperado ALTO)", corrido)):
        png = os.path.join(tmp, os.path.basename(ruta) + ".png")
        ok, wc, hc = render_svg(ruta, png)
        if ok:
            m = bbox_contenido(png)
            print(f"  {nombre:26s} desbalance={m.get('desbalance_pct')}%  "
                  f"izq={m.get('franja_izq')}px der={m.get('franja_der')}px")
        else:
            print(f"  {nombre:26s} FALLO EL RENDER")
    print()

    # ---------- LOS SVG REALES ----------
    objetivo = sorted(glob.glob("assets/img/trilobites/*.svg"))
    print("=" * 74)
    print("SVG REALES DEL SITIO")
    print("=" * 74)
    for ruta in objetivo:
        png = os.path.join(tmp, os.path.basename(ruta) + ".png")
        ok, wc, hc = render_svg(ruta, png)
        if not ok:
            print(f"  {os.path.basename(ruta):30s} FALLO EL RENDER")
            continue
        m = bbox_contenido(png)
        nombre = os.path.basename(ruta)
        if m["vacio"]:
            print(f"  {nombre:30s} VACIO (no pinto nada) — medir de nuevo")
            continue
        v = "🔴 DESCENTRADO" if m["desbalance_pct"] >= 8 else "ok"
        print(f"  {nombre:30s} lienzo {m['w']}x{m['h']}  "
              f"franja izq {m['franja_izq']:4d}px ({m['pct_izq']:5.1f}%)  "
              f"der {m['franja_der']:4d}px ({m['pct_der']:5.1f}%)  "
              f"desbalance {m['desbalance_pct']:5.1f}%  {v}")
    print()
    print("Umbral: desbalance >= 8% del ancho = el dibujo NO esta centrado en su lienzo.")
    print(f"PNG de trabajo en {tmp}")


if __name__ == "__main__":
    main()

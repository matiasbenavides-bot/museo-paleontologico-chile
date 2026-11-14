"""Veredicto del barrido del separador: captura cada fotograma a 2x, localiza
la fila del hr y mide el pico. Una fila por fotograma, sin bandas negras.

Uso: .venv/bin/python scripts/veredicto-barrido.py
"""
import statistics

from PIL import Image
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8765"
PASOS = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=2)
    pg.goto(f"{BASE}/index.html", wait_until="domcontentloaded")
    pg.wait_for_timeout(150)
    pg.evaluate("""() => {
      const s = document.querySelector('.separador');
      window.__a = s.getAnimations().map(a => { a.pause(); return a; });
    }""")
    pg.evaluate("""() => document.querySelector('.separador').scrollIntoView({block:'center'})""")
    pg.wait_for_timeout(80)
    rect = pg.evaluate("""() => {const r=document.querySelector('.separador')
        .getBoundingClientRect(); return {t:r.top, w:r.width};}""")

    filas = []
    for fr in PASOS:
        pg.evaluate("""(f) => { for (const a of window.__a)
            a.currentTime = a.effect.getComputedTiming().duration * f; }""", fr)
        pg.wait_for_timeout(40)
        buf = f"/tmp/fr_{int(fr*100):03d}.png"
        # 4px de alto a 2x = 8px de imagen: el hr de 1px cae dentro seguro
        pg.screenshot(path=buf, clip={"x": 0, "y": rect["t"] - 1, "width": rect["w"], "height": 4})
        im = Image.open(buf).convert("RGB")
        w, h = im.size
        mejor = None
        for y in range(h):
            lums = [sum(im.getpixel((x, y))) / 3 for x in range(w)]
            mx = max(lums)
            if mejor is None or mx > mejor[1]:
                mejor = (y, mx, lums.index(mx), statistics.median(lums), w)
        y, mx, xm, med, w = mejor
        filas.append((fr, mx, xm, w, med))
        print(f"  t={fr*100:5.0f}%  fila y={y}  brillo_max={mx:5.0f}  "
              f"x={xm:5d} ({100*xm/w:5.1f}%)  mediana={med:.0f}")

    print()
    xs = [f[2] for f in filas]
    br = [f[1] for f in filas]
    fondo = min(f[4] for f in filas)
    W = filas[0][3]
    print(f"  recorrido del pico : {max(xs)-min(xs)} px de {W}")
    print(f"  brillo máximo      : {max(br):.0f}   (fondo del sitio ~{fondo:.0f})")
    print(f"  contraste          : {max(br)/fondo if fondo else 0:.1f}x")
    ok = (max(xs) - min(xs)) > W * 0.5 and max(br) > fondo * 2
    print("\n  " + ("OK — el barrido RECORRE la línea y se VE" if ok else "FALLA — no se ve el barrido"))
    b.close()

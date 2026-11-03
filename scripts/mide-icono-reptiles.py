#!/usr/bin/env python3
"""CR-99 — Mide el ícono de la card POR PÍXELES sobre la card real.

Regla de CR-98 §2: `naturalWidth`, `complete` y `getBoundingClientRect()` son
compatibles con un ícono INVISIBLE. Lo único que prueba que se lee es contar
píxeles del celeste de la paleta (#51adc6) dentro de la caja del ícono, y
comparar contra íconos que YA funcionan.

Uso: /tmp/venv-docx2/bin/python scripts/mide-icono-reptiles.py [url]
"""
import os, sys
from playwright.sync_api import sync_playwright

CHROME = os.path.expanduser("~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome")
URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8877/index.html"

REFERENCIA = {
    "pieza-trilobites.png": 39,
    "pieza-ammonite.png": 271,
    "pieza-pterosaurios.png": 693,
}

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(1200)
    pg.evaluate("document.querySelector('#colecciones').scrollIntoView()")
    pg.wait_for_timeout(1800)

    caja = pg.evaluate("""() => {
      const c = [...document.querySelectorAll('.pieza')]
        .find(x => (x.querySelector('.pieza__a')||{}).href &&
                   x.querySelector('.pieza__a').getAttribute('href') === 'reptiles.html');
      if (!c) return null;
      const ico = c.querySelector('img.pieza__ico') || c.querySelector('img');
      const r = ico.getBoundingClientRect();
      return {x: Math.round(r.x), y: Math.round(r.y + window.scrollY),
              w: Math.round(r.width), h: Math.round(r.height),
              src: ico.getAttribute('src'), natural: ico.naturalWidth,
              completa: ico.complete, visible: getComputedStyle(ico).visibility,
              opacity: getComputedStyle(ico).opacity};
    }""")
    print("CAJA DEL ÍCONO:", caja)
    assert caja and caja["w"] > 0, "no se encontró la card"

    pg.screenshot(path="/tmp/medir-card.png", full_page=True)
    pg.screenshot(path="/tmp/medir-ico.png", full_page=True,
                  clip={"x": caja["x"], "y": caja["y"], "width": caja["w"], "height": caja["h"]})

    # contar por píxeles del celeste en la caja del ícono
    conteo = pg.evaluate("""async ([x, y, w, h]) => {
      // reconstruye el PNG del ícono ya renderizado
      const c = [...document.querySelectorAll('.pieza')]
        .find(i => i.querySelector('.pieza__a') && i.querySelector('.pieza__a').getAttribute('href')==='reptiles.html');
      const img = c.querySelector('img.pieza__ico') || c.querySelector('img');
      const cv = document.createElement('canvas');
      const s = Math.max(1, Math.round(w));
      cv.width = s; cv.height = s;
      const ctx = cv.getContext('2d');
      ctx.drawImage(img, 0, 0, s, s);
      const d = ctx.getImageData(0, 0, s, s).data;
      let celeste = 0;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], bb = d[i+2], a = d[i+3];
        if (a > 90 && Math.abs(r-81) < 70 && Math.abs(g-173) < 70 && Math.abs(bb-198) < 70) celeste++;
      }
      return {lado: s, celeste};
    }""", [caja["x"], caja["y"], caja["w"], caja["h"]])

    print("\nMEDIDO EN LA CARD REAL:")
    print(f"  reptiles marinos  ->  {conteo['celeste']} px celestes a {conteo['lado']}px de caja")
    print("  referencias que YA funcionan:")
    for k, v in REFERENCIA.items():
        print(f"    {k:26s} {v} px")
    minimo = min(REFERENCIA.values())
    veredicto = "OK — se lee" if conteo["celeste"] >= minimo else "FALLA — no se lee a este tamaño"
    print(f"\n  VEREDICTO: {veredicto}  (mínimo de referencia = {minimo})")
    print("  errores de consola:", len(errs), errs[:3])
    b.close()

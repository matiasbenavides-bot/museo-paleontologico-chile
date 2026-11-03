#!/usr/bin/env python3
"""Verifica la CARD «Reptiles marinos» en la portada y que nada se rompió."""
import os
from playwright.sync_api import sync_playwright

CHROME = os.path.expanduser("~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome")
URL = "http://localhost:8877/index.html"
errores = []
fallas = 0

def ok(c, m, extra=""):
    global fallas
    print(("  OK   " if c else "  FALLA") + "  " + m + (("  -> " + str(extra)) if extra != "" else ""))
    if not c:
        fallas += 1

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.on("pageerror", lambda e: errores.append(str(e)))
    pg.on("console", lambda m: errores.append(m.type + ": " + m.text) if m.type == "error" else None)
    pg.goto(URL, wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(1500)

    cards = pg.evaluate("""() => Array.from(document.querySelectorAll('.pieza')).map(c => ({
        nombre: (c.querySelector('.pieza__n')||c.querySelector('h3')||{}).textContent,
        enlace: (c.querySelector('a')||{}).getAttribute ? c.querySelector('a').getAttribute('href') : null,
        enlaceTexto: (c.querySelector(':scope .pieza__a, :scope a.pieza__a')||{}).textContent,
        texto: c.textContent.trim().slice(0, 90)
    }))""")
    print("\nCARDS EN LA PORTADA:", len(cards))
    for i, c in enumerate(cards, 1):
        print(f"  {i}. {c['nombre']} -> {c['enlace']}  [{c['enlaceTexto']}]")

    rep = [c for c in cards if c["enlace"] == "reptiles.html"]
    ok(len(rep) == 1, "card «Reptiles marinos» presente y ÚNICA", len(rep))
    if rep:
        ok("Reptiles marinos" in (rep[0]["nombre"] or ""), "nombre correcto", rep[0]["nombre"])
        ok("reptiles.html" in (rep[0]["enlaceTexto"] or ""), "enlaceTexto dictado, no «Ver más»", rep[0]["enlaceTexto"])
        ok("Ver más" not in (rep[0]["enlaceTexto"] or ""), "no aparece «Ver más»", rep[0]["enlaceTexto"])

    # el enlace del footer
    foot = pg.evaluate("""() => Array.from(document.querySelectorAll('.footer a'))
        .filter(a => (a.getAttribute('href')||'').includes('reptiles.html')).map(a => a.textContent)""")
    ok(len(foot) == 1, "enlace «Reptiles marinos» en el footer (Explorar)", foot)

    # clic real: la card abre la subpágina
    pg.evaluate("""() => { const a = Array.from(document.querySelectorAll('.pieza a'))
        .find(x => (x.getAttribute('href')||'').includes('reptiles.html')); if (a) a.click(); }""")
    pg.wait_for_timeout(2500)
    ok("reptiles.html" in pg.url, "el clic en la card ABRE la subpágina", pg.url)
    h1 = pg.evaluate("() => (document.querySelector('[data-rpt-titulo]')||{}).textContent")
    ok(h1 == "Reptiles marinos en Chile", "la subpágina pintó su título", h1)

    # no regresión: las otras páginas siguen bien
    print("\nNO REGRESIÓN:")
    for pagina in ["index.html", "trilobites.html", "amonites.html", "tiburones.html",
                   "ambar.html", "dinosaurios.html", "dinosaurios-chile.html",
                   "huellas.html", "pterosaurios.html", "curriculum.html", "proyecto-cec.html"]:
        e2 = []
        p2 = b.new_page(viewport={"width": 1440, "height": 900})
        p2.on("pageerror", lambda e: e2.append(str(e)))
        rr = p2.goto(f"http://localhost:8877/{pagina}", wait_until="domcontentloaded", timeout=60000)
        p2.wait_for_timeout(700)
        ov = p2.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 1")
        ok(rr is not None and rr.status == 200 and not e2 and not ov,
           f"{pagina:22s} 200/errores={len(e2)}/overflow={ov}")
        p2.close()

    b.close()

print("\nERRORES DE CONSOLA:", len(errores), errores[:5])
print("FALLAS TOTALES:", fallas)

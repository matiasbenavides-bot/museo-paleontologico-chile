"""CR-96 — Medición REAL en Chromium de dinosaurios-chile.html.

Mide lo que el navegador pinta, no lo que el data dice:
  - window.MUSEO_RENDER / contadores de nodos pintados
  - figuras, párrafos, pies, cursivas <i>
  - desborde horizontal a 6 anchos
  - imágenes que cargaron de verdad (naturalWidth > 0)
  - errores de consola

Uso: python3 scripts/mide-dinosaurios-chile.py [url]
"""
import sys, json, subprocess, threading, http.server, socketserver, functools, os

CHROME = os.path.expanduser("~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome")
URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8931/dinosaurios-chile.html"

from playwright.sync_api import sync_playwright

ANCHOS = [360, 390, 520, 768, 1024, 1440]
fallas = 0

def ok(cond, msg, extra=""):
    global fallas
    print(("  OK   " if cond else "  FALLA") + "  " + msg + (("  -> " + str(extra)) if extra != "" else ""))
    if not cond:
        fallas += 1

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    errores = []
    page.on("console", lambda m: errores.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errores.append(str(e)))
    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(1500)

    print("=== 1. LA PÁGINA SE PINTÓ (DOM real, no el data) ===")
    r = page.evaluate("""() => {
      const q = s => document.querySelectorAll(s).length;
      const imgs = Array.from(document.querySelectorAll('.dch-fig img'));
      return {
        titulo: document.title,
        secciones: q('.dch-sec'),
        parrafos: q('.dch-sec p'),
        figuras: q('.dch-fig'),
        pies: q('.dch-fig figcaption'),
        cursivas: q('.dch-sec i'),
        imgsCargadas: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
        imgsTotales: imgs.length,
        alto: document.body.scrollHeight,
        creditos: (document.querySelector('[data-footer-derechos]')||{}).textContent || '',
        contacto: q('[data-footer-contacto] li'),
      };
    }""")
    ok(r["secciones"] == 8, "8 secciones pintadas", r["secciones"])
    ok(r["parrafos"] == 19, "19 párrafos pintados", r["parrafos"])
    ok(r["figuras"] == 21, "21 figuras pintadas", r["figuras"])
    ok(r["pies"] == 15, "15 pies pintados", r["pies"])
    ok(r["cursivas"] >= 15, "cursivas <i> pintadas", r["cursivas"])
    ok(r["imgsCargadas"] >= 1, "hay imágenes cargadas al entrar (scrollY=0)", f'{r["imgsCargadas"]}/{r["imgsTotales"]}')
    ok(len(r["creditos"]) > 10, "crédito de derechos en el pie", r["creditos"][:60])
    ok(r["contacto"] >= 2, "contacto del pie pintado", r["contacto"])

    print("\n=== 1b. IMÁGENES: LAZY — se mide en scrollY=0 Y TRAS SCROLLEAR ===")
    print(f"   al entrar: {r['imgsCargadas']}/{r['imgsTotales']} cargadas (lazy: solo las visibles)")
    alto0 = page.evaluate("document.body.scrollHeight")
    y = 0
    while y < alto0:
        page.evaluate(f"window.scrollTo(0,{y})")
        page.wait_for_timeout(120)
        y += 700
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(1200)
    tras = page.evaluate("""() => {
      const imgs = Array.from(document.querySelectorAll('.dch-fig img'));
      return {
        ok: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
        tot: imgs.length,
        rotas: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')),
      };
    }""")
    ok(tras["ok"] == 21, "las 21 imágenes cargan tras scrollear", f'{tras["ok"]}/{tras["tot"]}')
    ok(len(tras["rotas"]) == 0, "0 imágenes rotas (404 o archivo inválido)", tras["rotas"])
    page.evaluate("window.scrollTo(0,0)")
    page.wait_for_timeout(300)

    print("\n=== 2. UN CERO SE INVESTIGA: nodos clave ===")
    detalle = page.evaluate("""() => {
      const s1 = document.querySelectorAll('.dch-sec')[0];
      return {
        primerTitulo: s1 ? s1.querySelector('.dch-sec__t').textContent : null,
        primerParrafo: s1 ? (s1.querySelector('p')||{}).textContent.slice(0,80) : null,
        primerPie: (document.querySelector('.dch-fig figcaption')||{}).textContent || null,
        cur1: (document.querySelector('.dch-sec i')||{}).textContent || null,
      };
    }""")
    print("   sección 1:", detalle["primerTitulo"])
    print("   párrafo 1:", (detalle["primerParrafo"] or "")[:70])
    print("   primer pie:", (detalle["primerPie"] or "")[:70])
    print("   cursiva 1 :", detalle["cur1"])
    ok(detalle["primerTitulo"] == "El Titanosaurio de Pichasca", "el primer título es el correcto del Word")
    ok("Atacamatitan chilensis" in (detalle["cur1"] or ""), "la cursiva es un taxón", detalle["cur1"])

    print("\n=== 3. DESBORDE HORIZONTAL A 6 ANCHOS ===")
    for w in ANCHOS:
        page.set_viewport_size({"width": w, "height": 900})
        page.wait_for_timeout(400)
        m = page.evaluate("""() => ({
          sw: document.documentElement.scrollWidth,
          iw: window.innerWidth,
          figs: document.querySelectorAll('.dch-fig').length,
        })""")
        desb = m["sw"] - m["iw"]
        ok(desb <= 0, f"{w}px sin desborde", f"scrollWidth {m['sw']} vs {m['iw']} (dif {desb})")

    print("\n=== 4. ERRORES DE CONSOLA ===")
    reales = [e for e in errores if "favicon" not in e.lower()]
    ok(len(reales) == 0, "0 errores de consola (sin contar favicon)", reales[:3])

    print("\n=== 5. ALTO DE PÁGINA ===")
    page.set_viewport_size({"width": 1440, "height": 900})
    page.wait_for_timeout(500)
    alto = page.evaluate("document.body.scrollHeight")
    print(f"   alto @1440: {alto} px")
    ok(alto > 6000, "la página tiene cuerpo (no está vacía)", alto)

    b.close()

print("\n" + "=" * 58)
print("TODAS LAS MEDICIONES PASARON" if fallas == 0 else f"FALLAS: {fallas}")
print("=" * 58)
sys.exit(0 if fallas == 0 else 1)

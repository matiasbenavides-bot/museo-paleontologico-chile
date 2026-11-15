"""Mide si alguna figura del visor se sale de su lienzo (y por lo tanto se corta).

El defecto que busca: `.mpv__img` tiene max-height: calc(100vh - 96px), pero el
lienzo que lo contiene NO mide eso. Si la imagen es mas alta que el lienzo, el
`overflow: hidden` del lienzo la RECORTA y el visitante no ve la imagen completa.
Esto no falla en consola: la imagen simplemente aparece cortada.

Mide, para CADA figura de las 9 paginas con visor:
  · alto/ancho del lienzo
  · alto/ancho de la imagen renderizada
  · si la imagen sobresale del lienzo (recorte) en px y en %
  · si el aspect-ratio se conservo

Uso: .venv/bin/python scripts/mide-visor-recorte.py [url_base]
"""
import sys

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8765"
PAGINAS = ["trilobites", "amonites", "ambar", "tiburones", "pterosaurios",
           "reptiles", "dinosaurios", "dinosaurios-chile", "huellas"]
VIEWPORTS = [(1280, 800), (1280, 620), (844, 390), (390, 844)]

JS_MEDIR = """() => {
  const img = document.querySelector('.mpv__img');
  const lienzo = document.querySelector('.mpv__lienzo');
  const escena = document.querySelector('.mpv__escena');
  if (!img || !lienzo) return null;
  const ri = img.getBoundingClientRect();
  const rl = lienzo.getBoundingClientRect();
  const re = escena ? escena.getBoundingClientRect() : null;
  return {
    src: img.getAttribute('src'),
    nat: {w: img.naturalWidth, h: img.naturalHeight},
    img: {w: Math.round(ri.width), h: Math.round(ri.height),
          top: Math.round(ri.top), bot: Math.round(ri.bottom)},
    lienzo: {w: Math.round(rl.width), h: Math.round(rl.height),
             top: Math.round(rl.top), bot: Math.round(rl.bottom)},
    escena: re ? {h: Math.round(re.height), top: Math.round(re.top), bot: Math.round(re.bottom)} : null,
    vh: window.innerHeight,
    corte_abajo: Math.round(ri.bottom - rl.bottom),
    corte_arriba: Math.round(rl.top - ri.top),
    tope_css: getComputedStyle(img).maxHeight
  };
}"""

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    total_mal = 0
    for (vw, vh) in VIEWPORTS:
        print(f"\n########## viewport {vw}x{vh} ##########")
        pg = b.new_page(viewport={"width": vw, "height": vh})
        for pag in PAGINAS:
            pg.goto(f"{BASE}/{pag}.html", wait_until="domcontentloaded")
            pg.wait_for_timeout(700)
            # abrir el visor: la primera figura con visor
            abierto = pg.evaluate("""() => {
              const f = document.querySelector('[data-mpv-abrir]');
              const alt = [...document.querySelectorAll('[data-mpv-abrir]')];
              const el = f || alt[0];
              if (el) { el.click(); return true; }
              return false;
            }""")
            if not abierto:
                print(f"  {pag:<18} no se encontro figura que abra el visor")
                pg.close(); continue
            pg.wait_for_timeout(500)
            malas = []
            # recorrer TODAS las imagenes del visor
            n = pg.evaluate("""() => {
              const t = document.querySelectorAll('.mpv__thumb');
              return t.length;
            }""")
            if n == 0:
                m = pg.evaluate(JS_MEDIR)
                if m: malas.append((1, m))
            for i in range(min(n, 40)):
                pg.evaluate("""(i) => {
                  const t = document.querySelectorAll('.mpv__thumb')[i];
                  if (t) t.click();
                }""", i)
                pg.wait_for_timeout(220)
                m = pg.evaluate(JS_MEDIR)
                if m: malas.append((i + 1, m))

            cortadas = [x for x in malas if x[1]["corte_abajo"] > 2 or x[1]["corte_arriba"] > 2]
            total_mal += len(cortadas)
            if cortadas:
                print(f"  {pag:<18} {len(cortadas)}/{len(malas)} imagenes SE CORTAN")
                for idx, m in cortadas[:4]:
                    print(f"      #{idx} {m['src'][:40]}")
                    print(f"         natural {m['nat']['w']}x{m['nat']['h']} · "
                          f"render {m['img']['w']}x{m['img']['h']} · "
                          f"lienzo {m['lienzo']['w']}x{m['lienzo']['h']} · vh={m['vh']}")
                    print(f"         corte abajo={m['corte_abajo']}px arriba={m['corte_arriba']}px "
                          f"tope_css={m['tope_css']}")
            else:
                print(f"  {pag:<18} OK ({len(malas)} imagenes)")
        pg.close()
    b.close()
    print(f"\n=== TOTAL de imagenes CORTADAS: {total_mal} ===")
    sys.exit(1 if total_mal else 0)

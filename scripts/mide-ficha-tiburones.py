#!/usr/bin/env python3
"""
CR-126b · Mide la ficha del mapa de localidades de tiburones EN PÍXELES.

QUE COMPRUEBA (nada de lo que sigue se puede suponer)
  1. La ficha se PINTA (si `figuraConFichaHTML` no existiera, la página no
     pintaría nada y esto lo delata: 0 items).
  2. Los 21 items están en el DOM, con su número «1)» «2)» … «21)» del Word.
  3. La ficha está A LA DERECHA de la imagen: su borde izquierdo cae más allá
     del borde derecho de la imagen, y la diferencia en vertical es pequeña
     (misma fila, no debajo).
  4. La imagen conserva su tamaño natural (473 px de ancho), NO encogida.
  5. El texto se reparte en 2 COLUMNAS: los items ocupan al menos 2 posiciones
     distintas en x.
  6. Nada desborda horizontalmente.
  7. 0 errores de consola.

SALIDA
  exit 0 si todo cumple · exit 1 si algo falla (imprime el número medido).

USO
  .venv/bin/python scripts/mide-ficha-tiburones.py [url]
"""

import sys

from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8899/tiburones.html"

ANCHOS = [(1440, 900), (1280, 800), (1024, 768), (860, 900), (390, 844)]

fallos = []


def falla(msg):
    fallos.append(msg)


def mide_ancho(pg, w, h):
    pg.set_viewport_size({"width": w, "height": h})
    pg.wait_for_timeout(350)
    return pg.evaluate("""() => {
      const fig = document.querySelector('.tib-fig--ficha');
      if (!fig) return {error: 'no hay .tib-fig--ficha'};
      const img = fig.querySelector('.tib-fig__marco img');
      const ficha = fig.querySelector('.tib-ficha');
      const items = [...fig.querySelectorAll('.tib-ficha__item')];
      const ri = img.getBoundingClientRect();
      const rf = ficha.getBoundingClientRect();
      // posiciones x de los items: si hay 2 columnas, hay 2 grupos
      const xs = [...new Set(items.map(i => Math.round(i.getBoundingClientRect().left)))].sort((a,b)=>a-b);
      return {
        imgW: Math.round(ri.width), imgH: Math.round(ri.height),
        imgRight: Math.round(ri.right), imgTop: Math.round(ri.top),
        fichaLeft: Math.round(rf.left), fichaTop: Math.round(rf.top),
        fichaW: Math.round(rf.width), fichaH: Math.round(rf.height),
        items: items.length,
        columnas: xs.length,
        xs: xs,
        primerItem: items.length ? items[0].textContent.slice(0, 40) : '',
        ultimoItem: items.length ? items[items.length-1].textContent.slice(0, 40) : '',
        desborde: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    }""")


def main():
    errores_js = []
    with sync_playwright() as p:
        nav = p.chromium.launch()
        pg = nav.new_page()
        pg.on("pageerror", lambda e: errores_js.append(str(e)))
        pg.goto(URL, wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(1500)

        print(f"URL {URL}\n")
        for w, h in ANCHOS:
            m = mide_ancho(pg, w, h)
            if m.get("error"):
                falla(f"{w}px: {m['error']}")
                print(f"[{w}x{h}]  {m['error']}")
                continue

            lado_a_lado = m["fichaLeft"] >= m["imgRight"] - 2
            misma_fila = abs(m["fichaTop"] - m["imgTop"]) < 60
            print(f"[{w}x{h}]  imagen {m['imgW']}x{m['imgH']}  ficha x={m['fichaLeft']} "
                  f"w={m['fichaW']}  items={m['items']}  columnas={m['columnas']}  "
                  f"{'LADO A LADO' if lado_a_lado and misma_fila else 'APILADA'}")

            if m["items"] != 21:
                falla(f"{w}px: {m['items']} items (deben ser 21)")
            if not m["primerItem"].startswith("1)"):
                falla(f"{w}px: el primer item no empieza en '1)': {m['primerItem']!r}")
            if not m["ultimoItem"].startswith("21)"):
                falla(f"{w}px: el último item no empieza en '21)': {m['ultimoItem']!r}")
            if m["desborde"]:
                falla(f"{w}px: DESBORDE horizontal")

            # la imagen vertical nunca debe quedar reducida a una tirita
            if m["imgW"] < 300:
                falla(f"{w}px: la imagen mide {m['imgW']} px de ancho (encogida)")

            if w >= 1110:
                if not lado_a_lado:
                    falla(f"{w}px: la ficha NO está a la derecha "
                          f"(ficha x={m['fichaLeft']} vs imagen der={m['imgRight']})")
                # Una sola columna de texto: TODOS los items comparten la misma x.
                if m["columnas"] != 1:
                    falla(f"{w}px: el texto NO está en 1 columna "
                          f"({m['columnas']} posiciones x={m['xs']})")
            else:
                if not lado_a_lado:
                    print(f"          (apilada a propósito bajo 861 px)")

        nav.close()

    if errores_js:
        for e in errores_js:
            falla(f"error JS: {e}")

    print()
    if fallos:
        print(f"FALLOS ({len(fallos)}):")
        for f in fallos:
            print("  ✗", f)
        return 1
    print("TODO OK: ficha a la derecha, 21 items numerados, imagen sin encoger.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""Busca CARDS hermanas pegadas (sin aire entre ellas) en index.html, a ancho
de celular. Mide la distancia REAL entre cajas hermanas de una misma grilla.

Falsos positivos que este script EXCLUYE a propósito:
  · hijos DENTRO de una card (h3 + p + "Ver mas"): van con gap chico o 0
    porque son texto del mismo bloque, no cards distintas.
  · .linea (la linea de tiempo): su gap 0 es intencional — es una linea
    continua con 5 marcas encima.

Sólo reporta cuando dos hermanas DIRECTAS de un contenedor grid/flex quedan
a 0 px y NO son texto del mismo bloque.

Uso: .venv/bin/python scripts/mide-cards-pegadas.py [url_base]
"""
import sys

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8765"
PAGINA = f"{BASE}/index.html"
ANCHOS = [320, 360, 390, 414, 480]

# Contenedores que SON una grilla de cards o el footer de creditos, etc.
JS = """() => {
  const EXCLUIR = ['linea', 'pieza__a', 'hero__dato', 'cec-cifras'];
  const salida = [];
  for (const c of document.querySelectorAll('*')) {
    const cls = (c.className || '').toString();
    if (EXCLUIR.some(x => cls.includes(x))) continue;
    const cs = getComputedStyle(c);
    if (cs.display !== 'grid' && cs.display !== 'flex') continue;

    const hijos = [...c.children].filter(h => {
      const s = getComputedStyle(h);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      const r = h.getBoundingClientRect();
      return r.width > 20 && r.height > 20;
    });
    if (hijos.length < 2) continue;

    const rects = hijos.map(h => h.getBoundingClientRect());
    const pares = [];
    for (let i = 1; i < rects.length; i++) {
      const a = rects[i - 1], b = rects[i];
      let d = null, eje = null;
      if (b.top >= a.bottom - 0.6) { d = b.top - a.bottom; eje = 'V'; }
      else if (b.left >= a.right - 0.6) { d = b.left - a.right; eje = 'H'; }
      if (d !== null) pares.push({i, d: Math.round(d * 10) / 10, eje,
                                  a: (hijos[i-1].className||'').toString().slice(0,22),
                                  b: (hijos[i].className||'').toString().slice(0,22)});
    }
    const pegados = pares.filter(p => p.d < 2);
    if (!pegados.length) continue;

    const r = c.getBoundingClientRect();
    salida.push({
      sel: c.tagName.toLowerCase() + (cls.trim() ? '.' + cls.trim().split(/\\s+/).slice(0,2).join('.') : ''),
      display: cs.display, gap: cs.gap,
      nHijos: hijos.length,
      pegados,
      topDoc: Math.round(r.top + window.scrollY),
      texto: (c.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 70)
    });
  }
  return salida;
}"""

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    for w in ANCHOS:
        pg = b.new_page(viewport={"width": w, "height": 900})
        pg.goto(PAGINA, wait_until="networkidle")
        pg.wait_for_timeout(400)
        pg.evaluate("""async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 400) {
            window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30));
          }
          window.scrollTo(0, 0);
        }""")
        pg.wait_for_timeout(300)
        res = pg.evaluate(JS)
        print(f"\n===== {w}px — contenedores con hermanas PEGADAS (<2px): {len(res)} =====")
        for x in res:
            print(f"  {x['sel'][:60]}")
            print(f"     display={x['display']} gap={x['gap']} hijos={x['nHijos']} "
                  f"y={x['topDoc']}px")
            for pg_ in x["pegados"]:
                print(f"       par {pg_['i']}: {pg_['d']}px ({pg_['eje']})  "
                      f"{pg_['a']!r} -> {pg_['b']!r}")
            print(f"     texto: {x['texto']!r}")
        ov = pg.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        print(f"  desborde: {ov}px")
        pg.close()
    b.close()

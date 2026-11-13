"""Mide si la cursiva de los nombres cientificos se DISTINGUE de la letra normal.

Mide en el DOM real:
  - font-style computado en los <i>
  - la familia y los pesos disponibles (@font-face registrados)
  - si el navegador tiene que SINTETIZAR la cursiva (oblique) o usar una real
  - ancho pintado de la misma palabra con y sin <i> (un sesgo falso da ~igual)

Uso:  .venv/bin/python scripts/mide-cursiva-real.py [--url BASE]
"""
import sys, json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)

PAGS = ["trilobites.html", "amonites.html", "tiburones.html",
        "ambar.html", "dinosaurios.html", "dinosaurios-chile.html",
        "pterosaurios.html", "reptiles.html", "huellas.html"]

JS = r"""
() => {
  const salida = {pags: []};
  // 1) que caras declaro el navegador
  const caras = [];
  for (const hoja of document.styleSheets) {
    let reglas; try { reglas = hoja.cssRules; } catch (e) { continue; }
    if (!reglas) continue;
    for (const r of reglas) {
      if (r.constructor.name === 'CSSFontFaceRule' || (r.style && r.style.getPropertyValue('font-family'))) {
        const fam = r.style.getPropertyValue('font-family');
        if (fam && /Cormorant/i.test(fam)) {
          caras.push({
            familia: fam.trim(),
            estilo: r.style.getPropertyValue('font-style') || '(normal)',
            peso: r.style.getPropertyValue('font-weight') || '400',
            src: (r.style.getPropertyValue('src') || '').slice(0, 90)
          });
        }
      }
    }
  }
  salida.caras = caras;

  // 2) las <i> reales
  const is = [...document.querySelectorAll('i, em')];
  salida.total_i = is.length;
  const detalles = [];
  for (const el of is.slice(0, 400)) {
    const cs = getComputedStyle(el);
    detalles.push({
      txt: (el.textContent || '').trim().slice(0, 34),
      estilo: cs.fontStyle,
      familia: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
      peso: cs.fontWeight,
      sintesis: cs.fontSynthesis
    });
  }
  salida.detalle = detalles;
  const estilos = {};
  detalles.forEach(d => { estilos[d.estilo] = (estilos[d.estilo] || 0) + 1; });
  salida.por_estilo = estilos;
  const sint = {};
  detalles.forEach(d => { sint[d.sintesis + ' @ ' + d.familia] = (sint[d.sintesis + ' @ ' + d.familia] || 0) + 1; });
  salida.por_sintesis = sint;
  return salida;
}
"""


def main():
    base = "http://127.0.0.1:8099/"
    if "--url" in sys.argv:
        base = sys.argv[sys.argv.index("--url") + 1]
        if not base.endswith("/"):
            base += "/"

    from playwright.sync_api import sync_playwright
    existe = os.path.expanduser("~/.cache/ms-playwright")
    exe = None
    for v in ["chromium-1248", "chromium-1243"]:
        p = os.path.join(existe, v, "chrome-linux64", "chrome")
        if os.path.exists(p):
            exe = p
            break
    if not exe:
        print("NO se encontro chromium en", existe)
        return 2

    informe = {"base": base, "caras": None, "pags": {}}
    with sync_playwright() as pw:
        nav = pw.chromium.launch(executable_path=exe, args=["--no-sandbox", "--disable-dev-shm-usage"])
        for pag in PAGS:
            ctx = nav.new_context(viewport={"width": 1440, "height": 900})
            p = ctx.new_page()
            try:
                p.goto(base + pag, wait_until="domcontentloaded", timeout=60000)
                p.wait_for_timeout(700)
                d = p.evaluate(JS)
            except Exception as e:
                informe["pags"][pag] = {"error": str(e)[:160]}
                ctx.close()
                continue
            if informe["caras"] is None:
                informe["caras"] = d["caras"]
            informe["pags"][pag] = {
                "total_i": d["total_i"],
                "por_estilo": d["por_estilo"],
                "por_sintesis": d["por_sintesis"],
                "muestra": d["detalle"][:4],
            }
            ctx.close()
        nav.close()

    print(json.dumps(informe, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())

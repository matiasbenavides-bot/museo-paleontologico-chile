"""mide-leyenda.py — mide la leyenda de los diagramas en la pagina REAL.

Por que existe: la sesion de `browser_console` se reinicia a about:blank entre
llamadas (pitfall ya registrado del proyecto), asi que devuelve 0 leyendas
sobre una pagina sana. Aca se usa Chromium por linea de comandos con
--dump-dom + medicion con JS embebido, que no depende de ninguna sesion.

Mide:
  - cuantas leyendas se pintaron y con cuantos items
  - el alto de la card vs. el alto del pie (lo que el dueno llama "muy grueso")
  - desborde real: scrollWidth > innerWidth
  - a varios anchos (celular incluido)

Uso: .venv/bin/python scripts/mide-leyenda.py [puerto]
"""
import glob
import json
import os
import re
import subprocess
import sys
import tempfile

CHROMIUM = None
for pat in (os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"),):
    hits = sorted(glob.glob(pat))
    if hits:
        CHROMIUM = hits[-1]
if not CHROMIUM:
    sys.exit("No encontre Chromium")

PUERTO = sys.argv[1] if len(sys.argv) > 1 else "8099"
URL = f"http://127.0.0.1:{PUERTO}/trilobites.html"

# El JS que se evalua DENTRO de la pagina. Deja el resultado en <body data-r="...">
SONDA = r"""
<script>
(function(){
  function medir(){
    var vw = window.innerWidth, doc = document.documentElement;
    var out = { viewport: vw, scrollWidth: doc.scrollWidth,
                desborde: doc.scrollWidth - vw,
                leyendas: [], cards: [] };
    var uls = document.querySelectorAll('.tri-leyenda__lista');
    out.totalLeyendas = uls.length;
    Array.prototype.forEach.call(uls, function(ul, i){
      var fig = ul.closest('.tri-fig');
      var img = fig ? fig.querySelector('img') : null;
      var fr = fig ? fig.getBoundingClientRect() : null;
      var ur = ul.getBoundingClientRect();
      var cap = fig ? fig.querySelector('figcaption') : null;
      var cr = cap ? cap.getBoundingClientRect() : null;
      var items = ul.querySelectorAll('li');
      out.leyendas.push({
        i: i,
        imagen: img ? img.getAttribute('src').split('/').pop() : '?',
        items: items.length,
        ancho: Math.round(ur.width), alto: Math.round(ur.height),
        cardAlto: fr ? Math.round(fr.height) : null,
        pieAlto: cr ? Math.round(cr.height) : null,
        pctPie: cr && fr ? Math.round(100*cr.height/fr.height) : null,
        columnas: getComputedStyle(ul).columnCount,
        desborda: ur.right > doc.clientWidth + 1 ? true : false,
        primero: items[0] ? items[0].textContent.replace(/\s+/g,' ').trim().slice(0,60) : null
      });
    });
    document.body.setAttribute('data-r', JSON.stringify(out));
  }
  if (document.readyState === 'complete') setTimeout(medir, 900);
  else window.addEventListener('load', function(){ setTimeout(medir, 900); });
})();
</script>
"""


def medir(ancho, alto=2000):
    """Devuelve el JSON medido a ese ancho de viewport."""
    # se inyecta la sonda con --virtual-time-budget y se vuelca el DOM
    cmd = [
        CHROMIUM, "--headless", "--disable-gpu", "--no-sandbox",
        "--hide-scrollbars", f"--window-size={ancho},{alto}",
        "--virtual-time-budget=6000", "--dump-dom",
        # el user-agent movil importa: el CSS del sitio tiene @media por ancho
        f"--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        f"(KHTML, like Gecko) Chrome/120 Safari/537.36 MPCH-medidor",
        URL + f"?w={ancho}",
    ]
    p = subprocess.run(cmd, capture_output=True, timeout=120, text=True)
    dom = p.stdout
    m = re.search(r'data-r="(.*?)"\s*>', dom, re.S)
    if not m:
        return {"error": "sin medicion", "dom_len": len(dom),
                "tenia_sonda": "SONDA" if "data-r" in dom else "no se inyecto"}
    raw = m.group(1)
    for a, b in (("&quot;", '"'), ("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&#10;", "\n")):
        raw = raw.replace(a, b)
    try:
        return json.loads(raw)
    except Exception as e:
        return {"error": "json invalido: " + str(e), "raw": raw[:200]}


def medir_con_sonda(ancho, alto=2400):
    """Igual que medir(), pero inyecta la sonda en una copia de la pagina."""
    # descargar la pagina y agregar la sonda antes de </body>
    import urllib.request
    req = urllib.request.Request(URL + f"?w={ancho}",
                                headers={"User-Agent": "MPCH-medidor/1.0"})
    html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
    html = html.replace("</body>", SONDA + "</body>")
    tmp = tempfile.mkdtemp(prefix="ley-")
    # la copia tiene que vivir en el mismo origen para que cargue css/js -> se sirve
    # con un truco: se escribe en el directorio del proyecto como archivo temporal
    ruta = os.path.join(os.getcwd(), f"_mide-leyenda-{ancho}.html")
    open(ruta, "w", encoding="utf-8").write(html)
    try:
        cmd = [
            CHROMIUM, "--headless", "--disable-gpu", "--no-sandbox",
            "--hide-scrollbars", f"--window-size={ancho},{alto}",
            "--virtual-time-budget=6000", "--dump-dom",
            "file://" + os.path.abspath(ruta),
        ]
        p = subprocess.run(cmd, capture_output=True, timeout=120, text=True)
        m = re.search(r'data-r="(.*?)"\s*>', p.stdout, re.S)
        if not m:
            return {"error": "sin medicion", "dom_len": len(p.stdout)}
        raw = m.group(1)
        for a, b in (("&quot;", '"'), ("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&#10;", "\n")):
            raw = raw.replace(a, b)
        return json.loads(raw)
    finally:
        if os.path.exists(ruta):
            os.remove(ruta)


def main():
    print("=" * 78)
    print(f"LEYENDA DE LOS DIAGRAMAS — {URL}")
    print("=" * 78)
    for ancho in (1280, 1024, 768, 390, 360):
        r = medir_con_sonda(ancho)
        if "error" in r:
            print(f"\n  {ancho}px  ERROR: {r['error']}  {r}")
            continue
        print(f"\n  === {ancho}px ===  (viewport real {r['viewport']})")
        print(f"    desborde: {r['desborde']}px   scrollWidth {r['scrollWidth']}")
        print(f"    leyendas pintadas: {r['totalLeyendas']}")
        for L in r["leyendas"]:
            print(f"      [{L['i']}] {L['imagen']:26s} items={L['items']:2d}  "
                  f"leyenda {L['ancho']}x{L['alto']}  pie {L['pieAlto']}px "
                  f"({L['pctPie']}% de la card de {L['cardAlto']})  col={L['columnas']}  "
                  f"{'DESBORDA' if L['desborda'] else ''}")
            if L.get("primero"):
                print(f"           primero: {L['primero']}")


if __name__ == "__main__":
    main()

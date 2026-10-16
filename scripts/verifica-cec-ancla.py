"""verifica-cec-ancla.py — comprueba que el renombrado no rompio el sitio.

Mide sobre la pagina REAL servida:
  1. La seccion #cec EXISTE y tiene contenido (el bloque itinerante se pinto)
  2. El ancla de compatibilidad #paleomundo existe y esta CERCA de #cec
  3. Los 6 enlaces del menu apuntan a anclas que EXISTEN en la pagina
  4. Al saltar a #cec, el header fijo NO tapa el logo (CR-62)
  5. El CSS de la muestra (.cec-muestra__*) se aplica (los estilos cargaron)

Uso: .venv/bin/python scripts/verifica-cec-ancla.py [puerto]
"""
import glob
import json
import os
import re
import subprocess
import sys

CHROMIUM = None
for pat in (os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"),):
    hits = sorted(glob.glob(pat))
    if hits:
        CHROMIUM = hits[-1]
if not CHROMIUM:
    sys.exit("No encontre Chromium")

PUERTO = sys.argv[1] if len(sys.argv) > 1 else "8099"

SONDA = r"""
<script>
(function(){
  function medir(){
    var out = {};
    var cec = document.getElementById('cec');
    var vieja = document.getElementById('paleomundo');
    out.existeCec = !!cec;
    out.existeAnclaVieja = !!vieja;
    if (cec && vieja) {
      // distancia entre las dos anclas: deben estar en la misma seccion
      out.distanciaAnclas = Math.round(Math.abs(cec.getBoundingClientRect().top
                                               - vieja.getBoundingClientRect().top));
    }
    // ¿el bloque itinerante se pinto?
    out.hayMuestraCSS = document.querySelectorAll('.cec-muestra, .cec-muestra__caja, .cec-muestra__datos').length;
    out.cajaConTexto = (function(){
      var c = document.querySelector('.cec-muestra__caja');
      return c ? c.textContent.trim().length : 0;
    })();
    out.pildoras = document.querySelectorAll('.cec-muestra__pildora').length;
    // enlaces del menu -> ¿existe el destino?
    out.enlaces = [];
    var nav = document.querySelector('.nav');
    if (nav) {
      Array.prototype.forEach.call(nav.querySelectorAll('a[href*="#"]'), function(a){
        var h = a.getAttribute('href').split('#')[1];
        out.enlaces.push({ texto: a.textContent.trim(), ancla: h,
                           existe: !!document.getElementById(h) });
      });
    }
    // el header tapa al saltar?
    if (cec) {
      var hr = document.querySelector('.header');
      out.headerAlto = hr ? Math.round(hr.getBoundingClientRect().height) : 0;
      // scroll-margin-top aplicado a #cec
      out.scrollMarginCec = getComputedStyle(cec).scrollMarginTop;
    }
    document.body.setAttribute('data-r', JSON.stringify(out));
  }
  window.addEventListener('load', function(){ setTimeout(medir, 1200); });
})();
</script>
"""


def medir(ancho=1280, alto=2000):
    import urllib.request
    url = f"http://127.0.0.1:{PUERTO}/index.html"
    req = urllib.request.Request(url, headers={"User-Agent": "MPCH-medidor/1.0"})
    html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
    html = html.replace("</body>", SONDA + "</body>")
    ruta = os.path.join(os.getcwd(), f"_mide-ancla-{ancho}.html")
    open(ruta, "w", encoding="utf-8").write(html)
    try:
        cmd = [CHROMIUM, "--headless", "--disable-gpu", "--no-sandbox",
               "--hide-scrollbars", f"--window-size={ancho},{alto}",
               "--virtual-time-budget=7000", "--dump-dom",
               "file://" + os.path.abspath(ruta)]
        p = subprocess.run(cmd, capture_output=True, timeout=120, text=True)
        m = re.search(r'data-r="(.*?)"\s*>', p.stdout, re.S)
        if not m:
            return {"error": "sin medicion"}
        raw = m.group(1)
        for a, b in (("&quot;", '"'), ("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&#39;", "'")):
            raw = raw.replace(a, b)
        return json.loads(raw)
    finally:
        if os.path.exists(ruta):
            os.remove(ruta)


def main():
    print("=" * 74)
    print("VERIFICACION DEL RENOMBRADO #paleomundo -> #cec")
    print("=" * 74)
    for ancho in (1280, 390):
        r = medir(ancho)
        if "error" in r:
            print(f"\n{ancho}px ERROR: {r}")
            continue
        print(f"\n=== {ancho}px ===")
        print(f"  seccion #cec existe            : {'SI' if r['existeCec'] else 'NO  <-- ROTO'}")
        print(f"  ancla vieja #paleomundo existe : {'SI' if r['existeAnclaVieja'] else 'NO  <-- enlaces viejos rotos'}")
        if "distanciaAnclas" in r:
            print(f"  distancia entre ambas anclas   : {r['distanciaAnclas']}px  (debe ser 0)")
        print(f"  bloque de la muestra pintado   : {r['hayMuestraCSS']} elementos .cec-muestra*")
        print(f"  texto en la caja               : {r['cajaConTexto']} caracteres")
        print(f"  pildoras de datos              : {r['pildoras']}")
        print(f"  scroll-margin-top en #cec      : {r.get('scrollMarginCec')}  (header mide {r.get('headerAlto')}px)")
        malos = [e for e in r["enlaces"] if not e["existe"]]
        print(f"  enlaces del menu               : {len(r['enlaces'])} revisados, {len(malos)} ROTOS")
        for e in r["enlaces"]:
            print(f"      {'OK ' if e['existe'] else 'ROTO'}  #{e['ancla']:14s} {e['texto']}")


if __name__ == "__main__":
    main()

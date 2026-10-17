"""CR-68 — verificacion de NO REGRESION en las 4 paginas del sitio.

Corre cada pagina a escritorio y movil y comprueba que TODAS sigan sanas:
  - window.MUSEO definido (si no, la pagina queda EN BLANCO)
  - texto renderizado suficiente
  - 0 desborde horizontal
  - 0 imagenes rotas
  - 0 bloques `data-*` sin pintar (los .js/cec.js, curriculum.js y render.js)
Se usa para cerrar cualquier cambio de CSS: es el assert que dice «no rompí nada».

Uso:  .venv/bin/python scripts/verifica-no-regresion.py
"""
import json
import sys
import time

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from mide_cr67_lib import conectar  # noqa: E402

PAGINAS = ["index.html", "curriculum.html", "trilobites.html", "proyecto-cec.html"]
ANCHOS = [1440, 390]

PROBE = """
(() => {
  const o = {
    museo: typeof window.MUSEO !== "undefined",
    texto: document.body.innerText.trim().length,
    alto: document.body.scrollHeight,
    desborde: document.documentElement.scrollWidth > window.innerWidth,
    imgsRojas: [...document.images].filter(i => i.complete && i.naturalWidth === 0).length,
    secciones: document.querySelectorAll("section").length
  };
  /* Bloques `data-*` que el render debería haber pintado y quedaron vacíos.
     ⚠️ Se filtran los que están OCULTOS a propósito: `GALERIA.intro` y los pies
     de foto están VACÍOS por decisión del dueño (nunca los dictó — pendiente
     abierto). Sin este filtro el assert los marca como falla y hace
     «arreglar» algo que no está roto: un test que no puede distinguir
     «vacío a propósito» de «vacío por error» no mide. */
  const pintables = document.querySelectorAll(
    "[data-cec-titulo],[data-cec-bajada],[data-cec-intro],[data-perfil-nombre]," +
    "[data-galeria-intro],[data-cec-etiqueta]");
  o.vacios = [...pintables].filter(e => {
    const cs = getComputedStyle(e);
    if (cs.display === "none" || cs.visibility === "hidden") return false;   // oculto: no aplica
    if (!e.parentElement || getComputedStyle(e.parentElement).display === "none") return false;
    return !e.textContent.trim();
  }).length;
  return JSON.stringify(o);
})()
"""


def main():
    ws, cmd, t = conectar()
    cmd("Network.enable")
    cmd("Network.setCacheDisabled", {"cacheDisabled": True})
    malos = []
    for pag in PAGINAS:
        for w in ANCHOS:
            cmd("Emulation.setDeviceMetricsOverride",
                {"width": w, "height": 900, "deviceScaleFactor": 1, "mobile": w < 700})
            cmd("Page.navigate", {"url": f"http://localhost:8080/{pag}?e={time.time()}"})
            t.sleep(2.6)
            d = json.loads(cmd("Runtime.evaluate", {"expression": PROBE,
                                                    "returnByValue": True})["result"]["value"])
            ok = (d["museo"] and d["texto"] > 1200 and not d["desborde"]
                  and d["imgsRojas"] == 0 and d["vacios"] == 0)
            print(f"{pag:22s} {w:>5}px  museo={d['museo']!s:5s} texto={d['texto']:5d} "
                  f"secc={d['secciones']:2d} desb={d['desborde']!s:5s} "
                  f"imgRojas={d['imgsRojas']} vacios={d['vacios']}"
                  + ("" if ok else "   <<< REVISAR"))
            if not ok:
                malos.append(f"{pag}@{w}")
    print("\nRESULTADO: " + ("las 4 paginas sanas en los 2 anchos" if not malos
                             else "REVISAR -> " + ", ".join(malos)))


if __name__ == "__main__":
    main()

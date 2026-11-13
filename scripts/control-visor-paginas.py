#!/usr/bin/env python3
"""
MPCH — CONTROL DE LÍNEA BASE del visor (CR-105)

Antes de tocar las otras 8 subpáginas se mide el estado REAL de cada una:
cuántas figuras tiene el DOM, cuántas trae el data, si el visor está montado
y cuántas figuras son clicables. Este número es el CONTROL contra el que se
compara después de integrar.

🔴 Regla del proyecto: una verificación que no puede fallar no es una
verificación. Este script reporta el estado, NO dictamina OK/FALLA.

Uso:
    python3 scripts/control-visor-paginas.py           # todas
    python3 scripts/control-visor-paginas.py --json    # salida cruda
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from medir.base import Sitio, servidor  # noqa: E402

PAGINAS = [
    ("trilobites.html", "TRILOBITES"),
    ("amonites.html", "AMMONITES"),
    ("huellas.html", "HUELLAS"),
    ("dinosaurios-chile.html", "DINOSAURIOS_CHILE"),
    ("tiburones.html", "TIBURONES"),
    ("pterosaurios.html", "PTEROSAURIOS"),
    ("ambar.html", "AMBAR"),
    ("dinosaurios.html", "DINOSAURIOS"),
    ("reptiles.html", "REPTILES"),
]


def medir_una(base, pagina):
    s = Sitio(base + "/" + pagina)
    s.abrir()
    try:
        d = s.js("""()=>{
          const figs = document.querySelectorAll('figure');
          const conImg = [...figs].filter(f=>f.querySelector('img'));
          const clicables = [...figs].filter(f=>f.getAttribute('role')==='button');
          const botones = document.querySelectorAll('[data-mpv-abrir]').length;
          return {
            figuras: figs.length,
            figuras_con_img: conImg.length,
            clicables: clicables.length,
            botones: botones,
            visor: !!(window.VISOR && window.VISOR.estado && window.VISOR.estado().montado),
            errs: 0
          };}""")
        d["consola"] = len(s.consola)
        return d
    finally:
        s.__exit__(None, None, None)


def main():
    proc, base = servidor()
    filas = []
    try:
        for pagina, bloque in PAGINAS:
            try:
                d = medir_una(base, pagina)
            except Exception as e:  # noqa: BLE001
                d = {"error": "%s: %s" % (type(e).__name__, e)}
            d["pagina"] = pagina
            d["bloque"] = bloque
            filas.append(d)
    finally:
        proc.terminate()

    if "--json" in sys.argv:
        print(json.dumps(filas, indent=1))
        return 0

    print("%-24s %8s %8s %10s %8s %6s" %
          ("PÁGINA", "FIGURAS", "CLICABLE", "BOTONES", "VISOR", "ERR"))
    print("-" * 72)
    for f in filas:
        if "error" in f:
            print("%-24s  ERROR %s" % (f["pagina"], f["error"]))
            continue
        print("%-24s %8d %8d %10d %8s %6d" %
              (f["pagina"], f["figuras"], f["clicables"], f["botones"],
               "sí" if f["visor"] else "NO", f["consola"]))
    total = sum(f.get("figuras", 0) for f in filas)
    print("-" * 72)
    print("%-24s %8d figuras en total" % ("TOTAL", total))
    return 0


if __name__ == "__main__":
    sys.exit(main())

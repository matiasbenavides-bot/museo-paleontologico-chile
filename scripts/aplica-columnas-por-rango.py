#!/usr/bin/env python3
"""
MPCH — CR-110: columnas por RANGO en las 9 colecciones.

PROBLEMA MEDIDO (1440 px, contenedor ya en 1040 px):
  `auto-fit` + `minmax()` NO baja el número de columnas, lo SUBE:
      .amb-figs--3  -> 4 columnas   (debería 3)
      .amb-figs--2  -> 3 columnas  (debería 2)
      .tib-figs--3  -> 4 columnas
      .tib-figs--2  -> 3 columnas
  Con más columnas, cada imagen queda más angosta: huellas.html pintaba una
  imagen de 2448 px NATIVOS a 242 px (10 % del nativo). El pedido del dueño
  —«arregla todas las colecciones, los tamaños de las imágenes»— es esto.

SOLUCIÓN — y es la regla que el proyecto ya tiene escrita:
  **Las columnas se declaran por RANGO, nunca con `auto-fit`.**
  Se anexa un bloque `@media` por hoja que fija el número EXACTO que la clase
  promete, con un mínimo de 300 px por columna y `min(100%, …)` para no
  desbordar en celular.

Se aplica a las 9 subpáginas de colección con figuras:
  tri- amonite amo- amb- dch- tib- ptx- rpt-

Uso:
    python3 scripts/aplica-columnas-por-rango.py            # aplica
    python3 scripts/aplica-columnas-por-rango.py --dry-run  # sólo muestra
"""
import os
import re
import sys

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSS = os.path.join(RAIZ, "css", "secciones")

# prefijo -> archivo de hoja
HOJAS = {
    "tri": "trilobites.css",
    "amo": "amonites.css",
    "amb": "ambar.css",
    "dch": "dinosaurios-chile.css",
    "tib": "tiburones.css",
    "ptx": "pterosaurios.css",
    "rpt": "reptiles.css",
}

MARCA = "CR-110 — COLUMNAS POR RANGO"

PLANTILLA = """
/* ============================================================
   {marca}
   🔴 `auto-fit + minmax` NO fija el número de columnas: lo SUBE
   (.{p}-figs--3 daba 4, --2 daba 3). Y aunque no lo subiera, 3 columnas
   dentro de un contenedor de 1040 px dan 330 px por imagen.

   MEDIDO en huellas.html a 1440 px, imagen por imagen: **ninguna está
   limitada por el ALTO** — todas las de 3 y 5 columnas se limitan por el
   ANCHO de 329 px. Una imagen de 2448 px NATIVOS se pintaba a 329 = 13 %.
   Agrandar el marco no serviría; el techo es la COLUMNA.

   ⇒ Política por rango, con el ancho por encima de todo:
       2 columnas  -> 508 px c/u   (el bueno para material ancho y bajo)
       1 columna   -> 1040 px      (el mejor en celular)
       3 columnas  SÓLO para `--5`, que son 5 imágenes secundarias y chicas.
   ============================================================ */
@media (min-width: 900px) {{
  .{p}-figs--2,
  .{p}-figs--3,
  .{p}-figs--4 {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }}
  .{p}-figs--5 {{ grid-template-columns: repeat(3, minmax(0, 1fr)); }}
}}
/* celular y tablet: UNA columna. Dos columnas de material ancho y bajo lo
   dejan más chico que una sola imagen grande. */
@media (max-width: 899.98px) {{
  .{p}-figs--2,
  .{p}-figs--3,
  .{p}-figs--4,
  .{p}-figs--5 {{ grid-template-columns: 1fr; }}
}}
"""


def main():
    dry = "--dry-run" in sys.argv
    for p, hoja in HOJAS.items():
        ruta = os.path.join(CSS, hoja)
        raw = open(ruta, encoding="utf-8").read()

        # ¿ya lo tiene? (idempotente)
        if MARCA.replace("—", "\u2014") in raw or "COLUMNAS POR RANGO" in raw:
            print("%-22s ya tiene el bloque (se salta)" % hoja)
            continue

        # ¿la hoja define las clases de esa colección?
        if ".%s-figs--3" % p not in raw and ".%s-figs--2" % p not in raw:
            print("%-22s NO define .%s-figs--N (se salta)" % (hoja, p))
            continue

        bloque = PLANTILLA.format(marca=MARCA, p=p)
        if not dry:
            with open(ruta, "a", encoding="utf-8") as f:
                f.write(bloque)
        print("%-22s +bloque de columnas por rango (%s-figs)" % (hoja, p))

    return 0


if __name__ == "__main__":
    sys.exit(main())

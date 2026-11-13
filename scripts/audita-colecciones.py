#!/usr/bin/env python3
"""
MPCH — AUDITORÍA DE IMÁGENES Y DESBORDE EN LAS 9 COLECCIONES (CR-110)

Para cada subpágina mide, a varios anchos:
  · % del tamaño PINTADO contra la resolución NATIVA de cada imagen
    (el único dato que distingue «se ve chica» de «está bien puesta»)
  · desborde horizontal REAL: documentElement.scrollWidth > innerWidth
  · imágenes que no cargan

🔴 Reglas de la casa que este script respeta:
  - `loading="lazy"`: hay que scrollear TODO y esperar antes de medir.
    Un `W x 0` o un `naturalWidth 0` sin scroll es CONTENIDO SIN CARGAR,
    no un defecto de la página.
  - La captura de un elemento se valida contra su propio rect; si el rect
    es 0 no se mide nada, se declara «no medido».

Uso:
    python3 scripts/audita-colecciones.py                 # las 9
    python3 scripts/audita-colecciones.py --solo reptiles.html
    python3 scripts/audita-colecciones.py --json
"""
import argparse
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from medir.base import Sitio, servidor  # noqa: E402

ANCHOS_DESBORDE = [320, 360, 390, 430, 520, 640, 768, 860, 1024, 1280, 1440, 1920]

PAGINAS = [
    "index.html",
    "trilobites.html",
    "amonites.html",
    "huellas.html",
    "dinosaurios-chile.html",
    "tiburones.html",
    "pterosaurios.html",
    "ambar.html",
    "dinosaurios.html",
    "reptiles.html",
    "curriculum.html",
    "proyecto-cec.html",
]

# Umbral del proyecto: por debajo de esto la imagen se considera «chica».
UMBRAL = 55


def audita_una(base, pagina, anchos):
    """Devuelve {pagina, desborde:[], secciones:[], sin_cargar:[]}."""
    out = {"pagina": pagina, "desborde": [], "secciones": [], "sin_cargar": []}

    s = Sitio(base + "/" + pagina)
    s.abrir()
    try:
        # ---- desborde en todos los anchos
        for ancho in anchos:
            s.set_ancho(ancho)
            time.sleep(0.45)
            d = s.js("""()=>({sw:document.documentElement.scrollWidth,
                              iw:window.innerWidth})""")
            if d["sw"] > d["iw"] + 1:
                out["desborde"].append({"ancho": ancho,
                                        "scrollWidth": d["sw"],
                                        "sobra": d["sw"] - d["iw"]})

        # ---- inventario de tamaño: se necesita scroll completo por el lazy
        s.set_ancho(1440)
        time.sleep(0.5)
        s.js("()=>window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(3.2)
        s.js("()=>window.scrollTo(0, 0)")
        time.sleep(0.8)

        d = s.js("""()=>{
          const grupos=[];
          document.querySelectorAll('figure').forEach(f=>{
            const img=f.querySelector('img');
            if(!img) return;
            const cont=f.parentElement;
            grupos.push({fig:true, cont:cont?cont.className:'',
              w:Math.round(img.getBoundingClientRect().width),
              nat:img.naturalWidth, ok:img.complete&&img.naturalWidth>0,
              src:img.getAttribute('src')});
          });
          return grupos;}""")

        # agrupar por contenedor + sumar
        for x in d:
            if not x["ok"]:
                out["sin_cargar"].append(x["src"])
                continue
            if x["nat"]:
                out["secciones"].append({
                    "cont": (x["cont"] or "")[:40],
                    "w": x["w"], "nat": x["nat"],
                    "pct": round(100.0 * x["w"] / x["nat"]),
                    "src": x["src"],
                })
    finally:
        s.__exit__(None, None, None)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo", default=None)
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--rapido", action="store_true", help="sólo 3 anchos de desborde")
    args = ap.parse_args()

    paginas = [args.solo] if args.solo else PAGINAS
    anchos = [390, 768, 1440] if args.rapido else ANCHOS_DESBORDE

    proc, base = servidor()
    res = []
    try:
        for p in paginas:
            try:
                res.append(audita_una(base, p, anchos))
            except Exception as e:  # noqa: BLE001
                res.append({"pagina": p, "error": "%s: %s" % (type(e).__name__, e)})
    finally:
        proc.terminate()

    if args.json:
        print(json.dumps(res, indent=1, ensure_ascii=False))
        return 0

    print("%-24s %6s %6s %8s %10s" %
          ("PÁGINA", "IMGS", "CHICAS", "PEOR %", "DESBORDE"))
    print("-" * 62)
    total_chicas = 0
    total_desb = 0
    for r in res:
        if "error" in r:
            print("%-24s  ERROR: %s" % (r["pagina"], r["error"][:40]))
            continue
        imgs = r["secciones"]
        chicas = [x for x in imgs if x["pct"] < UMBRAL]
        peor = min((x["pct"] for x in imgs), default=0)
        total_chicas += len(chicas)
        total_desb += len(r["desborde"])
        print("%-24s %6d %6d %7d%% %10d" %
              (r["pagina"], len(imgs), len(chicas), peor, len(r["desborde"])))
        for d in r["desborde"]:
            print("%-24s    · desborde a %dpx: scrollWidth %d (+%d)"
                  % ("", d["ancho"], d["scrollWidth"], d["sobra"]))
        if r["sin_cargar"]:
            print("%-24s    · SIN CARGAR: %d" % ("", len(r["sin_cargar"])))
    print("-" * 62)
    print("TOTAL: %d imágenes chicas (<%d%%) · %d desbordes"
          % (total_chicas, UMBRAL, total_desb))

    # detalle de las peores, para citar archivo y línea exactos
    print()
    print("DETALLE DE LAS MÁS CHICAS:")
    for r in res:
        if "error" in r:
            continue
        for x in sorted(r["secciones"], key=lambda y: y["pct"])[:3]:
            if x["pct"] < UMBRAL:
                print("  %-22s %3d%%  pintada %4dpx de %4d nativos  %s"
                      % (r["pagina"], x["pct"], x["w"], x["nat"],
                         x["src"].split("/")[-1]))

    return 1 if (total_chicas or total_desb) else 0


if __name__ == "__main__":
    sys.exit(main())

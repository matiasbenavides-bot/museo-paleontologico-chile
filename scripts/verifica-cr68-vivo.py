"""CR-68 — verificacion EN VIVO de los arreglos de CSS de las dos paginas de C.E.C.

⚠️ Que el CSS llegue NO es que aplique: acá se carga la URL de GitHub Pages, se
   espera el render y se MIDEN los bordes y las alturas ya pintados.

Uso:  .venv/bin/python scripts/verifica-cr68-vivo.py
"""
import json
import sys
import time

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from mide_cr67_lib import conectar  # noqa: E402

BASE = "https://matiasbenavides-bot.github.io/museo-paleontologico-chile"

PORTADA = """
(() => {
  const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect();
    return { x: Math.round(b.left), w: Math.round(b.width), r: Math.round(b.right) }; };
  const o = { museo: typeof window.MUSEO !== "undefined" };
  /* ⚠️ El enlace a la subpágina NO usa el prefijo `pm-card__`: se llama
     `.cec-muestra__enlace` (lo emite el render así). Buscar `.pm-card__enlace`
     devolvía `null` y el assert lo contaba como desalineado — el test estaba
     mal, no la página. */
  const pares = [["logo", ".pm-card__logo"], ["cabeza", ".pm-card__cabeza"],
                 ["dir", ".pm-card__dir"], ["origen", ".pm-card__origen"],
                 ["enlace", ".cec-muestra__enlace"]];
  o.full = pares.map(([k, sel]) => [k, r(document.querySelector(sel))]);
  // ¿los 5 bloques de ancho completo coinciden en x y en ancho?
  const ws = o.full.map(p => p[1]).filter(Boolean);
  o.fullAlineados = ws.length === 5 && ws.every(v => v.x === ws[0].x && v.w === ws[0].w);
  const d = document.querySelector(".cec-muestra__datos");
  o.datos = d ? [...d.children].map(c => {
    const b = c.getBoundingClientRect();
    return [Math.round(b.width), Math.round(b.height)]; }) : null;
  o.datosIguales = o.datos ? new Set(o.datos.map(JSON.stringify)).size === 1 : false;
  o.nDatos = o.datos ? o.datos.length : 0;
  const ul = document.querySelector(".cec-muestra__lista");
  o.listaAnchos = ul ? [...ul.children].map(l => Math.round(l.getBoundingClientRect().width)) : null;
  o.listaAlturas = ul ? [...ul.children].map(l => Math.round(l.getBoundingClientRect().height)) : null;
  o.desborde = document.documentElement.scrollWidth > window.innerWidth;
  const rol = document.querySelector(".pm-card__dir-rol");
  o.colorRol = rol ? getComputedStyle(rol).color : null;
  return JSON.stringify(o);
})()
"""

SUB = """
(() => {
  const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect();
    return { x: Math.round(b.left), w: Math.round(b.width), r: Math.round(b.right) }; };
  const o = { museo: typeof window.MUSEO !== "undefined" };
  o.cols = [...document.querySelectorAll(".cec-cabeza__texto")].map(r);
  o.bajada = r(document.querySelector(".cec-bajada"));
  o.intro = r(document.querySelector(".cec-intro"));
  o.relacion = r(document.querySelector(".cec-relacion"));
  // los tres bordes derechos deben COINCIDIR
  o.alineados = [o.bajada, o.intro, o.relacion].every(v => v && v.r === o.bajada.r);
  o.colsIguales = o.cols.length === 2 && o.cols[0].w === o.cols[1].w;
  const p = document.querySelector(".cec-intro p");
  if (p && p.firstChild && p.firstChild.nodeType === 3) {
    const rr = document.createRange(); rr.selectNodeContents(p);
    const ancho = Math.max(...[...rr.getClientRects()].map(x => x.width));
    const fs = parseFloat(getComputedStyle(p).fontSize);
    o.linea = { px: Math.round(ancho), car: Math.round(ancho / (fs * 0.5)) };
  }
  o.desborde = document.documentElement.scrollWidth > window.innerWidth;
  return JSON.stringify(o);
})()
"""


def main():
    ws, cmd, t = conectar()
    cmd("Network.enable")
    cmd("Network.setCacheDisabled", {"cacheDisabled": True})
    fallos = []

    print("=== PORTADA (#cec) ===")
    for w in (1440, 390):
        cmd("Emulation.setDeviceMetricsOverride",
            {"width": w, "height": 900, "deviceScaleFactor": 1, "mobile": w < 700})
        cmd("Page.navigate", {"url": f"{BASE}/index.html?v={time.time()}"})
        t.sleep(5)
        o = json.loads(cmd("Runtime.evaluate", {"expression": PORTADA,
                                                "returnByValue": True})["result"]["value"])
        print(f"  {w}px museo={o['museo']} desborde={o['desborde']}")
        print(f"        ancho completo alineados={o['fullAlineados']} -> "
              + " ".join(f"{k}:x{v['x']},w{v['w']}" for k, v in o["full"] if v))
        print(f"        datos: {o['nDatos']} tarjetas iguales={o['datosIguales']} {o['datos']}")
        print(f"        lista anchos={o['listaAnchos']}")
        print(f"        lista alturas={o['listaAlturas']}")
        if not o["museo"]:
            fallos.append(f"portada@{w}: MUSEO no definido")
        if o["desborde"]:
            fallos.append(f"portada@{w}: desborde")
        if not o["fullAlineados"]:
            fallos.append(f"portada@{w}: los 5 bloques de ancho completo NO alinean")
        if not o["datosIguales"]:
            fallos.append(f"portada@{w}: las tarjetas de dato NO son iguales")
        if o["nDatos"] != 4:
            fallos.append(f"portada@{w}: hay {o['nDatos']} tarjetas de dato, no 4")
        if o["colorRol"] and "47, 126, 130" in o["colorRol"]:
            fallos.append(f"portada@{w}: el rotulo sigue con --celeste-dark (contraste 4.05)")

    print("\n=== SUBPAGINA (proyecto-cec) ===")
    for w in (1440, 1024, 390):
        cmd("Emulation.setDeviceMetricsOverride",
            {"width": w, "height": 900, "deviceScaleFactor": 1, "mobile": w < 700})
        cmd("Page.navigate", {"url": f"{BASE}/proyecto-cec.html?v={time.time()}"})
        t.sleep(5)
        o = json.loads(cmd("Runtime.evaluate", {"expression": SUB,
                                                "returnByValue": True})["result"]["value"])
        linea = o.get("linea", {})
        print(f"  {w}px museo={o['museo']} desborde={o['desborde']} "
              f"columna={o['cols'][0]['w'] if o['cols'] else '-'}px  "
              f"linea={linea.get('px','-')}px = {linea.get('car','-')} car")
        print(f"        bajada/intro/relacion alineados={o['alineados']} "
              f"(bordes der: {o['bajada']['r'] if o['bajada'] else '-'}, "
              f"{o['intro']['r'] if o['intro'] else '-'}, "
              f"{o['relacion']['r'] if o['relacion'] else '-'})")
        if not o["museo"]:
            fallos.append(f"subpagina@{w}: MUSEO no definido")
        if o["desborde"]:
            fallos.append(f"subpagina@{w}: desborde")
        if not o["alineados"]:
            fallos.append(f"subpagina@{w}: bajada/intro/relacion NO alinean")
        if not o["colsIguales"]:
            fallos.append(f"subpagina@{w}: las dos columnas no miden igual")
        if w >= 900 and linea.get("car", 0) > 95:
            fallos.append(f"subpagina@{w}: linea de {linea.get('car')} car, muy larga")

    print("\n=========== RESULTADO EN VIVO ===========")
    print("  TODO OK" if not fallos else "\n".join("  FAIL  " + f for f in fallos))


if __name__ == "__main__":
    main()

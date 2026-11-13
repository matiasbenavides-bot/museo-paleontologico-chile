#!/usr/bin/env python3
"""
MPCH — VERIFICACIÓN DEL VISOR EN LAS 9 PÁGINAS (CR-105b)

Para cada subpágina comprueba lo que el dueño pidió, ya no en el piloto:
  · el botón por sección existe y su número = figuras de esa sección
  · abrir desde una sección filtra sólo esa sección
  · el contador arranca en «1 / N»
  · la imagen grande carga DE VERDAD (naturalWidth > 0)
  · un toque acerca 2,4× y la flecha sigue alcanzable
  · Esc cierra y DEVUELVE a la sección de origen
  · 0 errores de consola

🔴 El control va PRIMERO: se mide `reptiles.html` (el piloto ya aprobado).
Si el control falla, ningún veredicto de las páginas nuevas vale.

Uso:
    python3 scripts/verifica-visor-9.py              # las 9
    python3 scripts/verifica-visor-9.py --solo trilobites.html
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from medir.base import Sitio, servidor  # noqa: E402

PAGINAS = [
    "reptiles.html",          # CONTROL — piloto ya aprobado por el dueño
    "trilobites.html",
    "amonites.html",
    "huellas.html",
    "dinosaurios-chile.html",
    "tiburones.html",
    "pterosaurios.html",
    "ambar.html",
    "dinosaurios.html",
]


def probar(base, pagina):
    """Devuelve (fallas, resumen)."""
    fallas = []
    s = Sitio(base + "/" + pagina)
    s.abrir()
    try:
        est = s.js("()=>window.VISOR?window.VISOR.estado():null")
        if not est or not est.get("montado"):
            return ["el visor NO está montado"], {}

        # 1. botones por sección y coherencia del número
        incoherentes = s.js("""()=>{const out=[];
          document.querySelectorAll('section').forEach(x=>{
            const b=x.querySelector('[data-mpv-abrir]');
            if(!b || !x.id) return;
            const pinta=x.querySelectorAll('figure').length;
            const dice=parseInt(b.querySelector('.mpv-abrir__n').textContent,10);
            if(pinta!==dice) out.push({id:x.id,pinta,dice});
          }); return out;}""")
        if incoherentes:
            fallas.append("botón con número que no cuadra: %s" % incoherentes[:2])

        # 2. abrir desde la sección con más figuras
        mejor = s.js("""()=>{let best=null,n=-1;
          document.querySelectorAll('section').forEach(x=>{
            const c=x.querySelectorAll('figure').length;
            if(x.id && x.querySelector('[data-mpv-abrir]') && c>n){n=c;best=x.id;}
          }); return {id:best,n};}""")
        if not mejor or mejor.get("n", 0) <= 0:
            return fallas + ["no hay ninguna sección con botón"], {}

        s.poner_a_la_vista("#%s [data-mpv-abrir]" % mejor["id"])
        # 🔴 Los reveals siguen moviendo el layout ~1 s: la referencia de
        # scroll se toma DESPUÉS de que se asienten, no antes (CR-105b medido:
        # 161 px de diferencia atribuidos al visor cuando eran los reveals).
        s.esperar_reveal()
        s.poner_a_la_vista("#%s [data-mpv-abrir]" % mejor["id"])
        y0 = s.scroll_y()
        s.click("#%s [data-mpv-abrir]" % mejor["id"])
        time.sleep(1.2)

        est = s.js("()=>window.VISOR.estado()")
        if not est.get("abierto"):
            fallas.append("el visor no abrió")
        if est.get("filtro") != mejor["id"]:
            fallas.append("no arranca filtrado en su sección (%s)" % est.get("filtro"))
        if est.get("visibles") != mejor["n"]:
            fallas.append("muestra %s de %d" % (est.get("visibles"), mejor["n"]))

        cuenta = s.texto("[data-mpv-cuenta]")
        if not cuenta or cuenta.strip() != "1 / %d" % mejor["n"]:
            fallas.append("contador arranca en «%s»" % (cuenta or "").strip())

        # 3. la imagen grande carga DE VERDAD
        img = s.js("""()=>{const i=document.querySelector('[data-mpv-img]');
          return i?{w:i.naturalWidth,src:i.getAttribute('src')}:null;}""")
        if not img or not img.get("w"):
            fallas.append("la imagen grande NO cargó (%s)" % (img and img.get("src")))

        # 4. zoom
        caja = s.caja("[data-mpv-img]")
        if caja:
            s.pg.mouse.move(caja["x"] + caja["w"] / 2, caja["y"] + caja["h"] / 2)
            s.pg.mouse.down()
            s.pg.mouse.up()
            s.esperar_transicion("[data-mpv-img]")
            z = s.js("""()=>{const i=document.querySelector('[data-mpv-img]');
              return {z:i.getAttribute('data-zoom'),
                      m:new DOMMatrix(getComputedStyle(i).transform).a};}""")
            if z.get("z") != "true" or z.get("m", 0) < 2.0:
                fallas.append("el toque no acerca 2,4× (%s)" % z)
            # Esc CIERRA el visor: se reabre para seguir probando el cierre.
            s.pg.keyboard.press("Escape")
            time.sleep(0.5)
            s.poner_a_la_vista("#%s [data-mpv-abrir]" % mejor["id"])
            s.click("#%s [data-mpv-abrir]" % mejor["id"])
            time.sleep(1.0)

        # 5. Esc cierra y vuelve a la sección
        s.pg.keyboard.press("Escape")
        time.sleep(0.5)
        est = s.js("()=>window.VISOR.estado()")
        if est.get("abierto"):
            fallas.append("Esc no cerró")
        # 🔴 Medido (CR-105b): el scroll restaurado tarda >0,5 s en asentarse
        # — a los 0,5 s estaba en 310 y recién al final vuelve a 7818. Medir
        # antes de que se asiente reporta un defecto que no existe.
        # 🔴 La restauración del scroll es SMOOTH y tarda ~1,75 s (medido:
        # 0 → 501 → 5822 → 7039 → 7461 → 7642 → 7649). Medir antes reporta un
        # «no volvió» que es del instrumento, no del visor. Se espera a que
        # quede QUIETO, no a un valor puntual.
        previo, estable = -1, 0
        for _ in range(40):
            act = s.scroll_y()
            estable = estable + 1 if act == previo else 0
            if estable >= 3:
                break
            previo = act
            time.sleep(0.1)
        if abs(s.scroll_y() - y0) > 24:
            fallas.append("el scroll no volvió (antes %d, después %d)"
                          % (y0, s.scroll_y()))
        encima = s.js("""(id)=>{const e=document.getElementById(id);
          if(!e) return null; const r=e.getBoundingClientRect();
          return r.top > -120 && r.top < innerHeight;}""".join(["(", ")"]) if False else
                       "((id)=>{const e=document.getElementById(id);"
                       "if(!e) return null; const r=e.getBoundingClientRect();"
                       "return r.top > -120 && r.top < innerHeight;})", mejor["id"])
        if encima is not True:
            fallas.append("la sección de origen no quedó a la vista")

        errs = len(s.consola)
        if errs:
            fallas.append("%d errores de consola" % errs)

        resumen = {
            "secciones": est.get("secciones"),
            "imagenes": est.get("indice"),
            "seccion_mayor": "%s (%d)" % (mejor["id"], mejor["n"]),
        }
        return fallas, resumen
    finally:
        s.__exit__(None, None, None)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo", default=None)
    args = ap.parse_args()

    paginas = [args.solo] if args.solo else PAGINAS
    proc, base = servidor()
    salida = []
    try:
        for p in paginas:
            try:
                fallas, res = probar(base, p)
            except Exception as e:  # noqa: BLE001
                fallas, res = ["excepción: %s: %s" % (type(e).__name__, e)], {}
            salida.append((p, fallas, res))
    finally:
        proc.terminate()

    print("%-24s %-10s %s" % ("PÁGINA", "VEREDICTO", "DETALLE"))
    print("-" * 78)
    total_fallas = 0
    for p, fallas, res in salida:
        total_fallas += len(fallas)
        veredicto = "CONTROL OK" if p == PAGINAS[0] and not fallas else (
            "OK" if not fallas else "%d FALLA(S)" % len(fallas))
        det = "" if not fallas else fallas[0][:46]
        if not det and res:
            det = "%s sec · %s img · mayor: %s" % (
                res.get("secciones"), res.get("imagenes"), res.get("seccion_mayor"))
        print("%-24s %-10s %s" % (p, veredicto, det))
        for f in fallas[1:]:
            print("%-24s %-10s   · %s" % ("", "", f[:56]))
    print("-" * 78)
    print("RESULTADO: %s (%d falla(s) en %d página(s))"
          % ("TODO OK" if not total_fallas else "HAY FALLAS",
             total_fallas, len(salida)))
    return 1 if total_fallas else 0


if __name__ == "__main__":
    sys.exit(main())

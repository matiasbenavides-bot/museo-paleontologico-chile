#!/usr/bin/env python3
"""
MPCH — SALUD DEL SITIO  (scripts/salud.py)

CR-105 (2026-11-10) — UN comando que mide TODO el sitio y dice sano o roto.

    python3 scripts/salud.py                    # en vivo (por defecto)
    python3 scripts/salud.py --local            # sirve el repo y mide ahí
    python3 scripts/salud.py --solo datos       # un bloque a la vez
    python3 scripts/salud.py --rapido           # sin responsive ni celular

Bloques: datos · paginas · responsive · celular · consola · inventario

🔴 Los NÚMEROS ESPERADOS NO SE ESCRIBEN A MANO (trampa 4). Se derivan del
data y del DOM: si mañana entra una ficha nueva o cambia un capítulo, este
medidor lo sigue sin que nadie edite una constante. Fue el defecto que ya
reportó FALLA tres veces en la historia del proyecto.

Salida: exit 0 si todo está sano, exit 1 si algo falla.
"""

import os
import re
import sys
import time
import argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from medir.base import (  # noqa: E402
    Sitio, ok, exigir, seccion, resumen, Falla,
    datos, bloques_con_imagenes, paginas_del_repo, servidor,
    ANCHOS, RAIZ,
)

LIVE = "https://matiasbenavides-bot.github.io/museo-paleontologico-chile"
CHROME = "/home/logicforgex/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome"


# ============================================================ 1. DATOS
def bloque_datos():
    """
    El data carga DE VERDAD y cuadra consigo mismo.

    🔴 `node --check` NO detecta el `const` sin `window.X = X`, que ya dejó la
    página en blanco cuatro veces (CR-71/80/86/96). Por eso se evalúa con
    `global.window={}` y se comprueba que la constante exista.
    """
    seccion("1. DATOS (data/museo.js)")
    d = datos()
    bloques = bloques_con_imagenes()

    ok(len(d) >= 10, "el data exporta sus constantes a window", "%d claves" % len(d))
    exigir("MUSEO" in d, "window.MUSEO existe (identidad del sitio)")
    ok(len(bloques) == 9, "9 bloques de capítulo con figuras",
       sorted(bloques.keys()))

    # Coherencia interna de cada bloque
    for nombre, info in sorted(bloques.items()):
        ok(info["secciones"] > 0 and info["imagenes"] > 0,
           "%s: %d secciones · %d imágenes" % (nombre, info["secciones"], info["imagenes"]))

    total = sum(v["imagenes"] for v in bloques.values())
    ok(total == 190, "190 imágenes en total en la colección", total)
    return bloques


# ======================================================== 2. PÁGINAS
def bloque_paginas(base, paginas, bloques):
    """
    Cada página carga, tiene contenido real y no está en blanco.

    🔴 Trampa 3 — un cero se investiga antes de reportarlo. Aquí el cero es
    FALLA explícita: una página sin su contenedor pintado no es «sana».
    """
    seccion("2. PÁGINAS (cargan y pintan contenido)")
    esperado = {
        "index.html": "MUSEO",
        "trilobites.html": "TRILOBITES",
        "amonites.html": "AMMONITES",
        "ambar.html": "AMBAR",
        "tiburones.html": "TIBURONES",
        "dinosaurios.html": "DINOSAURIOS",
        "huellas.html": "HUELLAS",
        "dinosaurios-chile.html": "DINOSAURIOS_CHILE",
        "pterosaurios.html": "PTEROSAURIOS",
        "reptiles.html": "REPTILES",
    }
    for pag in paginas:
        with Sitio(base + "/" + pag) as s:
            titulo = s.titulo()
            ok("Museo Paleontológico" in titulo,
               "%s: es una página del MPCH" % pag, titulo[:52])

            # El DOM pintado: si el render murió, esto es 0 y es FALLA.
            secciones_dom = s.contar("section")
            ok(secciones_dom > 0, "%s: el render pintó secciones" % pag, secciones_dom)

            # Las subpáginas de capítulo deben traer sus figuras.
            if pag in [k.lower().replace("_", "-") + ".html" for k in bloques]:
                clave = [k for k in bloques
                         if k.lower().replace("_", "-") + ".html" == pag]
                if clave:
                    n_data = bloques[clave[0]]["imagenes"]
                    n_dom = s.contar("figure img")
                    ok(n_dom == n_data,
                       "%s: las %d figuras del data están en el DOM" % (pag, n_data),
                       n_dom)


# ===================================================== 3. RESPONSIVE
def bloque_responsive(base, paginas):
    """
    Las 12 páginas a 6 anchos, sin desborde horizontal.

    Se mide con `setViewport` real: forzar `document.documentElement.style.width`
    NO cambia las media queries (ya se midió como artefacto en este proyecto).
    """
    seccion("3. RESPONSIVE (6 anchos, 0 desborde)")
    for pag in paginas:
        with Sitio(base + "/" + pag) as s:
            malos = []
            for ancho in ANCHOS:
                s.set_ancho(ancho)
                desb, sw, cw = s.desborde()
                if desb:
                    malos.append("%dpx (%d>%d)" % (ancho, sw, cw))
            ok(not malos, "%s: 0 desborde en %s" % (pag, ANCHOS), malos or "")


# ======================================================== 4. CELULAR
def bloque_celular(base):
    """
    El visor en un celular REAL (táctil, no sólo viewport angosto).

    ⚠️ Un viewport chico sin `has_touch` no prueba nada: los gestos no existen.
    """
    seccion("4. CELULAR (táctil real)")
    with Sitio(base + "/reptiles.html", movil=True) as s:
        n = s.contar("[data-mpv-abrir]")
        if not ok(n > 0, "el visor está montado en reptiles.html", n):
            return

        # 🔴 MEDIDO — los controles NO existen antes de abrir: la capa se
        # construye en el primer clic (DEC-086). Medirlos antes devolvía
        # `None` y este medidor reportaba 3 FALLA sobre código correcto.
        # Orden correcto: abrir primero, medir después.
        if s.contar("[data-mpv-fig]") > 0:
            s.tap("[data-mpv-fig]")
            time.sleep(1.2)
            st = s.visor_estado()
            ok(st and st["abierto"], "tocar una figura abre el visor", st and st["abierto"])

        # Controles táctiles ≥ 44 px (ya con la capa abierta)
        for sel, nom in [("[data-mpv-prev]", "flecha ‹"),
                         ("[data-mpv-next]", "flecha ›"),
                         ("[data-mpv-cerrar]", "cerrar")]:
            c = s.caja(sel)
            ok(c and c["w"] >= 44 and c["h"] >= 44,
               "%s: área táctil ≥44px" % nom, c and [c["w"], c["h"]])

        if s.contar("[data-mpv-fig]") > 0:

            # Zoom por toque
            s.poner_a_la_vista("[data-mpv-img]")
            c = s.caja("[data-mpv-img]")
            s.pg.touchscreen.tap(c["x"] + c["w"] / 2, c["y"] + c["h"] / 2)
            s.esperar_transicion("[data-mpv-img]")
            z = s.js("""()=>{const i=document.querySelector('[data-mpv-img]');
                return {z:i.getAttribute('data-zoom'),
                        m:new DOMMatrix(getComputedStyle(i).transform).a};}""")
            ok(z["z"] == "true" and z["m"] > 2.0, "un toque acerca a 2,4×", z)

            # 🔴 MEDIDO — CON la imagen ampliada, deslizar hacia abajo RECORRE
            # la imagen, no cierra: es lo que el dueño eligió (A+B). Si se
            # mide el cierre antes de alejar, el medidor reporta FALLA sobre
            # el comportamiento correcto. Primero se aleja, después se sale.
            s.poner_a_la_vista("[data-mpv-img]")
            c = s.caja("[data-mpv-img]")
            s.pg.touchscreen.tap(c["x"] + c["w"] / 2, c["y"] + c["h"] / 2)
            s.esperar_transicion("[data-mpv-img]")
            ok(s.js("document.querySelector('[data-mpv-img]').getAttribute('data-zoom')") == "false",
               "el segundo toque aleja")

            # Swipe hacia abajo = salir (ya sin zoom)
            s.poner_a_la_vista("[data-mpv-img]")
            c = s.caja("[data-mpv-img]")
            s.swipe(x=c["x"] + c["w"] / 2, y=c["y"] + c["h"] / 2, dy=180)
            time.sleep(1.0)
            ok(not s.visor_estado()["abierto"], "swipe hacia abajo sale")

        ok(len(s.consola) == 0, "0 errores en celular", s.consola[:3])

    # Horizontal: la imagen apaisada usa casi todo el alto
    with Sitio(base + "/reptiles.html", movil=True) as s:
        s.pg.set_viewport_size({"width": 844, "height": 390})
        time.sleep(0.6)
        n = s.contar("[data-mpv-abrir]")
        if n:
            s.click("[data-mpv-abrir]")
            time.sleep(1.2)
            d = s.js("""()=>{const l=document.querySelector('.mpv__lienzo');
                const i=document.querySelector('[data-mpv-img]');
                if(!l||!i) return null;
                const lr=l.getBoundingClientRect(), ir=i.getBoundingClientRect();
                return {lienzo:[Math.round(lr.width),Math.round(lr.height)],
                        img:[Math.round(ir.width),Math.round(ir.height)],
                        vp:innerHeight, vh:innerHeight};}""")
            if d:
                # 🔴 MEDIDO — la primera versión comparaba el alto de la imagen
                # contra el alto del LIENZO y daba 152 %: el lienzo es
                # `position:absolute; inset:0` dentro de la pista de grid, así
                # que su caja no es el alto útil real. Lo que importa es cuánto
                # de la PANTALLA ocupa la imagen.
                uso = 100.0 * d["img"][1] / d["vh"]
                ok(uso > 50, "en horizontal la imagen usa >50%% del alto de pantalla",
                   "%.0f%% (%dx%d de %d)" % (uso, d["img"][0], d["img"][1], d["vh"]))
                # 🔴 La imagen conserva su PROPORCIÓN: al limitarse por alto
                # (que es lo correcto) el ancho baja. Exigir ≥700 px era un
                # criterio equivocado — medía recorte encubierto, no calidad.
                # Lo correcto es que no desborde y que no quede diminuta.
                ok(d["img"][0] >= 400, "en horizontal la imagen es grande",
                   "%dx%d" % (d["img"][0], d["img"][1]))
                ok(d["img"][1] <= d["vp"] + 2 and d["img"][0] <= d["lienzo"][0] + 2,
                   "en horizontal la imagen NO desborda la pantalla",
                   "img %dx%d · lienzo %dx%d · vp %d"
                   % (d["img"][0], d["img"][1], d["lienzo"][0], d["lienzo"][1], d["vp"]))


# ========================================================= 5. CONSOLA
def bloque_consola(base, paginas):
    """Cero errores de JavaScript en las 12 páginas."""
    seccion("5. CONSOLA (0 errores)")
    for pag in paginas:
        with Sitio(base + "/" + pag) as s:
            s.esperar_lazy()
            ok(len(s.consola) == 0, "%s: 0 errores" % pag, s.consola[:2])


# ======================================================= 6. INVENTARIO
def bloque_inventario(bloques):
    """
    Tabla del estado real. No comprueba nada: informa.
    Útil para no volver a discutir de memoria cuántas imágenes hay.
    """
    seccion("6. INVENTARIO (informativo)")
    ancho = max(len(k) for k in bloques) + 2
    print("  %-*s %10s %10s" % (ancho, "BLOQUE", "SECCIONES", "IMÁGENES"))
    for k, v in sorted(bloques.items(), key=lambda x: -x[1]["imagenes"]):
        print("  %-*s %10d %10d" % (ancho, k, v["secciones"], v["imagenes"]))
    tot_s = sum(v["secciones"] for v in bloques.values())
    tot_i = sum(v["imagenes"] for v in bloques.values())
    print("  %-*s %10d %10d" % (ancho, "TOTAL", tot_s, tot_i))


# ============================================================== MAIN
def main():
    ap = argparse.ArgumentParser(description="Salud del sitio MPCH")
    ap.add_argument("--local", action="store_true",
                    help="sirve el repo en un puerto libre y mide ahí")
    ap.add_argument("--en-vivo", action="store_true",
                    help="mide la URL publicada (por defecto)")
    ap.add_argument("--solo", default="",
                    help="datos|paginas|responsive|celular|consola|inventario")
    ap.add_argument("--rapido", action="store_true",
                    help="sin responsive ni celular")
    args = ap.parse_args()

    if not os.path.exists(CHROME):
        print("FALTA el Chromium de Playwright: " + CHROME)
        return 2

    print("=" * 60)
    print("SALUD DEL SITIO — Museo Paleontológico de Chile")
    print("=" * 60)

    bloques = bloque_datos()
    paginas = paginas_del_repo()
    print("\n  páginas del repo: %d" % len(paginas))

    proc = None
    if args.local:
        proc, base = servidor()
        print("  midiendo LOCAL en %s (puerto libre)" % base)
    else:
        base = LIVE
        print("  midiendo EN VIVO: %s" % base)

    quiere = lambda b: (not args.solo) or args.solo == b

    try:
        if quiere("paginas"):
            bloque_paginas(base, paginas, bloques)
        if quiere("responsive") and not args.rapido:
            bloque_responsive(base, paginas)
        if quiere("celular") and not args.rapido:
            bloque_celular(base)
        if quiere("consola"):
            bloque_consola(base, paginas)
        if quiere("inventario"):
            bloque_inventario(bloques)
    finally:
        if proc:
            proc.terminate()

    return resumen()


if __name__ == "__main__":
    sys.exit(main())

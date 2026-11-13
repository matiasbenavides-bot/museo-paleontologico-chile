#!/usr/bin/env python3
"""
MPCH — MEDIDOR DEL VISOR DE IMÁGENES  (scripts/mide-visor.py)

CR-105 (2026-11-10) — Reescrito sobre la base común `scripts/medir/base.py`.
Antes era un script suelto que resolvía por su cuenta las esperas, el clic y
las expectativas escritas a mano. Ahora:

  · los números esperados se DERIVAN del data (trampa 4 resuelta)
  · la espera de transición es la de la base (trampa 1)
  · el clic no mueve la página (trampa 2)
  · nada de ceros silenciosos (trampa 3)
  · `poner_a_la_vista` verifica antes de tocar (trampa 5)

Uso:
    python3 scripts/mide-visor.py [URL]
    python3 scripts/mide-visor.py --local
"""

import os
import sys
import time
import argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from medir.base import (  # noqa: E402
    Sitio, ok, exigir, seccion, resumen, servidor, bloques_con_imagenes, ANCHOS,
)

LIVE = "https://matiasbenavides-bot.github.io/museo-paleontologico-chile/reptiles.html"


def medir(base_url, movil=False):
    """Mide el visor contra `base_url` (URL completa de reptiles.html)."""

    # ---------------------------------------------------------- esperado
    # 🔴 Los números NO se escriben: salen del data. Si mañana el capítulo
    # cambia, este medidor lo sigue sin que nadie edite una constante.
    esp = bloques_con_imagenes()["REPTILES"]
    N_IMG = esp["imagenes"]
    N_SEC = esp["secciones"]

    with Sitio(base_url, movil=movil) as s:

        seccion("0. CARGA")
        ok("Museo Paleontológico" in s.titulo(), "es el sitio correcto",
           s.titulo()[:56])
        est = s.visor_estado()
        exigir(est and est["montado"], "window.VISOR montado", est)
        ok(est["indice"] == N_IMG, "índice derivado del data", 
           "%d imágenes (esperado %d)" % (est["indice"], N_IMG))
        ok(est["secciones"] == N_SEC, "secciones con figuras",
           "%d (esperado %d)" % (est["secciones"], N_SEC))

        # ------------------------------------------------------ botones
        seccion("1. BOTÓN POR SECCIÓN")
        n_btn = s.contar("[data-mpv-abrir]")
        ok(n_btn == N_SEC, "un botón por sección con figuras",
           "%d (esperado %d)" % (n_btn, N_SEC))

        dentro = s.js("""()=>[...document.querySelectorAll('.rpt-sec')]
            .filter(x=>x.querySelector('[data-mpv-abrir]')).length""")
        ok(dentro == N_SEC, "los botones viven dentro de su <section>", dentro)

        descuadre = s.js("""()=>{const out=[];
            document.querySelectorAll('.rpt-sec').forEach(x=>{
              const b=x.querySelector('[data-mpv-abrir]');
              if(!b) return;
              const pinta=x.querySelectorAll('.rpt-fig').length;
              const dice=parseInt(b.querySelector('.mpv-abrir__n').textContent,10);
              if(pinta!==dice) out.push({id:x.id,pinta,dice});
            }); return out;}""")
        ok(len(descuadre) == 0, "el número del botón = figuras de su sección",
           descuadre)

        # ------------------------------------------------- abrir de sección
        seccion("2. ABRIR DESDE UNA SECCIÓN")
        # Se elige la sección con MÁS figuras, no una escrita a mano.
        mejor = s.js("""()=>{let best=null,n=-1;
            document.querySelectorAll('.rpt-sec').forEach(x=>{
              const c=x.querySelectorAll('.rpt-fig').length;
              if(x.querySelector('[data-mpv-abrir]') && c>n){n=c;best=x.id;}
            }); return {id:best,n};}""")
        ok(mejor["n"] > 0, "hay una sección con figuras para probar", mejor)

        s.poner_a_la_vista("#%s [data-mpv-abrir]" % mejor["id"])
        scroll_antes = s.scroll_y()
        s.click("#%s [data-mpv-abrir]" % mejor["id"])
        time.sleep(1.0)

        est = s.visor_estado()
        ok(est["abierto"], "el visor se abrió", est["abierto"])
        ok(est["filtro"] == mejor["id"], "arranca filtrado en su sección",
           est["filtro"])
        ok(est["visibles"] == mejor["n"], "muestra sólo las de esa sección",
           "%d (esperado %d)" % (est["visibles"], mejor["n"]))

        vis = s.js("""()=>{const c=document.querySelector('[data-mpv]');
            const t=getComputedStyle(c);
            return {vis:t.visibility, op:parseFloat(t.opacity), z:t.zIndex};}""")
        ok(vis["vis"] == "visible" and vis["op"] > 0.9, "la capa es visible", vis)
        ok(s.js("document.body.classList.contains('mpv-bloqueo')"),
           "el body queda bloqueado")

        cuenta = s.texto("[data-mpv-cuenta]")
        ok(cuenta and cuenta.strip() == "1 / %d" % mejor["n"],
           "el contador arranca en 1 / %d" % mejor["n"], cuenta)

        img = s.js("""()=>{const i=document.querySelector('[data-mpv-img]');
            return {w:i.naturalWidth, lista:i.getAttribute('data-lista'),
                    src:i.getAttribute('src')};}""")
        ok(img["w"] > 0, "la imagen grande cargó de verdad", img["src"])
        ok(img["lista"] == "true", "la imagen es visible (opacity 1)")

        # ------------------------------------------------ chips de filtro
        seccion("3. FILTRO POR SECCIÓN")
        n_chips = s.contar(".mpv__chip")
        ok(n_chips == N_SEC + 1, "un chip por sección + «Todas»",
           "%d (esperado %d)" % (n_chips, N_SEC + 1))

        s.click('.mpv__chip[data-sec=""]')
        time.sleep(0.5)
        ok(s.visor_estado()["visibles"] == N_IMG, "«Todas» muestra las %d" % N_IMG,
           s.visor_estado()["visibles"])

        # filtrar por la sección más chica (derivada, no escrita)
        chica = s.js("""()=>{let best=null,n=1e9;
            document.querySelectorAll('.rpt-sec').forEach(x=>{
              const c=x.querySelectorAll('.rpt-fig').length;
              if(x.querySelector('[data-mpv-abrir]') && c>0 && c<n){n=c;best=x.id;}
            }); return {id:best,n};}""")
        s.click('.mpv__chip[data-sec="%s"]' % chica["id"])
        time.sleep(0.5)
        ok(s.visor_estado()["visibles"] == chica["n"],
           "filtrar por «%s» da %d" % (chica["id"], chica["n"]),
           s.visor_estado()["visibles"])

        # ---------------------------------------------------- navegación
        seccion("4. NAVEGAR")
        s.click('.mpv__chip[data-sec=""]')
        time.sleep(0.4)
        s.click("[data-mpv-next]")
        time.sleep(0.5)
        ok(s.visor_estado()["pos"] == 1, "flecha › avanza")

        s.pg.keyboard.press("ArrowLeft")
        time.sleep(0.4)
        ok(s.visor_estado()["pos"] == 0, "teclado ← retrocede")

        for _ in range(2):
            s.pg.keyboard.press("ArrowRight")
            time.sleep(0.3)
        ok(s.visor_estado()["pos"] == 2, "teclado → avanza 2")

        s.pg.keyboard.press("ArrowLeft")
        time.sleep(0.2)
        s.pg.keyboard.press("ArrowLeft")
        time.sleep(0.4)
        ok(s.js("document.querySelector('[data-mpv-prev]').disabled") is True,
           "en la primera, ‹ queda deshabilitado")

        # --------------------------------------------------------- zoom
        seccion("5. ACERCAR (A+B)")
        ok(s.js("document.querySelector('[data-mpv-img]').getAttribute('data-zoom')") == "false",
           "arranca sin zoom")

        c = s.caja("[data-mpv-img]")
        s.pg.mouse.move(c["x"] + c["w"] / 2, c["y"] + c["h"] / 2)
        s.pg.mouse.down(); s.pg.mouse.up()
        s.esperar_transicion("[data-mpv-img]")
        z = s.js("""()=>{const i=document.querySelector('[data-mpv-img]');
            return {z:i.getAttribute('data-zoom'),
                    m:new DOMMatrix(getComputedStyle(i).transform).a};}""")
        ok(z["z"] == "true", "el toque/clic amplía")
        ok(z["m"] > 2.0, "la escala aplicada es 2,4×", round(z["m"], 2))

        # la imagen ampliada NO debe salirse de la pantalla (CR-100c)
        dentro_vp = s.js("""()=>{const i=document.querySelector('[data-mpv-img]');
            const r=i.getBoundingClientRect();
            return r.left < innerWidth && r.right > 0 && r.top < innerHeight && r.bottom > 0;}""")
        ok(dentro_vp, "la imagen ampliada sigue dentro de la pantalla")

        # arrastrar recorre y NO navega
        pos_a = s.visor_estado()["pos"]
        s.swipe(desde_selector="[data-mpv-img]", dx=-120, dy=-60)
        s.esperar_transicion("[data-mpv-img]")
        arr = s.js("""()=>{const i=document.querySelector('[data-mpv-img]');
            return {tf:i.style.transform||'', pos:window.VISOR.estado().pos};}""")
        ok("translate" in arr["tf"] and arr["tf"] != "translate(0px, 0px) scale(2.4)",
           "el arrastre mueve la imagen ampliada", arr["tf"][:44])
        ok(arr["pos"] == pos_a, "arrastrar con zoom NO cambia de imagen")

        # segundo toque aleja
        s.swipe(desde_selector="[data-mpv-img]", dx=0, dy=0)
        s.esperar_transicion("[data-mpv-img]")
        ok(s.js("document.querySelector('[data-mpv-img]').getAttribute('data-zoom')") == "false",
           "un segundo toque aleja")

        # doble clic en escritorio (sólo tiene sentido sin táctil)
        if not movil:
            s.js("""()=>{const i=document.querySelector('[data-mpv-img]');
                i.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));}""")
            s.esperar_transicion("[data-mpv-img]")
            ok(s.js("document.querySelector('[data-mpv-img]').getAttribute('data-zoom')") == "true",
               "doble clic amplía (escritorio)")

            sobre = s.js("""()=>{const f=document.querySelector('[data-mpv-next]');
                const b=f.getBoundingClientRect();
                const e=document.elementFromPoint(b.x+b.width/2, b.y+b.height/2);
                return e && e.closest('[data-mpv-next]') ? 'flecha' : (e?e.tagName:'NADA');}""")
            ok(sobre == "flecha", "con zoom, la flecha › sigue alcanzable", sobre)

        # cambiar de imagen reinicia el zoom
        s.click("[data-mpv-next]")
        time.sleep(0.7)
        ok(s.js("document.querySelector('[data-mpv-img]').getAttribute('data-zoom')") == "false",
           "al cambiar de imagen el zoom se reinicia")

        # -------------------------------------------------- cerrar
        seccion("6. CERRAR Y VOLVER A LA SECCIÓN")
        s.pg.keyboard.press("Escape")
        time.sleep(0.4)
        ok(not s.visor_estado()["abierto"], "Esc cierra")
        ok(not s.js("document.body.classList.contains('mpv-bloqueo')"),
           "el body se desbloquea")

        # 🔴 MEDIDO — aquí se falla de dos maneras opuestas y hay que quedar
        # en medio:
        #   · leer demasiado PRONTO → diferencia de 36-140 px (1 de 3 corridas)
        #   · esperar por «altura estable» → la página sigue creciendo y el
        #     navegador reacomoda el scroll; se mide cuando ya se movió, y
        #     entonces la diferencia es de MILES de px (4 de 4 corridas).
        # Lo que de verdad importa es que el `scrollTo` de cierre se aplique:
        # se espera el reveal y se acepta el corrimiento por contenido que
        # sigue cargando (imágenes con lazy). Se exige que la sección de
        # origen quede A LA VISTA, que es el pedido real del dueño.
        s.esperar_reveal()
        dentro = s.js("""(id)=>{const e=document.getElementById(id);
            if(!e) return null; const r=e.getBoundingClientRect();
            return {top:Math.round(r.top), visible: r.top>-120 && r.top<innerHeight};}""",
            mejor["id"])
        ok(dentro and dentro["visible"],
           "la sección de origen queda a la vista al cerrar", dentro)
        ok(abs(s.scroll_y() - scroll_antes) < 400,
           "el scroll no se descoloca (<400 px)",
           "antes=%d despues=%d" % (scroll_antes, s.scroll_y()))

        # 🔴 CR-106 — con el body anclado (`position:fixed`), `window.scrollY`
        # marca 0 MIENTRAS el visor está abierto: es correcto, no un fallo.
        # Lo que hay que exigir es que al cerrar el anclaje se haya SOLTADO;
        # si quedara pegado, la página no volvería a scrollear nunca.
        restos = s.js("""()=>({pos:document.body.style.position||'',
                               top:document.body.style.top||'',
                               clase:document.body.classList.contains('mpv-bloqueo')})""")
        ok(restos["pos"] == "" and restos["top"] == "" and not restos["clase"],
           "el anclaje del body se suelta al cerrar", restos)
        # y que la página vuelva a poder scrollear
        s.js("window.scrollTo(0, 400)")
        time.sleep(0.3)
        ok(s.scroll_y() >= 399, "la página vuelve a scrollear tras cerrar",
           s.scroll_y())
        s.js("window.scrollTo(0, %d)" % scroll_antes)
        time.sleep(0.3)

        # la sección de origen sigue a la vista
        encima = s.js("""(id)=>{const e=document.getElementById(id);
            if(!e) return null; const r=e.getBoundingClientRect();
            return r.top > -80 && r.top < innerHeight;}""", mejor["id"])
        ok(encima is True, "la sección de origen está a la vista", mejor["id"])

        # cerrar con la ×
        s.click("#%s [data-mpv-abrir]" % mejor["id"])
        time.sleep(0.8)
        ok(s.visor_estado()["abierto"], "reabre")
        s.click("[data-mpv-cerrar]")
        time.sleep(0.6)
        ok(not s.visor_estado()["abierto"], "la × cierra")

        # ------------------------------------------------ responsive
        seccion("7. ANCHOS / DESBORDE / CONSOLA")
        for ancho in ANCHOS:
            s.set_ancho(ancho)
            s.sin_desborde("a %dpx" % ancho)
            s.click("[data-mpv-abrir]")
            time.sleep(0.7)
            s.sin_desborde("con la capa abierta a %dpx" % ancho)
            s.pg.keyboard.press("Escape")
            time.sleep(0.4)

        ok(len(s.consola) == 0, "0 errores de consola", s.consola[:3])


def main():
    ap = argparse.ArgumentParser(description="Medidor del visor de imágenes")
    ap.add_argument("url", nargs="?", default=None, help="URL de reptiles.html")
    ap.add_argument("--local", action="store_true", help="servir el repo y medir ahí")
    ap.add_argument("--celular", action="store_true", help="perfil táctil")
    args = ap.parse_args()

    proc = None
    if args.local:
        proc, base = servidor()
        url = base + "/reptiles.html"
        print("midiendo LOCAL: " + url)
    else:
        url = args.url or LIVE
        print("midiendo: " + url)

    try:
        medir(url, movil=args.celular)
    finally:
        if proc:
            proc.terminate()

    return resumen()


if __name__ == "__main__":
    sys.exit(main())

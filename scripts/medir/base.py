#!/usr/bin/env python3
"""
MPCH — BASE COMÚN DE MEDICIÓN  (scripts/medir/base.py)

CR-105 (2026-11-10) — Por qué existe este archivo
--------------------------------------------------
El repo tenía **48 scripts de medición** y **5.768 líneas**, cada uno resolviendo
por su cuenta las mismas cinco trampas. Las trampas costaron falsos FALLA reales
en la sesión CR-100..104:

  1. Se leía una propiedad ANTES de que terminara su transición  → escala 1 en vez de 2.4
  2. `page.click()` desplaza la página por su cuenta              → referencia de scroll corrupta
  3. Un cero no se distinguía de una carga fallida                → «OK» con 0 botones
  4. Los números esperados estaban escritos a mano                → FALLA sobre código correcto
  5. `elemento.click()` no basta en móvil: el elemento puede quedar fuera de pantalla

Esta base resuelve las cinco UNA vez, y todos los medidores nuevos la usan.

⚠️ NO se refactorizan los 48 scripts viejos (principio de mínima intervención):
siguen funcionando como están. Los nuevos se escriben sobre esta base.

Uso típico:

    from base import Sitio, ok, Falla

    with Sitio("reptiles.html") as s:
        ok(s.contar("[data-mpv-abrir]") == 11, "11 botones")
        s.abrir_visor("#ictiosaurios [data-mpv-abrir]")
        ok(s.visor_estado()["abierto"], "el visor abrió")
        s.esperar_transicion(".mpv__img")
"""

import os
import re
import sys
import time
import json
import shutil
import subprocess

# ---------------------------------------------------------------- constantes
CHROME = os.path.expanduser(
    "~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome"
)

# Anchos de la verificación de responsive, tal como los exige el proyecto.
ANCHOS = [360, 390, 520, 768, 1024, 1440]

# Perfil de celular REAL: no basta un viewport angosto, hace falta táctil.
CELULAR = dict(viewport={"width": 390, "height": 844}, is_mobile=True,
               has_touch=True, device_scale_factor=3)

CELULAR_H = dict(viewport={"width": 844, "height": 390}, is_mobile=True,
                 has_touch=True, device_scale_factor=3)

# Tiempos medidos en este proyecto. No son «esperas a ojo»: cada uno responde
# a una animación concreta y están aquí para no volver a equivocarse.
ESPERA_TRANSICION = 1.1     # `.mpv__img` anima transform .32 s
ESPERA_REVEAL = 1.6         # animaciones.js sigue moviendo el scroll ~1 s
ESPERA_LAZY = 2.5           # figuras con loading="lazy"


# ------------------------------------------------------------------ fallas
class Falla(Exception):
    """Una comprobación que no se cumplió."""


_resultados = {"ok": 0, "falla": 0, "detalle": []}


def ok(condicion, mensaje, extra=""):
    """Registra una comprobación. Devuelve el booleano para poder encadenar."""
    if condicion:
        _resultados["ok"] += 1
        print("  OK    | " + mensaje + (("  " + str(extra)) if extra != "" else ""))
    else:
        _resultados["falla"] += 1
        _resultados["detalle"].append(mensaje)
        print("  FALLA | " + mensaje + (("  " + str(extra)) if extra != "" else ""))
    return bool(condicion)


def exigir(condicion, mensaje, extra=""):
    """Como `ok`, pero corta la medición si falla. Para precondiciones."""
    if not ok(condicion, mensaje, extra):
        raise Falla(mensaje)


def seccion(titulo):
    print("\n=== " + titulo + " ===")


def resumen():
    """Imprime el resumen y devuelve el código de salida."""
    print("\n" + "=" * 60)
    if _resultados["falla"]:
        print("RESULTADO: %d FALLA(S) de %d comprobaciones"
              % (_resultados["falla"], _resultados["ok"] + _resultados["falla"]))
        for d in _resultados["detalle"]:
            print("  - " + d)
        return 1
    print("RESULTADO: TODO OK (%d comprobaciones)" % _resultados["ok"])
    return 0


# --------------------------------------------------------------- navegador
class Sitio:
    """
    Navegador listo para medir, con las trampas ya resueltas.

        with Sitio("reptiles.html") as s:
            s.contar(".pieza")
            s.abrir_visor(sel)
            s.swipe(x, y, dx=0, dy=180)

    Acepta una URL completa (`https://…`) o el nombre de una página del repo,
    en cuyo caso se sirve local. La URL en vivo es SIEMPRE preferible para
    publicar: mide lo que el visitante recibe de verdad.
    """

    def __init__(self, pagina="index.html", ancho=1440, alto=900,
                 movil=False, base_local=None, url=None):
        from playwright.sync_api import sync_playwright

        self.pagina = pagina
        self.ancho, self.alto = ancho, alto
        self.movil = movil
        self.consola = []
        self._p = sync_playwright().start()
        self._b = self._p.chromium.launch(
            executable_path=CHROME,
            args=[
                "--no-sandbox",
                # 🔴 Sin esto, Chromium headless reporta `(pointer: fine)` y
                # `(hover: hover)` como FALSE y el :hover nunca se activa:
                # el medidor da FALLA sobre código correcto.
                "--blink-settings=primaryPointerType=4,availablePointerTypes=4,"
                "primaryHoverType=2,availableHoverTypes=2",
            ],
        )
        perfil = dict(CELULAR if movil else
                      dict(viewport={"width": ancho, "height": alto}))
        self.ctx = self._b.new_context(**perfil)
        self.pg = self.ctx.new_page()
        self.pg.on("pageerror", lambda e: self.consola.append("PAGEERROR: " + str(e)))
        self.pg.on("console", lambda m: self.consola.append(m.text)
                   if m.type == "error" else None)

        self.url = url or self._resolver(pagina, base_local)
        self.abrir()

    # ---------------------------------------------------------------- URL
    @staticmethod
    def _resolver(pagina, base_local):
        if pagina.startswith("http://") or pagina.startswith("https://"):
            return pagina
        base = base_local or os.environ.get("MPCH_BASE")
        if not base:
            raise Falla(
                "No hay base. Pasa una URL completa, o define MPCH_BASE, o usa "
                "Sitio.con_servidor_local() para servir el repo en un puerto libre."
            )
        return base.rstrip("/") + "/" + pagina.lstrip("/")

    @classmethod
    def con_servidor_local(cls, pagina="index.html", puerto=0, **kw):
        """
        Sirve el repo en un puerto LIBRE y devuelve un Sitio.

        🔴 El puerto se elige libre, no fijo: en este proyecto se midió el
        museo equivocado porque otra sesión tenía tomado el 8899. Además se
        comprueba el <title> antes de medir nada.
        """
        import socket
        if not puerto:
            s = socket.socket()
            s.bind(("127.0.0.1", 0))
            puerto = s.getsockname()[1]
            s.close()
        raiz = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        proc = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(puerto)],
            cwd=raiz, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        # esperar a que responda, sin dormir a ciegas
        import urllib.request
        for _ in range(60):
            try:
                urllib.request.urlopen("http://127.0.0.1:%d/%s" % (puerto, pagina), timeout=1)
                break
            except Exception:
                time.sleep(0.25)
        inst = cls(pagina, base_local="http://127.0.0.1:%d" % puerto, **kw)
        inst._servidor = proc
        return inst

    # -------------------------------------------------------------- básico
    def abrir(self, espera=None):
        # 🔴 `wait_until="load"` da timeout de 30 s en esta máquina: se usa
        # `domcontentloaded` con timeout largo, que es lo que funciona aquí.
        self.pg.goto(self.url, wait_until="domcontentloaded", timeout=60000)
        time.sleep(espera if espera is not None else ESPERA_REVEAL)
        return self

    def titulo(self):
        return self.pg.title()

    def js(self, expr, arg=None):
        return self.pg.evaluate(expr, arg) if arg is not None else self.pg.evaluate(expr)

    def contar(self, selector):
        return self.pg.evaluate(
            "(s)=>document.querySelectorAll(s).length", selector)

    def texto(self, selector):
        return self.pg.evaluate(
            """(s)=>{const e=document.querySelector(s); return e?e.textContent:null;}""",
            selector)

    def visible(self, selector):
        return self.pg.evaluate("""(s)=>{
            const e=document.querySelector(s);
            if(!e) return false;
            const r=e.getBoundingClientRect();
            const st=getComputedStyle(e);
            return r.width>0 && r.height>0 && st.visibility!=='hidden' && st.display!=='none';
        }""", selector)

    def caja(self, selector):
        return self.pg.evaluate("""(s)=>{
            const e=document.querySelector(s);
            if(!e) return null;
            const r=e.getBoundingClientRect();
            return {x:Math.round(r.x),y:Math.round(r.y),
                    w:Math.round(r.width),h:Math.round(r.height),
                    top:Math.round(r.top),bottom:Math.round(r.bottom),
                    vx:Math.round(r.x),vy:Math.round(r.y),
                    py:Math.round(r.y+window.scrollY),
                    scrollY:window.scrollY};}""", selector)

    # ---------------------------------------------------- esperas correctas
    def esperar_transicion(self, selector=None, ms=None):
        """
        🔴 TRAMPA 1 — Leer una propiedad durante la transición devuelve el
        valor INICIAL. Medido: `getComputedStyle(img).transform` daba escala
        `1` cuando el CSS ya decía `scale(2.4)`, y el medidor reportaba FALLA
        sobre código correcto.

        Espera a que la transición TERMINE (no un tiempo a ojo): consulta
        `getAnimations()` del nodo si existe, y cae en `ESPERA_TRANSICION`.
        """
        if ms is not None:
            time.sleep(ms / 1000.0)
            return self
        if selector:
            for _ in range(40):
                listo = self.pg.evaluate("""(s)=>{
                    const e=document.querySelector(s);
                    if(!e) return true;
                    if(!e.getAnimations) return true;
                    return e.getAnimations().every(a=>a.playState==='finished');
                }""", selector)
                if listo:
                    return self
                time.sleep(0.05)
        time.sleep(ESPERA_TRANSICION)
        return self

    def esperar_reveal(self):
        """Los reveals del sitio siguen moviendo el layout ~1 s. Para el scroll."""
        time.sleep(ESPERA_REVEAL)
        return self

    def esperar_lazy(self):
        """`loading="lazy"`: sin esto la captura sale antes de que carguen."""
        time.sleep(ESPERA_LAZY)
        return self

    def esperar_imagenes(self, selector="img"):
        """Espera a que TODAS las imágenes del selector carguen (o fallen)."""
        for _ in range(80):
            n = self.pg.evaluate("""(s)=>{
                return [...document.querySelectorAll(s)]
                  .filter(i=>i.complete).length;}""", selector)
            total = self.contar(selector)
            if total == 0 or n >= total:
                return self
            time.sleep(0.1)
        return self

    # -------------------------------------------- tocar / clicar sin trampas
    def poner_a_la_vista(self, selector, intentos=10, margen=4):
        """
        🔴 TRAMPA 5 — `scrollIntoView` NO garantiza que el elemento quede
        tocable en móvil. Medido: una figura quedaba con `top: 844` (el borde
        exacto de la pantalla) y `elementFromPoint` devolvía NADA; el tap caía
        en el vacío y parecía que el visor «no abría en celular».

        Desplaza y VERIFICA que quedó dentro; reintenta si no.
        """
        for _ in range(intentos):
            info = self.pg.evaluate("""([s,m])=>{
                const e=document.querySelector(s);
                if(!e) return null;
                const r=e.getBoundingClientRect();
                return {top:r.top,bottom:r.bottom,h:r.height,
                        vh:innerHeight,
                        dentro: r.top>=m && r.bottom<=innerHeight-m && r.height>0};}""",
                [selector, margen])
            if info is None:
                time.sleep(0.4)
                continue
            if info["dentro"]:
                return info
            self.pg.evaluate("""(s)=>{const e=document.querySelector(s);
                if(e) e.scrollIntoView({block:'center'});}""", selector)
            time.sleep(0.6)
        return info

    def click(self, selector):
        """
        🔴 TRAMPA 2 — `page.click()` de Playwright ejecuta
        `scrollIntoViewIfNeeded()` ANTES del clic. Medido: desplazó la página
        +1414 px DESPUÉS de que el medidor tomara la referencia de scroll, y
        la comprobación de «volver a la misma sección» falló sobre código
        correcto.

        Aquí se hace `click()` del DOM: dispara el manejador y NO mueve nada.
        """
        self.pg.evaluate("""(s)=>{
            const e=document.querySelector(s);
            if(!e) throw new Error('no existe: '+s);
            e.click();}""", selector)
        return self

    def tap(self, selector):
        """Toque real en móvil. Pone a la vista y VERIFICA que sea tocable."""
        info = self.poner_a_la_vista(selector)
        if not info:
            raise Falla("no se pudo poner a la vista: " + selector)
        c = self.caja(selector)
        self.pg.touchscreen.tap(c["x"] + c["w"] / 2, c["y"] + c["h"] / 2)
        return self

    def scroll_y(self):
        return self.pg.evaluate("window.scrollY")

    def swipe(self, desde_selector=None, x=None, y=None, dx=0, dy=0, pasos=12):
        """
        Deslizar. Usa el centro del selector, o coordenadas explícitas.
        Se usa ratón a propósito: Playwright no tiene swipe táctil y el
        manejador del visor escucha `pointerdown/move/up`, que es lo mismo.
        """
        if desde_selector:
            c = self.caja(desde_selector)
            x = c["x"] + c["w"] / 2
            y = c["y"] + c["h"] / 2
        self.pg.mouse.move(x, y)
        self.pg.mouse.down()
        self.pg.mouse.move(x + dx, y + dy, steps=pasos)
        self.pg.mouse.up()
        return self

    # ----------------------------------------------------------- responsive
    def set_ancho(self, ancho, alto=None):
        self.pg.set_viewport_size(
            {"width": ancho, "height": alto or self.alto})
        time.sleep(0.5)
        return self

    def desborde(self):
        """Devuelve (desborda, scrollWidth, clientWidth)."""
        d = self.pg.evaluate("""()=>({sw:document.documentElement.scrollWidth,
                                      cw:document.documentElement.clientWidth})""")
        return (d["sw"] > d["cw"] + 1, d["sw"], d["cw"])

    def sin_desborde(self, etiqueta=""):
        desb, sw, cw = self.desborde()
        return ok(not desb, "sin desborde horizontal " + etiqueta,
                  "%d>%d" % (sw, cw))

    # --------------------------------------------------------------- visor
    def visor_estado(self):
        return self.pg.evaluate("window.VISOR ? window.VISOR.estado() : null")

    def abrir_visor(self, selector):
        self.click(selector)
        time.sleep(1.0)
        return self.visor_estado()

    # ------------------------------------------------------------- capturas
    def captura(self, ruta):
        self.pg.screenshot(path=ruta)
        return ruta

    # ---------------------------------------------------------------- cierre
    def cerrar(self):
        try:
            self.ctx.close()
        finally:
            self._b.close()
            self._p.stop()

    def __enter__(self):
        return self

    def __exit__(self, *a):
        self.cerrar()
        proc = getattr(self, "_servidor", None)
        if proc:
            proc.terminate()
        return False


# ------------------------------------------------------- utilidades de repo
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def datos():
    """
    Carga `data/museo.js` y devuelve todas sus constantes exportadas.

    🔴 Se ejecuta con `eval` en Node y `global.window={}` porque `node --check`
    NO detecta el bug de `const X` sin `window.X = X`, que ya dejó la página en
    blanco 4 veces (CR-71/80/86/96).
    """
    script = (
        "global.window={};"
        "eval(require('fs').readFileSync('data/museo.js','utf8'));"
        "const out={};"
        "Object.keys(window).forEach(k=>{"
        "  const v=window[k];"
        "  if(v&&typeof v==='object'){"
        "    out[k]=Array.isArray(v.secciones)?"
        "      {secciones:v.secciones.length,"
        "       imagenes:v.secciones.reduce((a,s)=>a+((s.imagenes||[]).length),0)}"
        "      :'objeto';"
        "  }});"
        "console.log(JSON.stringify(out));"
    )
    r = subprocess.run(["node", "-e", script], cwd=RAIZ,
                       capture_output=True, text=True)
    if r.returncode != 0:
        raise Falla("data/museo.js no carga: " + r.stderr.strip()[:300])
    return json.loads(r.stdout)


def bloques_con_imagenes():
    """{BLOQUE: {secciones, imagenes}} sólo de los que tienen figuras."""
    return {k: v for k, v in datos().items()
            if isinstance(v, dict) and v.get("imagenes")}


def paginas_del_repo():
    return sorted(f for f in os.listdir(RAIZ) if f.endswith(".html"))


def servidor(puerto=0):
    """
    Levanta un servidor local en un puerto LIBRE y devuelve (proc, base).

    🔴 El puerto fijo 8899 ya causó medir el museo equivocado (otra sesión lo
    tenía tomado). Se elige libre y se comprueba el título antes de medir.
    """
    import socket
    import urllib.request
    if not puerto:
        s = socket.socket()
        s.bind(("127.0.0.1", 0))
        puerto = s.getsockname()[1]
        s.close()
    proc = subprocess.Popen([sys.executable, "-m", "http.server", str(puerto)],
                            cwd=RAIZ, stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL)
    base = "http://127.0.0.1:%d" % puerto
    for _ in range(80):
        try:
            urllib.request.urlopen(base + "/index.html", timeout=1)
            return proc, base
        except Exception:
            time.sleep(0.25)
    proc.terminate()
    raise Falla("el servidor local no respondió en %s" % base)


if __name__ == "__main__":
    # Autoprueba de la base: sin esto, un fallo de la base se confundiría
    # con un fallo del sitio.
    print("Base de medición MPCH")
    print("  CHROME:", "OK" if os.path.exists(CHROME) else "NO EXISTE")
    print("  RAIZ:  ", RAIZ)
    d = datos()
    print("  data:  ", len(d), "constantes exportadas")
    print("  bloque con figuras:", bloques_con_imagenes())
    print("  páginas:", len(paginas_del_repo()))
    sys.exit(0 if os.path.exists(CHROME) else 1)

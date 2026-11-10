#!/usr/bin/env python3
"""
MPCH — Medidor del VISOR DE IMÁGENES (CR-100 + CR-101)

Verifica con Chromium REAL lo que el dueño pidió, punto por punto:
  1. Botón «Ver imágenes» al inicio de CADA sección con figuras
  2. Abre con SOLO las figuras de esa sección (filtro de origen)
  3. Filtro por sección desde los chips
  4. Navegar ‹ › y con teclado
  5. Acercar con toque/tecla y recorrer arrastrando (A+B)
  6. Cerrar (Esc / ×) y VOLVER A LA SECCIÓN de origen
  7. 6 anchos, 0 desborde horizontal, 0 errores de consola

Uso:  /tmp/venv-docx2/bin/python scripts/mide-visor.py [URL]
      por defecto http://127.0.0.1:8931/reptiles.html
"""
import sys, json
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8931/reptiles.html"
CHROME = "/home/logicforgex/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome"
ANCHOS = [360, 390, 520, 768, 1024, 1440]

fallas = []
def ok(cond, msg, extra=""):
    print(("  OK   " if cond else "  FALLA") + " | " + msg + (("  " + str(extra)) if extra else ""))
    if not cond:
        fallas.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch(
        executable_path=CHROME,
        args=[
            "--no-sandbox",
            "--blink-settings=primaryPointerType=4,availablePointerTypes=4,"
            "primaryHoverType=2,availableHoverTypes=2",
        ],
    )
    errs = []
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errs.append("PAGEERROR: " + str(e)))

    print("\n=== 0. CARGA ===")
    pg.goto(URL, wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(2500)
    titulo = pg.title()
    ok("Museo Paleontológico" in titulo, "es el sitio correcto", titulo[:60])

    api = pg.evaluate("window.VISOR ? window.VISOR.estado() : null")
    ok(api is not None and api.get("montado"), "window.VISOR montado", api)
    ok(api and api["indice"] == 24, "índice derivado = 24 imágenes", api and api["indice"])
    ok(api and api["secciones"] == 11, "11 secciones con figuras", api and api["secciones"])

    print("\n=== 1. BOTÓN POR SECCIÓN ===")
    n_btn = pg.evaluate("document.querySelectorAll('[data-mpv-abrir]').length")
    ok(n_btn == 11, "11 botones «Ver imágenes» (uno por sección con figuras)", n_btn)

    # Cada botón debe estar DENTRO de su sección y justo después del título
    dentro = pg.evaluate("""
      [...document.querySelectorAll('.rpt-sec')].filter(s=>s.querySelector('[data-mpv-abrir]')).length
    """)
    ok(dentro == 11, "los 11 botones viven dentro de su <section>", dentro)

    # El contador de cada botón debe coincidir con las figuras de su sección
    coincide = pg.evaluate("""
      (()=>{
        const out=[];
        document.querySelectorAll('.rpt-sec').forEach(s=>{
          const b=s.querySelector('[data-mpv-abrir]');
          if(!b) return;
          const pinta=s.querySelectorAll('.rpt-fig').length;
          const dice=parseInt(b.querySelector('.mpv-abrir__n').textContent,10);
          if(pinta!==dice) out.push({id:s.id,pinta,dice});
        });
        return out;
      })()
    """)
    ok(len(coincide) == 0, "el número del botón = figuras pintadas en su sección", coincide)

    print("\n=== 2. ABRIR DESDE UNA SECCIÓN (filtro de origen) ===")
    # Sección con 4 imágenes: ictiosaurios
    pg.evaluate("""
      document.querySelector('#ictiosaurios [data-mpv-abrir]').scrollIntoView({block:'center'})
    """)
    pg.wait_for_timeout(700)
    # 🔴 NO usar pg.click() para tomar la referencia de scroll: Playwright
    # hace `scrollIntoViewIfNeeded()` ANTES del clic, y eso desplaza la
    # página (medido: +1414 px) DESPUÉS de cualquier lectura previa. Daba
    # FALLA sobre código correcto — el visor sí restauraba su punto.
    # Se usa `click()` del DOM, que no mueve nada, y la referencia se toma
    # justo antes.
    pg.evaluate("document.querySelector('#ictiosaurios [data-mpv-abrir]').scrollIntoView({block:'center'})")
    pg.wait_for_timeout(600)
    scroll_antes = pg.evaluate("window.scrollY")
    pg.evaluate("document.querySelector('#ictiosaurios [data-mpv-abrir]').click()")
    pg.wait_for_timeout(900)

    st = pg.evaluate("window.VISOR.estado()")
    ok(st and st["abierto"], "el visor se abrió", st)
    ok(st and st["filtro"] == "ictiosaurios", "arranca filtrado en la sección de origen", st and st["filtro"])
    ok(st and st["visibles"] == 4, "muestra 4 imágenes (sólo ictiosaurios)", st and st["visibles"])

    capa_vis = pg.evaluate("""
      (()=>{const c=document.querySelector('[data-mpv]');
        const s=getComputedStyle(c);
        return {vis:s.visibility, op:s.opacity, z:s.zIndex};})()
    """)
    ok(capa_vis["vis"] == "visible" and float(capa_vis["op"]) > 0.9, "la capa es visible", capa_vis)
    ok(pg.evaluate("document.body.classList.contains('mpv-bloqueo')"), "el body queda bloqueado (no scrollea atrás)")

    cuenta = pg.evaluate("document.querySelector('[data-mpv-cuenta]').textContent")
    ok(cuenta.strip() == "1 / 4", "contador «1 / 4»", cuenta)

    img_ok = pg.evaluate("""
      (()=>{const i=document.querySelector('[data-mpv-img]');
        return {w:i.naturalWidth, llena:i.getAttribute('data-lista'), src:i.getAttribute('src')};})()
    """)
    ok(img_ok["w"] > 0, "la imagen grande cargó de verdad", img_ok)

    print("\n=== 3. FILTRO POR SECCIÓN (chips) ===")
    n_chips = pg.evaluate("document.querySelectorAll('.mpv__chip').length")
    ok(n_chips == 12, "12 chips: «Todas» + 11 secciones", n_chips)

    pg.click('.mpv__chip[data-sec=""]')
    pg.wait_for_timeout(500)
    st = pg.evaluate("window.VISOR.estado()")
    ok(st["visibles"] == 24, "«Todas» muestra las 24", st["visibles"])

    pg.click('.mpv__chip[data-sec="huevo-de-mosasaurio"]')
    pg.wait_for_timeout(500)
    st = pg.evaluate("window.VISOR.estado()")
    ok(st["visibles"] == 3, "filtro «Huevo de posible mosasaurio» = 3", st["visibles"])

    print("\n=== 4. NAVEGAR ===")
    pg.click('.mpv__chip[data-sec=""]')
    pg.wait_for_timeout(400)
    pg.click("[data-mpv-next]")
    pg.wait_for_timeout(600)
    st = pg.evaluate("window.VISOR.estado()")
    ok(st["pos"] == 1, "flecha › avanza", st["pos"])

    pg.keyboard.press("ArrowLeft")
    pg.wait_for_timeout(400)
    st = pg.evaluate("window.VISOR.estado()")
    ok(st["pos"] == 0, "teclado ← retrocede", st["pos"])

    pg.keyboard.press("ArrowRight")
    pg.wait_for_timeout(400)
    pg.keyboard.press("ArrowRight")
    pg.wait_for_timeout(400)
    st = pg.evaluate("window.VISOR.estado()")
    ok(st["pos"] == 2, "teclado → avanza 2", st["pos"])

    # Límites: en la primera, «prev» deshabilitado
    pg.click('.mpv__chip[data-sec=""]')
    pg.wait_for_timeout(300)
    pg.evaluate("window.VISOR.estado()")
    pg.keyboard.press("ArrowLeft")
    pg.wait_for_timeout(300)
    dis = pg.evaluate("document.querySelector('[data-mpv-prev]').disabled")
    ok(dis is True, "en la imagen 1 el botón ‹ queda deshabilitado", dis)

    print("\n=== 5. ACERCAR (A+B) ===")
    z0 = pg.evaluate("""(()=>{const i=document.querySelector('[data-mpv-img]');
        return {zoom:i.getAttribute('data-zoom'), tf:i.style.transform||''};})()""")
    ok(z0["zoom"] == "false", "arranca sin zoom", z0)

    # Toque/click simple sobre la imagen = acercar
    caja = pg.evaluate("""(()=>{const b=document.querySelector('[data-mpv-img]').getBoundingClientRect();
        return {x:b.x+b.width/2, y:b.y+b.height/2, w:b.width};})()""")
    pg.mouse.move(caja["x"], caja["y"])
    pg.mouse.down(); pg.mouse.up()
    # La transformación se ANIMA (.32s): leer la escala antes de que termine
    # devuelve 1 y reporta FALLA sobre código correcto. Se espera el doble.
    pg.wait_for_timeout(1100)
    z1 = pg.evaluate("""(()=>{const i=document.querySelector('[data-mpv-img]');
        const cs=getComputedStyle(i);
        return {zoom:i.getAttribute('data-zoom'), tf:i.style.transform||'',
                m:new DOMMatrix(cs.transform).a};})()""")
    ok(z1["zoom"] == "true", "el toque/clic amplía", z1["zoom"])
    ok(z1["m"] > 2.0, "la escala aplicada es ~2.4×", round(z1["m"], 2))

    # Arrastrar con zoom: recorre y NO navega
    pos_antes = pg.evaluate("window.VISOR.estado()['pos']")
    caja2 = pg.evaluate("""(()=>{const b=document.querySelector('[data-mpv-img]').getBoundingClientRect();
        return {x:b.x+b.width/2, y:b.y+b.height/2};})()""")
    pg.mouse.move(caja2["x"], caja2["y"])
    pg.mouse.down()
    pg.mouse.move(caja2["x"] - 120, caja2["y"] - 60, steps=12)
    pg.mouse.up()
    pg.wait_for_timeout(600)
    arr = pg.evaluate("""(()=>{const i=document.querySelector('[data-mpv-img]');
        return {tf:i.style.transform||'', pos:window.VISOR.estado()['pos']};})()""")
    ok("translate(-" in arr["tf"] or "translate(0" in arr["tf"] or arr["tf"] != z1["tf"],
       "el arrastre mueve la imagen ampliada", arr["tf"][:50])
    ok(arr["pos"] == pos_antes, "arrastrar con zoom NO navega de imagen", arr["pos"])

    # Segundo toque = alejar.
    # 🔴 El medidor medía el centro de la imagen YA AMPLIADA, que puede caer
    # fuera del viewport (era el defecto CR-100d). Se toca siempre el punto
    # ORIGINAL, que es donde el dedo del usuario está: si el zoom está bien
    # centrado, ese punto sigue dentro de la imagen.
    pg.mouse.move(caja["x"], caja["y"])
    pg.mouse.down(); pg.mouse.up()
    pg.wait_for_timeout(600)
    z2 = pg.evaluate("document.querySelector('[data-mpv-img]').getAttribute('data-zoom')")
    ok(z2 == "false", "segundo toque aleja", z2)

    # 🔴 Con la imagen ampliada, las flechas deben seguir siendo alcanzables.
    # Sin `overflow:hidden` en el lienzo, el <img> de 2,4× interceptaba el
    # clic sobre › (defecto CR-100f, medido con Playwright).
    sobre_flecha = pg.evaluate("""(()=>{const f=document.querySelector('[data-mpv-next]');
        const b=f.getBoundingClientRect();
        const e=document.elementFromPoint(b.x+b.width/2, b.y+b.height/2);
        return e ? (e.closest('[data-mpv-next]') ? 'flecha' : e.tagName+'.'+(e.className||'')) : 'NADA';})()""")
    ok(sobre_flecha == "flecha", "con zoom, la flecha › sigue alcanzable", sobre_flecha)

    # Cambiar de imagen resetea el zoom
    pg.evaluate("""(()=>{const i=document.querySelector('[data-mpv-img]');
        i.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));})()""")
    pg.wait_for_timeout(500)
    z3 = pg.evaluate("document.querySelector('[data-mpv-img]').getAttribute('data-zoom')")
    ok(z3 == "true", "doble clic amplía (escritorio)", z3)
    # 🔴 Con el foco en la imagen ampliada, la flecha del teclado también
    # navega; pero el clic previo dejó el foco donde estaba. Se usa el botón
    # › real, que es el gesto que el usuario tiene delante.
    pg.click("[data-mpv-next]")
    pg.wait_for_timeout(700)
    z4 = pg.evaluate("""(()=>{const i=document.querySelector('[data-mpv-img]');
        return {zoom:i.getAttribute('data-zoom'), tf:i.style.transform||''};})()""")
    ok(z4["zoom"] == "false", "al cambiar de imagen el zoom se reinicia", z4)

    print("\n=== 6. CERRAR Y VOLVER A LA SECCIÓN ===")
    # Volver a abrir desde ictiosaurios y cerrar con Esc
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(700)
    st = pg.evaluate("window.VISOR.estado()")
    ok(not st["abierto"], "Esc cierra", st["abierto"])
    ok(not pg.evaluate("document.body.classList.contains('mpv-bloqueo')"),
       "el body se desbloquea al cerrar")
    # 🔴 El sitio tiene animaciones de revelado propias (`animaciones.js`) que
    # siguen reposicionando contenido durante ~1 s. Medido: el scroll se
    # restaura correcto, pero leerlo a los 700 ms da un valor intermedio y
    # reporta FALLA sobre código correcto. Se espera a que se asiente.
    pg.wait_for_timeout(1600)
    volvio = pg.evaluate("""(()=>{const s=document.querySelector('#ictiosaurios');
        const r=s.getBoundingClientRect();
        return {top:Math.round(r.top), visible: r.top > -50 && r.top < window.innerHeight};})()""")
    ok(volvio["visible"], "el scroll volvió a la sección de origen (#ictiosaurios)", volvio)
    scroll_despues = pg.evaluate("window.scrollY")
    ok(abs(scroll_despues - scroll_antes) < 5, "scroll restaurado al mismo punto",
       f"antes={scroll_antes} despues={scroll_despues}")

    # Cerrar con la ×
    pg.evaluate("document.querySelector('#ictiosaurios [data-mpv-abrir]').click()")
    pg.wait_for_timeout(700)
    ok(pg.evaluate("window.VISOR.estado()['abierto']"), "reabre")
    pg.click("[data-mpv-cerrar]")
    pg.wait_for_timeout(600)
    ok(not pg.evaluate("window.VISOR.estado()['abierto']"), "la × cierra")

    print("\n=== 7. ANCHOS / DESBORDE / CONSOLA ===")
    for w in ANCHOS:
        pg.set_viewport_size({"width": w, "height": 900})
        pg.wait_for_timeout(500)
        desb = pg.evaluate("""(()=>{
            const d=document.documentElement;
            return {sw:d.scrollWidth, cw:d.clientWidth};})()""")
        ok(desb["sw"] <= desb["cw"] + 1, f"sin desborde horizontal a {w}px",
           f"{desb['sw']}>{desb['cw']}")

        # Abrir la capa y comprobar que tampoco desborda
        pg.evaluate("""(()=>{const b=document.querySelector('[data-mpv-abrir]');
            if(b) b.click();})()""")
        pg.wait_for_timeout(700)
        desb2 = pg.evaluate("""(()=>{
            const d=document.documentElement;
            const c=document.querySelector('[data-mpv]');
            return {sw:d.scrollWidth, cw:d.clientWidth,
                    capa:c?Math.round(c.getBoundingClientRect().width):0};})()""")
        ok(desb2["sw"] <= desb2["cw"] + 1, f"capa sin desborde a {w}px",
           f"{desb2['sw']}>{desb2['cw']} capa={desb2['capa']}")
        pg.keyboard.press("Escape")
        pg.wait_for_timeout(500)

    ok(len(errs) == 0, "0 errores de consola", errs[:4])

    pg.screenshot(path="/tmp/visor-1440.png", full_page=False)

    b.close()

print("\n" + "=" * 60)
if fallas:
    print(f"RESULTADO: {len(fallas)} FALLA(S)")
    for f in fallas:
        print("  - " + f)
    sys.exit(1)
print("RESULTADO: TODO OK")

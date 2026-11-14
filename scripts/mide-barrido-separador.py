"""Mide el barrido del separador EN PÍXELES a lo largo de TODA la animación.

Tres errores propios que este script corrige, y que el DOM no delataba:
  1) muestrear tarde -> la animación (1.6s, arranca al cargar) ya terminó.
     Se muestrea desde domcontentloaded con pausa de animación controlada.
  2) mirar una franja de 5-12px de alto cuando el hr mide 1px -> se promedia
     con el fondo de la sección. Aquí se localiza la fila más brillante.
  3) creer que un gradiente OPACO simétrico "se mueve": con los extremos del
     mismo color el desplazamiento no se ve. El brillo máximo por fotograma
     y su POSICIÓN son la única prueba.

Uso: .venv/bin/python scripts/mide-barrido-separador.py
"""
import statistics

from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8765"
ESCALA = 2  # el hr mide 1px: sin 2x el antialias se come el color

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=ESCALA)
    pg.goto(f"{BASE}/index.html", wait_until="domcontentloaded")
    pg.wait_for_timeout(150)

    # Pausar la animación del separador para poder fotografiar instantes exactos
    pg.evaluate("""() => {
      const s = document.querySelector('.separador');
      window.__anims = s.getAnimations().map(a => { a.pause(); return a; });
      return window.__anims.length;
    }""")

    print("== el brillo recorre la línea? (fotogramas exactos) ==")
    resultados = []
    for i in range(11):
        frac = i / 10
        pg.evaluate("""(f) => {
          for (const a of window.__anims) {
            a.currentTime = a.effect.getComputedTiming().duration * f;
          }
        }""", frac)
        pg.wait_for_timeout(45)
        # ubicar la fila del hr y medir
        pg.evaluate("""() => document.querySelector('.separador')
            .scrollIntoView({block: 'center'})""")
        pg.wait_for_timeout(30)
        rect = pg.evaluate("""() => {const r=document.querySelector('.separador')
            .getBoundingClientRect(); return {t:r.top, w:r.width};}""")
        buf = "/tmp/fotograma.png"
        pg.screenshot(path=buf, clip={"x": 0, "y": rect["t"] - 1, "width": rect["w"], "height": 3})

        from PIL import Image
        im = Image.open(buf).convert("RGB")
        w, h = im.size
        # fila más brillante
        mejor = max(range(h), key=lambda y: sum(
            sum(im.getpixel((x, y))) / 3 for x in range(0, w, 16)))
        lums = [sum(im.getpixel((x, mejor))) / 3 for x in range(w)]
        mx = max(lums)
        xm = lums.index(mx)
        med = statistics.median(lums)
        resultados.append((frac, mx, xm, w, med))
        print(f"  t={frac*100:5.0f}%  brillo_max={mx:5.0f}  en x={xm:5d} "
              f"({100*xm/w:5.1f}%)  mediana={med:.0f}  pico={mx/med if med else 0:.1f}x")

    print()
    posiciones = [r[2] for r in resultados]
    brillos = [r[1] for r in resultados]
    recorrido = max(posiciones) - min(posiciones)
    print(f"  recorrido del punto brillante: {recorrido} px (de {resultados[0][3]})")
    print(f"  brillo maximo en la animacion: {max(brillos):.0f} · fondo: {resultados[0][4]:.0f}")
    print(f"  contraste pico/fondo: {max(brillos)/resultados[0][4]:.1f}x")
    veredicto = recorrido > resultados[0][3] * 0.5 and max(brillos) > resultados[0][4] * 2
    print("\n  " + ("BARRE Y SE VE" if veredicto else "NO SE VE EL BARRIDO  <-- defecto"))
    b.close()

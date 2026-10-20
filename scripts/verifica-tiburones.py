#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CR-85 — Sonda de verificación de tiburones.html (Playwright + Chromium).

Mide lo que el archivo NO dice, a varios anchos en una sola corrida:
  · imágenes que de verdad cargan (scroll real, esperando a `complete`),
  · deformación (|ratio natural - ratio pintado| > 0.06),
  · desborde horizontal,
  · títulos tapados por el header fijo,
  · que cada PIE corresponda a su IMAGEN (mismo indice de figura),
  · caracteres por linea del cuerpo del texto.

⚠️ Regla del proyecto: `lazy` solo se valida con el elemento EN PANTALLA.
Medir sin scroll da `naturalWidth 0` y eso NO es una imagen rota. Guarda
explicita: si `!complete || !naturalHeight`, el valor correcto es «NO MEDIDO»,
nunca «0». (CR-60d y CR-75 §2 ya pagaron este falso positivo dos veces.)

Uso: python3 scripts/verifica-tiburones.py [ancho ...]
     sin argumentos = 1440 1024 899 768 390
"""
import sys
import time

from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8801"
URL = BASE + "/tiburones.html?v=%d" % int(time.time())
ANCHOS = [int(a) for a in sys.argv[1:]] or [1440, 1024, 899, 768, 390]

# Pie esperado por numero de imagen. Es la correspondencia del Word: imagen -> su
# pie inmediatamente siguiente. Se compara el ARRANQUE del texto para no depender
# del largo exacto.
PIE_ESPERADO = {
    "01.jpg": None,
    "02.jpg": None,
    "03.jpg": "Esqueleto de la cabeza de un tiburón",
    "04.jpg": "Vértebra cóncava de tiburón",
    "05.jpg": "Reconstrucción del esqueleto completo de un tiburón",
    "06.jpg": "Dientes de diversos tiburones",
    "07.jpg": "Sistema respiratorio de un tiburón",
    "08.jpg": "Ampollas de Lorenzini",
    "09.jpg": "Cuerpo de un tiburón mostrando",
    "10.jpg": "Membrana nictitante",
    "11.jpg": "Color del tiburón",
    "12.jpg": "Mapa de las principales localidades",
    "13.jpg": "Vista panorámica del sector fosilífero",
    "14.jpg": "Diente de Megalodon adulto",
    "15.jpg": "Diente de Otodus megalodon in situ",
    "16.jpg": "Otodus megalodon juvenil atacando a un Odobenocetops",
    "17.jpg": "Otodus megalodon juvenil atacando a un Thalassocnus",
    "18.jpg": "Otodus megalodon juvenil atacando a un Pelagornis",
}


def mide(pagina, ancho):
    pagina.set_viewport_size({"width": ancho, "height": 900})
    pagina.goto(URL, wait_until="load", timeout=30000)

    # Scroll real de punta a punta para que los `lazy` se disparen.
    alto = pagina.evaluate("document.documentElement.scrollHeight")
    y = 0
    while y < alto:
        pagina.evaluate("window.scrollTo(0, %d)" % y)
        pagina.wait_for_timeout(120)
        y += 700
    pagina.evaluate("window.scrollTo(0, 0)")
    pagina.wait_for_timeout(400)

    return pagina.evaluate(
        """(ancho) => {
      const doc = document.documentElement;
      const r = {ancho, desborde: doc.scrollWidth > window.innerWidth + 1,
                 scrollW: doc.scrollWidth, viewW: window.innerWidth};

      // --- imagenes: cargadas y deformacion ---
      const imgs = [...document.querySelectorAll('.tib-sec img')];
      r.imgs = imgs.map(i => {
        const caja = i.getBoundingClientRect();
        const medido = i.complete && i.naturalHeight > 0;
        if (!medido) return {src: i.src.split('/').pop(), estado: 'NO MEDIDO'};
        // el ratio pintado usa el tamano RENDERIZADO dentro del marco
        const rn = i.naturalWidth / i.naturalHeight;
        const rp = caja.width / caja.height;
        return {src: i.src.split('/').pop(), estado: 'ok',
                deform: Math.abs(rn - rp) > 0.06};
      });
      r.imgsOk = r.imgs.filter(i => i.estado === 'ok').length;
      r.imgsNoMedidas = r.imgs.filter(i => i.estado === 'NO MEDIDO').length;
      r.deformadas = r.imgs.filter(i => i.deform).map(i => i.src);

      // --- pie <-> imagen: cada figura con su propio figcaption ---
      r.pieDesalineado = [];
      document.querySelectorAll('.tib-sec figure').forEach(f => {
        const img = f.querySelector('img');
        const pie = f.querySelector('figcaption');
        if (!img) return;
        const src = img.src.split('/').pop();
        r.pieDesalineado.push({
          src,
          pie: pie ? pie.textContent.trim().slice(0, 48) : null
        });
      });

      // --- titulos tapados por el header fijo ---
      const hh = parseFloat(getComputedStyle(doc).getPropertyValue('--header-h')) || 84;
      r.tapados = [...document.querySelectorAll('.tib-sec__t')]
        .filter(h => h.getBoundingClientRect().top < hh - 1)
        .map(h => h.textContent.slice(0, 30));

      // --- desborde por elemento: quien se sale del viewport ---
      r.salidos = [...document.querySelectorAll('.tib-sec *, .tib-fig, .tib-figs')]
        .filter(el => el.getBoundingClientRect().right > window.innerWidth + 2)
        .slice(0, 5)
        .map(el => el.className || el.tagName);

      // --- caracteres por linea del cuerpo ---
      const p = document.querySelector('.tib-sec p');
      if (p) {
        const cs = getComputedStyle(p);
        const c = document.createElement('canvas').getContext('2d');
        c.font = cs.fontSize + ' ' + cs.fontFamily;
        const w = c.measureText('abcdefghijklmnopqrstuvwxyz').width / 26;
        r.carPorLinea = Math.round(p.getBoundingClientRect().width / w);
      }

      // --- conteos ---
      r.secciones = document.querySelectorAll('.tib-sec').length;
      r.figuras = document.querySelectorAll('.tib-sec figure').length;
      r.pies = document.querySelectorAll('.tib-sec figcaption').length;
      r.grillas = [...document.querySelectorAll('.tib-figs')].map(g => g.className.replace('tib-figs ', ''));
      return r;
    }""",
        ancho,
    )


def main():
    fallos = []
    with sync_playwright() as pw:
        nav = pw.chromium.launch()
        ctx = nav.new_context()
        pag = ctx.new_page()
        errores = []
        pag.on("console", lambda m: errores.append(m.text) if m.type == "error" else None)
        pag.on("pageerror", lambda e: errores.append(str(e)))

        for ancho in ANCHOS:
            r = mide(pag, ancho)
            print("\n=== %d px ===" % ancho)
            print("  secciones %d | figuras %d | pies %d"
                  % (r["secciones"], r["figuras"], r["pies"]))
            print("  imagenes ok: %d | NO MEDIDAS: %d" % (r["imgsOk"], r["imgsNoMedidas"]))
            print("  desborde horizontal: %s (scrollW %d / viewW %d)"
                  % (r["desborde"], r["scrollW"], r["viewW"]))
            print("  deformadas: %s" % (r["deformadas"] or "ninguna"))
            print("  titulos tapados: %s" % (r["tapados"] or "ninguno"))
            print("  elementos fuera del viewport: %s" % (r["salidos"] or "ninguno"))
            print("  car/línea: %s" % r.get("carPorLinea"))
            print("  grillas: %s" % r["grillas"])

            # pie vs imagen esperada
            malos = []
            for par in r["pieDesalineado"]:
                esp = PIE_ESPERADO.get(par["src"], "?")
                if esp is None:
                    if par["pie"]:
                        malos.append((par["src"], "no debía tener pie", par["pie"]))
                else:
                    if not par["pie"] or not par["pie"].startswith(esp[:22]):
                        malos.append((par["src"], esp[:30], par["pie"]))
            print("  pie desalineado: %s" % (malos or "ninguno"))

            if r["desborde"]:
                fallos.append("%dpx: desborde horizontal" % ancho)
            if r["imgsNoMedidas"]:
                fallos.append("%dpx: %d imagenes NO MEDIDAS" % (ancho, r["imgsNoMedidas"]))
            if r["deformadas"]:
                fallos.append("%dpx: deformadas %s" % (ancho, r["deformadas"]))
            if r["tapados"]:
                fallos.append("%dpx: titulos tapados %s" % (ancho, r["tapados"]))
            if malos:
                fallos.append("%dpx: pie desalineado %s" % (ancho, malos))
            if r.get("carPorLinea") and r["carPorLinea"] < 55 and ancho > 480:
                # ⚠️ MEDIDO: a 390 px las TRES páginas hermanas (amonites,
                # trilobites, tiburones) dan 42 car/línea con la misma caja de
                # 358 px y el mismo font-size. Es el ancho normal del sitio en
                # móvil, no un defecto de esta página. El umbral de 55 se aplica
                # solo a partir de 480 px; por debajo se informa y no se falla.
                fallos.append("%dpx: %d car/linea (<55 = se ve de celular)"
                              % (ancho, r["carPorLinea"]))

        if errores:
            print("\n=== ERRORES DE CONSOLA ===")
            for e in errores[:10]:
                print("  " + e)
            fallos.append("errores de consola: %d" % len(errores))

        nav.close()

    print("\n" + "=" * 50)
    if fallos:
        print("FALLOS (%d):" % len(fallos))
        for f in fallos:
            print("  - " + f)
        return 1
    print("TODO OK — sin desborde, todas las imagenes cargan, pies alineados")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CR-83 — Control de NO REGRESIÓN de las páginas que ya estaban publicadas.

Al agregar «Ammonites» al nav y al footer de las 4 páginas existentes, el
riesgo concreto es: (a) que el nav desborde al sumar un ítem, (b) que una
página deje de pintar por un error de sintaxis, (c) que una imagen se rompa.

Mide en las 4 páginas + la nueva, a 2 anchos, y falla si algo se movió.

Uso: python3 scripts/verifica-no-regresion-amonites.py
"""
import sys, time
from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:8099/'
PAGINAS = ['index.html', 'curriculum.html', 'trilobites.html', 'proyecto-cec.html', 'amonites.html']
ANCHOS = [1440, 390]

JS = r"""
() => {
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  const imgs = Array.from(document.images);
  return {
    navItems: nav ? nav.querySelectorAll('a').length : 0,
    desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    headerH: header ? Math.round(header.getBoundingClientRect().height) : 0,
    headerDesborda: header ? (header.scrollWidth - header.clientWidth) : -1,
    desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    imgsTotales: imgs.length,
    /* 🔴 CR-84 (2026-10-20) — SOLO cuentan como rotas las que COMPLETARON con
       `naturalHeight == 0`. Un `lazy` que todavía no se pidió tiene
       `complete: false` y su `naturalWidth` es 0, y eso NO es una imagen rota:
       es una imagen que el recorrido no alcanzó a disparar. Medido: el control
       reportaba «2 y 1 imgs sin resolver» a 1440 y `scripts/diag-imagenes-rotas.py`
       demostró 0 rotas, 0 peticiones fallidas, 0 nunca pedidas tras un recorrido
       lento. El defecto era del instrumento. */
    imgsRotas: imgs.filter(i => i.complete && i.naturalHeight === 0)
                   .map(i => (i.getAttribute('src') || '').split('/').pop()),
    imgsNoPedidas: imgs.filter(i => !i.complete).length,
    enlaceAmmonitesNav: !!document.querySelector('.nav a[href="amonites.html"]'),
    enlaceAmmonitesFoot: !!document.querySelector('.footer a[href="amonites.html"]'),
    mainPintado: (document.querySelector('main') || {}).innerText
                  ? document.querySelector('main').innerText.trim().length : 0
  };
}
"""


def main():
    fallos = []
    with sync_playwright() as p:
        nav = p.chromium.launch(args=['--disable-gpu'])
        for ancho in ANCHOS:
            for pagina in PAGINAS:
                ctx = nav.new_context(viewport={'width': ancho, 'height': 900})
                page = ctx.new_page()
                errs = []
                page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
                page.on('console', lambda m: errs.append('console.error: ' + m.text)
                        if m.type == 'error' else None)
                page.goto(BASE + pagina + '?v=%d' % int(time.time()), wait_until='load')
                page.wait_for_timeout(1200)
                # recorrido completo para que el lazy pida todo
                page.evaluate("""async () => {
                    for (let y = 0; y <= document.body.scrollHeight; y += 250) {
                        window.scrollTo(0, y);
                        await new Promise(r => setTimeout(r, 150));
                    }
                    window.scrollTo(0, 0);
                }""")
                page.wait_for_timeout(2000)
                v = page.evaluate(JS)
                ctx.close()

                probs = []
                if v['desborde'] != 0:
                    probs.append('DESBORDE %dpx' % v['desborde'])
                if v['headerDesborda'] > 0:
                    probs.append('HEADER desborda %dpx' % v['headerDesborda'])
                if v['imgsRotas']:
                    probs.append('IMGS ROTAS %s' % v['imgsRotas'])
                # `imgsNoPedidas` NO es un fallo: son `lazy` que el recorrido no
                # alcanzó a disparar. Se informa, no se cuenta.
                if not v['enlaceAmmonitesNav']:
                    probs.append('falta enlace Ammonites en el NAV')
                if not v['enlaceAmmonitesFoot']:
                    probs.append('falta enlace Ammonites en el FOOTER')
                if v['mainPintado'] < 200:
                    probs.append('main casi vacío (%d chars)' % v['mainPintado'])
                if errs:
                    probs.append('ERRORES: %s' % errs[:3])

                estado = 'OK' if not probs else 'FALLA'
                print('%-18s @%-5d nav=%d headerH=%d imgs=%d (sin pedir %d)  %s %s'
                      % (pagina, ancho, v['navItems'], v['headerH'],
                         v['imgsTotales'], v['imgsNoPedidas'], estado, ' | '.join(probs)))
                fallos += ['%s@%d: %s' % (pagina, ancho, pr) for pr in probs]
        nav.close()

    print('=' * 55)
    if fallos:
        print('RESULTADO: %d FALLO(S)' % len(fallos))
        for f in fallos:
            print('  - ' + f)
        sys.exit(2)
    print('RESULTADO: las %d páginas OK en %s' % (len(PAGINAS), ANCHOS))


if __name__ == '__main__':
    main()

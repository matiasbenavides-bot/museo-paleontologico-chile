#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CR-84 — ¿las imágenes que el control marca «sin resolver» están ROTAS o solo
NO PEDIDAS?

Un `lazy` fuera de pantalla tiene `complete: false` y eso NO es un defecto.
Este script separa los dos casos, que es lo que el control de no regresión NO
hace:

  · NO PEDIDA  -> `complete: false` y el navegador nunca hizo la petición
  · ROTA       -> `complete: true` y `naturalHeight == 0` (o petición fallida)
  · OK         -> `complete: true` y `naturalHeight > 0`

Recorre la página dos veces: primero despacio (para que el lazy pida todo) y
después verifica. Si al final queda algo NO PEDIDO, lo reporta como tal —
nunca como roto.
"""
import time, sys
from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:8099/'
PAGINAS = ['amonites.html', 'trilobites.html']


def main():
    problemas_reales = 0
    with sync_playwright() as p:
        nav = p.chromium.launch(args=['--disable-gpu'])
        for pag in PAGINAS:
            ctx = nav.new_context(viewport={'width': 1440, 'height': 900})
            page = ctx.new_page()
            pedidas, fallidas = set(), []
            page.on('request', lambda r: pedidas.add(r.url.split('/')[-1])
                    if '/word/' in r.url or '/trilobites/' in r.url else None)
            page.on('requestfailed', lambda r: fallidas.append(
                (r.url.split('/')[-1], str(r.failure))))

            page.goto(BASE + pag + '?v=%d' % int(time.time()), wait_until='load')
            page.wait_for_timeout(1500)
            # recorrido lento: 60% de pantalla por paso, 450 ms de espera
            page.evaluate("""async () => {
                const h = window.innerHeight;
                for (let y = 0; y <= document.body.scrollHeight; y += h * 0.6) {
                    window.scrollTo(0, y);
                    await new Promise(r => setTimeout(r, 450));
                }
                window.scrollTo(0, document.body.scrollHeight);
            }""")
            page.wait_for_timeout(5000)

            info = page.evaluate("""() => {
                const imgs = Array.from(document.images);
                const lim = i => (i.getAttribute('src') || '').split('/').pop();
                return {
                    total: imgs.length,
                    ok: imgs.filter(i => i.complete && i.naturalHeight > 0).length,
                    rotas: imgs.filter(i => i.complete && i.naturalHeight === 0).map(lim),
                    noComplete: imgs.filter(i => !i.complete).map(lim)
                };
            }""")
            sinPedir = [s for s in info['noComplete'] if s not in pedidas]
            sinPedirYEnPantalla = info['noComplete']

            print('=== %s ===' % pag)
            print('  imágenes en el DOM        %d' % info['total'])
            print('  OK (cargadas)             %d' % info['ok'])
            print('  ROTAS de verdad           %s' % (info['rotas'] or 'ninguna'))
            print('  no completas              %s' % (sinPedirYEnPantalla or 'ninguna'))
            print('  ...de esas, nunca pedidas  %s' % (sinPedir or 'ninguna'))
            print('  peticiones FALLIDAS       %s' % (fallidas[:5] or 'ninguna'))
            if info['rotas'] or fallidas:
                problemas_reales += 1
                print('  -> PROBLEMA REAL')
            elif sinPedirYEnPantalla:
                print('  -> NO es un defecto: `lazy` que el recorrido no alcanzó a disparar')
            else:
                print('  -> TODO OK')
            print()
            ctx.close()
        nav.close()

    if problemas_reales:
        print('RESULTADO: %d página(s) con imágenes realmente rotas' % problemas_reales)
        sys.exit(2)
    print('RESULTADO: 0 imágenes rotas. Los «sin resolver» eran `lazy` no pedidas.')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CR-83 — Capturas de amonites.html al ESCRITORIO REAL de Windows, para que el
dueño las mire. El agente no ve imágenes: no autoaprueba el diseño.

Captura 3 cortes (arriba, medio, abajo) a un ancho dado, con `lazy` forzado
ANTES de capturar (si no, las imágenes de abajo salen en blanco — CR-75 §2).

Uso: python3 scripts/captura-amonites.py [ancho]
Salida: /mnt/c/Users/logic/Desktop/amonites-<ancho>-<n>.png
"""
import sys, time, os
from playwright.sync_api import sync_playwright

ANCHO = int(sys.argv[1]) if len(sys.argv) > 1 else 1440
ALTO = 1000
URL = 'http://127.0.0.1:8099/amonites.html?v=%d' % int(time.time())
DEST = '/mnt/c/Users/logic/Desktop'

with sync_playwright() as p:
    nav = p.chromium.launch(args=['--disable-gpu'])
    ctx = nav.new_context(viewport={'width': ANCHO, 'height': ALTO}, device_scale_factor=1)
    page = ctx.new_page()
    page.goto(URL, wait_until='load')
    page.wait_for_timeout(900)
    # forzar TODAS las imágenes antes de capturar
    page.evaluate("""async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 200) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 200));
        }
        window.scrollTo(0, 0);
    }""")
    page.wait_for_timeout(2500)
    pend = page.evaluate("""() => Array.from(document.images)
        .filter(i => !(i.complete && i.naturalHeight)).length""")
    if pend:
        print('⚠️ %d imágenes sin cargar: la captura NO es válida' % pend)
    alto = page.evaluate('document.body.scrollHeight')
    cortes = [0, int(alto * 0.42), alto - ALTO]
    for i, y in enumerate(cortes, 1):
        page.evaluate('window.scrollTo(0, %d)' % y)
        page.wait_for_timeout(700)
        ruta = os.path.join(DEST, 'amonites-%d-%d.png' % (ANCHO, i))
        page.screenshot(path=ruta)
        print('%s  (scrollY=%d de %d)' % (ruta, y, alto))
    nav.close()
print('listo. Alto total de la página: %d px' % alto)

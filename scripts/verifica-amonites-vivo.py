#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CR-83 — Verificación sobre la URL REAL de GitHub Pages.

Regla del proyecto (CR-67): que el archivo llegue NO es que pinte. Lo que vale
es cargar la URL publicada y medir el DOM ya pintado.

Uso: python3 scripts/verifica-amonites-vivo.py
"""
import sys, time
from playwright.sync_api import sync_playwright

URL = 'https://matiasbenavides-bot.github.io/museo-paleontologico-chile/amonites.html?v=%d' % int(time.time())

JS = r"""
async () => {
  const esperar = ms => new Promise(r => setTimeout(r, ms));
  for (let y = 0; y <= document.body.scrollHeight; y += 200) {
    window.scrollTo(0, y);
    await esperar(200);
  }
  window.scrollTo(0, 0);
  await esperar(2500);
  const imgs = Array.from(document.querySelectorAll('.amo-fig__marco img'));
  return {
    titulo: document.title,
    window_AMMONITES: !!window.AMMONITES,
    seccionesPintadas: document.querySelectorAll('.amo-sec').length,
    figuras: imgs.length,
    cargadas: imgs.filter(i => i.complete && i.naturalHeight > 0).length,
    rotas: imgs.filter(i => !(i.complete && i.naturalHeight)).map(i => (i.getAttribute('src')||'').split('/').pop()),
    deformadas: imgs.filter(i => {
      const r = i.getBoundingClientRect();
      if (!r.height) return false;
      return Math.abs(i.naturalWidth/i.naturalHeight - r.width/r.height) > 0.06;
    }).map(i => (i.getAttribute('src')||'').split('/').pop()),
    desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    indice: document.querySelectorAll('.amo-indice__l a').length,
    pies: Array.from(document.querySelectorAll('.amo-fig figcaption')).map(f => f.textContent.trim()),
    nota: (document.querySelector('[data-amo-nota]')||{}).innerText ? 'presente' : 'AUSENTE',
    cierre: !!document.querySelector('[data-amo-cierre] .btn')
  };
}
"""

with sync_playwright() as p:
    nav = p.chromium.launch(args=['--disable-gpu'])
    ctx = nav.new_context(viewport={'width': 1440, 'height': 900})
    page = ctx.new_page()
    errs = []
    page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errs.append('console.error: ' + m.text) if m.type == 'error' else None)
    page.goto(URL, wait_until='load')
    page.wait_for_timeout(1500)
    v = page.evaluate(JS)
    nav.close()

print('=== EN VIVO: %s ===' % URL.split('/')[-1].split('?')[0])
for k, val in v.items():
    print('  %-18s %s' % (k, val))

fallos = []
if not v['window_AMMONITES']: fallos.append('window.AMMONITES no definido (data roto en producción)')
if v['seccionesPintadas'] != 26: fallos.append('secciones pintadas %d != 26' % v['seccionesPintadas'])
if v['figuras'] != 30: fallos.append('figuras %d != 30' % v['figuras'])
if v['cargadas'] != 30: fallos.append('imágenes cargadas %d/30' % v['cargadas'])
if v['rotas']: fallos.append('rotas: %s' % v['rotas'])
if v['deformadas']: fallos.append('deformadas: %s' % v['deformadas'])
if v['desborde'] != 0: fallos.append('desborde %dpx' % v['desborde'])
if v['indice'] != 13: fallos.append('índice %d != 13' % v['indice'])
if len(v['pies']) != 2: fallos.append('pies %d != 2' % len(v['pies']))
if v['nota'] == 'AUSENTE': fallos.append('nota de imágenes ausente')
if not v['cierre']: fallos.append('cierre ausente')
if errs: fallos.append('errores de consola: %s' % errs[:3])

print('\n%s' % ('PUBLICADO Y VERIFICADO' if not fallos else 'FALLOS:'))
for f in fallos:
    print('  - ' + f)
sys.exit(0 if not fallos else 2)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CR-83 — Sonda de verificación de amonites.html (Playwright + Chromium Linux).

Mide lo que el archivo NO dice, y a varios anchos de una corrida:
  · imágenes que de verdad cargan (scroll real, esperando a `complete`),
  · deformación (|ratio natural − ratio pintado| > 0.06),
  · desborde horizontal,
  · títulos tapados por el header fijo,
  · pies de figura, índice, nota, cierre.

⚠️ Regla del proyecto: `lazy` solo se valida con el elemento EN PANTALLA.
Medir sin scroll da `naturalWidth 0` y eso NO es una imagen rota. Guarda
explícita: si `!complete || !naturalHeight`, el valor correcto es «NO MEDIDO»,
nunca «0». (CR-60d y CR-75 §2 ya pagaron este falso positivo dos veces.)

Uso: python3 scripts/verifica-amonites.py [ancho ...]
     sin argumentos = 1440 1024 899 768 390
"""
import sys, time
from playwright.sync_api import sync_playwright

URL = 'http://127.0.0.1:8099/amonites.html?v=%d' % int(time.time())
ANCHOS = [int(a) for a in sys.argv[1:]] or [1440, 1024, 899, 768, 390]

JS = r"""
async () => {
  const esperar = ms => new Promise(r => setTimeout(r, ms));
  // 🔴 PASO 1 — cargar TODAS las imágenes ANTES de cualquier otra medición.
  // Medido (CR-83): si se salta de ancla en ancla PRIMERO, el salto mueve el
  // scroll y cancela las peticiones `lazy` pendientes; 8 de 30 quedaban sin
  // pedir y la sonda las reportaba como «rotas». No estaban rotas: el
  // instrumento las mataba. Por eso el recorrido continuo va primero y solo,
  // con pasos chicos y espera por paso.
  for (let y = 0; y <= document.body.scrollHeight; y += 200) {
    window.scrollTo(0, y);
    await esperar(220);
  }
  window.scrollTo(0, 0);
  await esperar(2500);

  const imgs = Array.from(document.querySelectorAll('.amo-fig__marco img'));
  const detalle = imgs.map(i => {
    const r = i.getBoundingClientRect();
    const cargada = i.complete && i.naturalHeight > 0;
    const rn = cargada ? i.naturalWidth / i.naturalHeight : null;
    const rp = r.height > 0 ? r.width / r.height : null;
    return {
      src: (i.getAttribute('src') || '').split('/').pop(),
      cargada,
      natural: cargada ? [i.naturalWidth, i.naturalHeight] : 'NO MEDIDO',
      pintado: [Math.round(r.width), Math.round(r.height)],
      deformacion: (rn && rp) ? +(Math.abs(rn - rp)).toFixed(3) : 'NO MEDIDO'
    };
  });
  const header = document.querySelector('.header');
  const headerH = header ? Math.round(header.getBoundingClientRect().height) : 0;
  const tapados = [];
  // PASO 2 — ahora sí, las anclas (el scroll ya no tiene nada pendiente).
  for (const s of document.querySelectorAll('.amo-sec')) {
    const t = s.querySelector('.amo-sec__t');
    if (!t) continue;
    location.hash = '#' + s.id;
    await esperar(150);
    const r = t.getBoundingClientRect();
    if (r.top < headerH - 1) tapados.push({id: s.id, top: Math.round(r.top)});
  }
  location.hash = '';
  window.scrollTo(0, 0);
  await esperar(200);

  return {
    titulo: document.title,
    window_AMMONITES: !!window.AMMONITES,
    window_MUSEO: !!window.MUSEO,
    totalImgs: imgs.length,
    cargadas: detalle.filter(d => d.cargada).length,
    noMedidas: detalle.filter(d => !d.cargada).map(d => d.src),
    deformadas: detalle.filter(d => typeof d.deformacion === 'number' && d.deformacion > 0.06)
                        .map(d => [d.src, d.deformacion]),
    desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    headerH,
    titulos: document.querySelectorAll('.amo-sec').length,
    titulosTapados: tapados,
    pies: Array.from(document.querySelectorAll('.amo-fig figcaption')).map(f => f.textContent.trim()),
    indiceItems: document.querySelectorAll('.amo-indice__l a').length,
    notaImagenes: (document.querySelector('[data-amo-nota]') || {}).innerText ? 'presente' : 'AUSENTE',
    cierre: !!document.querySelector('[data-amo-cierre] .btn'),
    altoTotal: document.body.scrollHeight,
    coloresFondo: getComputedStyle(document.body).backgroundColor
  };
}
"""


def medir(page, ancho):
    page.set_viewport_size({'width': ancho, 'height': 900})
    page.goto(URL, wait_until='load')
    page.wait_for_timeout(700)
    return page.evaluate(JS)


def main():
    fallos_totales = []
    with sync_playwright() as p:
        nav = p.chromium.launch(args=['--disable-gpu', '--hide-scrollbars'])
        ctx = nav.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
        page = ctx.new_page()
        errores = []
        page.on('pageerror', lambda e: errores.append(str(e)))
        page.on('console', lambda m: errores.append('console.%s: %s' % (m.type, m.text))
                if m.type == 'error' else None)
        for ancho in ANCHOS:
            v = medir(page, ancho)
            print('=== amonites.html @ %dpx ===' % ancho)
            for k, val in v.items():
                print('  %-16s %s' % (k, val))
            fallos = []
            if v['noMedidas']:
                fallos.append('%d imágenes SIN MEDIR (lazy no disparó): %s'
                              % (len(v['noMedidas']), v['noMedidas']))
            if v['deformadas']:
                fallos.append('DEFORMADAS (>0.06): %s' % v['deformadas'])
            if v['desborde'] != 0:
                fallos.append('DESBORDE horizontal %d px' % v['desborde'])
            if v['titulosTapados']:
                fallos.append('TÍTULOS tapados por el header: %s' % v['titulosTapados'])
            if not v['window_AMMONITES']:
                fallos.append('window.AMMONITES NO definido')
            if v['totalImgs'] != 30:
                fallos.append('se esperaban 30 figuras, hay %d' % v['totalImgs'])
            if len(v['pies']) != 2:
                fallos.append('se esperaban 2 pies, hay %d' % len(v['pies']))
            if v['notaImagenes'] == 'AUSENTE':
                fallos.append('la nota de imágenes no se pintó')
            if not v['cierre']:
                fallos.append('el cierre no se pintó')
            print('  -> %s\n' % ('OK' if not fallos else 'FALLOS: ' + ' | '.join(fallos)))
            fallos_totales += ['%dpx: %s' % (ancho, f) for f in fallos]
        if errores:
            print('=== ERRORES DE CONSOLA ===')
            for e in errores:
                print('  ' + e)
            fallos_totales.append('errores de consola: %d' % len(errores))
        nav.close()

    print('=' * 50)
    if fallos_totales:
        print('RESULTADO: %d FALLO(S)' % len(fallos_totales))
        for f in fallos_totales:
            print('  - ' + f)
        sys.exit(2)
    print('RESULTADO: TODO OK en %s' % ANCHOS)


if __name__ == '__main__':
    main()

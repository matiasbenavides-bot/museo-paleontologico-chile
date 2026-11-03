#!/usr/bin/env python3
"""Mide reptiles.html en Chromium real. Nada supuesto: DOM, píxeles, overflow.

Uso: /tmp/venv-docx2/bin/python scripts/mide-reptiles.py [url]
"""
import sys, os, json
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8877/reptiles.html"
CHROME = os.path.expanduser("~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome")
errores = []

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.on("pageerror", lambda e: errores.append("pageerror: " + str(e)))
    pg.on("console", lambda m: errores.append("console." + m.type + ": " + m.text)
          if m.type in ("error", "warning") else None)
    r = pg.goto(URL, wait_until="domcontentloaded", timeout=60000)
    print("HTTP:", r.status)
    pg.wait_for_timeout(1200)

    datos = pg.evaluate("""() => {
      const q = s => Array.from(document.querySelectorAll(s));
      const secs = q('.rpt-sec');
      const imgs = q('.rpt-fig img');
      return {
        titulo: document.title,
        h1: (document.querySelector('[data-rpt-titulo]')||{}).textContent,
        bajada: (document.querySelector('[data-rpt-bajada]')||{}).textContent,
        credito: (document.querySelector('[data-credito-inicio]')||{}).textContent,
        etiqueta: (document.querySelector('[data-rpt-etiqueta]')||{}).textContent,
        secciones: secs.length,
        h2: q('.rpt-sec__t').length,
        parrafos: q('.rpt-sec p').length,
        figuras: q('.rpt-fig').length,
        figcaptions: q('.rpt-fig figcaption').length,
        altVacios: imgs.filter(i => i.getAttribute('alt') === '').length,
        altConTexto: imgs.filter(i => (i.getAttribute('alt')||'') !== '').length,
        sinAlt: imgs.filter(i => !i.hasAttribute('alt')).length,
        conDim: imgs.filter(i => i.hasAttribute('width') && i.hasAttribute('height')).length,
        cursivas: q('.rpt-sec i').length,
        cursivasItalic: q('.rpt-sec i').filter(i => getComputedStyle(i).fontStyle === 'italic').length,
        cursivasTitle: q('.rpt-sec__t i').length,
        cursivasPie: q('.rpt-fig figcaption i').length,
        asteriscos: (document.body.innerText.match(/\\*/g)||[]).length,
        iEscapadas: (document.body.innerHTML.match(/&lt;i&gt;/g)||[]).length,
        indice: !!document.querySelector('.rpt-indice'),
        indiceItems: q('.rpt-indice__l a').length,
        cierre: !!document.querySelector('.rpt-cierre a'),
        altoPagina: document.body.scrollHeight,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        // orden en DOM de las imagenes
        orden: imgs.map(i => (i.getAttribute('src')||'').split('/').pop()),
        // estructura por seccion
        estructura: secs.map(s => ({
          id: s.id,
          t: (s.querySelector('.rpt-sec__t')||{}).textContent,
          p: s.querySelectorAll('p').length,
          img: s.querySelectorAll('.rpt-fig').length,
        })),
        // duplicados de texto
        dup: (() => { const st=new Set(), d=[];
          q('.rpt-sec p').forEach(p=>{const t=p.textContent.trim(); if(st.has(t))d.push(t.slice(0,60)); st.add(t)}); return d })(),
        iconoCard: !!document.querySelector('.pieza'),
      };
    }""")
    print(json.dumps(datos, indent=1, ensure_ascii=False))

    # lazy: medir ANTES y DESPUÉS de scrollear
    antes = pg.evaluate("""() => { const f=[...document.querySelectorAll('.rpt-fig img')];
      return {total:f.length, cargadas:f.filter(i=>i.complete&&i.naturalWidth>0).length}; }""")
    print("\nLAZY scrollY=0:", antes)
    pg.evaluate("""async () => { let y=0; const paso=()=>{ y+=700; window.scrollTo(0,y);
      return new Promise(r => { if (y < document.body.scrollHeight) setTimeout(()=>r(paso()),120); else setTimeout(r,1200); }); };
      return paso(); }""")
    despues = pg.evaluate("""() => { const f=[...document.querySelectorAll('.rpt-fig img')];
      return {total:f.length, cargadas:f.filter(i=>i.complete&&i.naturalWidth>0).length,
              rotas:f.filter(i=>i.complete&&i.naturalWidth===0).length,
              w: f.map(i=>i.naturalWidth)}; }""")
    print("LAZY tras scroll:", {k: v for k, v in despues.items() if k != "w"})
    pg.evaluate("window.scrollTo(0,0)")

    # responsive
    print("\nRESPONSIVE (desborde):")
    for w in (360, 390, 520, 768, 1024, 1440):
        pg.set_viewport_size({"width": w, "height": 900})
        pg.wait_for_timeout(350)
        o = pg.evaluate("""() => ({ov: document.documentElement.scrollWidth > window.innerWidth + 1,
             sw: document.documentElement.scrollWidth, iw: window.innerWidth,
             figMin: Math.min(...[...document.querySelectorAll('.rpt-fig')].map(f=>Math.round(f.getBoundingClientRect().width))),
             carLinea: (()=>{const p=document.querySelector('.rpt-sec p'); if(!p) return 0;
               const s=getComputedStyle(p); const cv=document.createElement('canvas').getContext('2d');
               cv.font = s.fontSize + ' ' + s.fontFamily; return Math.round(p.clientWidth / cv.measureText('abcdefghij').width * 10); })()})""")
        print(f"  {w:5d}  overflow={o['ov']!s:5s} scrollW={o['sw']:5d} figuraMin={o['figMin']:4d} car/linea~{o['carLinea']}")

    b.close()

print("\nERRORES DE CONSOLA:", len(errores))
for e in errores[:10]:
    print("  -", e)

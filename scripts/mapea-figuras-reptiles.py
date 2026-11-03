#!/usr/bin/env python3
"""Deriva el mapeo figura -> parrafo desde word/document.xml (DEC-82 / CR-96).

Uso:  /tmp/venv-docx2/bin/python scripts/mapea-figuras-reptiles.py [docx]
Imprime:
  - todos los parrafos en orden, con marca [FIG rIdN] donde haya imagen
  - la tabla figura -> indice de parrafo previo (el parrafo del Word que la precede)
No asigna nada por tema. Solo mide posicion.
"""
import sys, re, zipfile, hashlib

DOCX = sys.argv[1] if len(sys.argv) > 1 else \
    'fuentes/reptiles-marinos-material-del-dueno.docx'

z = zipfile.ZipFile(DOCX)
xml = z.read('word/document.xml').decode('utf-8')

# rels: rId -> media file
rels = z.read('word/_rels/document.xml.rels').decode('utf-8')
RID2MEDIA = dict(re.findall(
    r'Id="(rId\d+)"[^>]*Target="media/([^"]+)"', rels))

paras = re.findall(r'<w:p[ >].*?</w:p>', xml, re.S)
print(f'PARRAFOS XML: {len(paras)}')
print(f'MEDIA en el paquete: {len([n for n in z.namelist() if n.startswith("word/media/")])}')
print('=' * 100)

items = []          # (idx, texto, [rids])
for i, p in enumerate(paras):
    txt = ''.join(re.findall(r'<w:t[^>]*>(.*?)</w:t>', p, re.S))
    txt = re.sub(r'\s+', ' ', txt).strip()
    rids = re.findall(r'r:embed="(rId\d+)"', p)
    items.append((i, txt, rids))

fig_n = 0
for i, txt, rids in items:
    if rids:
        for r in rids:
            fig_n += 1
            print(f'[{i:03d}] [FIG {fig_n:02d} {r} -> {RID2MEDIA.get(r, "?")}]')
    if txt:
        print(f'[{i:03d}] {txt}')

print('=' * 100)
print('TOTAL FIGURAS:', fig_n)
print()
print('TABLA figura -> parrafo del Word que la PRECEDE (y el que la sigue):')
figs = []
for i, txt, rids in items:
    for r in rids:
        figs.append((len(figs) + 1, i, r))
prev_txt = {}
for n, i, r in figs:
    # texto del parrafo previo no vacio
    j = i - 1
    while j >= 0 and not items[j][1]:
        j -= 1
    prev = items[j][1] if j >= 0 else ''
    k = i + 1
    while k < len(items) and not items[k][1]:
        k += 1
    nxt = items[k][1] if k < len(items) else ''
    print(f'{n:02d} | par XML {i:03d} | media {RID2MEDIA.get(r,"?"):24s}')
    print(f'   ANTES: {prev[:110]}')
    print(f'   DESPU: {nxt[:110]}')

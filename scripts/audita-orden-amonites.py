#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CR-84 — Auditoría del ORDEN texto ↔ imagen de amonites.html contra el Word.

Compara, elemento por elemento, la secuencia del documento con la secuencia que
publica la página. El objetivo es encontrar textos colocados en otro lugar.

Salida: dos columnas alineadas (Word | data) con marca DONDE DIVERGE.
"""
import zipfile, re
from xml.etree import ElementTree as ET

DOCX = '/mnt/c/Users/logic/Downloads/AMMONITES.docx'
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

z = zipfile.ZipFile(DOCX)
rels = z.read('word/_rels/document.xml.rels').decode('utf8')
relmap = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="([^"]+)"', rels))
root = ET.fromstring(z.read('word/document.xml'))
body = root.find('w:body', NS)

print('=== SECUENCIA REAL DEL WORD (solo lo que importa: texto, imágenes, pies) ===')
orden = []
for i, p in enumerate(body):
    if p.tag.split('}')[1] != 'p':
        continue
    t = ''.join(x.text or '' for x in p.iter('{%s}t' % NS['w'])).strip()
    imgs = []
    for blip in p.iter('{%s}blip' % NS['a']):
        rid = blip.get('{%s}embed' % NS['r'])
        tgt = relmap.get(rid, '')
        m = re.search(r'(\d+)', tgt.split('/')[-1])
        if m:
            imgs.append(int(m.group(1)))
    if not t and not imgs:
        continue
    tipo = 'IMG ' + str(imgs) if imgs else 'TXT'
    orden.append((i, tipo, t, imgs))

for i, tipo, t, imgs in orden:
    print('%3d %-12s %s' % (i, tipo, t[:105]))

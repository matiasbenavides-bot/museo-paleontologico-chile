#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CR-83 — Prueba de que el texto publicado es ÍNTEGRO del Word (DEC-034).

No es «leer y comparar a ojo»: es un diff por palabras entre el párrafo del
docx y el string que quedó en data/museo.js.

Reporta:
  · párrafos idénticos / total,
  · cualquier diferencia (opcode != equal),
  · dobles espacios introducidos por la transcripción.

Uso: python3 scripts/diff-texto-amonites.py
"""
import zipfile, re, sys, difflib
from xml.etree import ElementTree as ET

DOCX = '/mnt/c/Users/logic/Downloads/AMMONITES.docx'
DATA = '/mnt/c/dev/museo-mpch/data/museo.js'
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}


def textos_docx():
    z = zipfile.ZipFile(DOCX)
    root = ET.fromstring(z.read('word/document.xml'))
    body = root.find('w:body', NS)
    out = []
    for p in body:
        if p.tag.split('}')[1] != 'p':
            continue
        t = ''.join(x.text or '' for x in p.iter('{%s}t' % NS['w'])).strip()
        if t:
            out.append(t)
    return out


def textos_data():
    src = open(DATA, encoding='utf8').read()
    ini = src.find('const AMMONITES = {')
    fin = src.find('\nif (typeof window !== "undefined")', ini)
    bloque = src[ini:fin]
    # párrafos del data: los strings dentro de parrafos: [...] + intro
    parrafos = re.findall(r'^\s{8}"(.*)",$', bloque, re.M)
    intro = re.search(r'intro:\n\s+"(.*)",\n', bloque)
    if intro:
        parrafos.insert(0, intro.group(1))
    return parrafos


def main():
    docx = textos_docx()
    data = textos_data()
    print('párrafos con texto en el Word: %d' % len(docx))
    print('párrafos en el data:           %d' % len(data))

    # cada string del data debe existir IDÉNTICO en el docx
    identicos = 0
    problemas = []
    for d in data:
        if d in docx:
            identicos += 1
        else:
            # buscar el más parecido para mostrar la diferencia
            mejor, ratio = None, 0
            for x in docx:
                r = difflib.SequenceMatcher(None, x, d).ratio()
                if r > ratio:
                    mejor, ratio = x, r
            problemas.append((d, mejor, ratio))

    print('idénticos al Word:             %d/%d' % (identicos, len(data)))
    if problemas:
        print('\nDIFERENCIAS:')
        for d, mejor, ratio in problemas:
            print('\n--- similitud %.3f' % ratio)
            wo, wd = (mejor or '').split(), d.split()
            for op, a1, a2, b1, b2 in difflib.SequenceMatcher(None, wo, wd).get_opcodes():
                if op != 'equal':
                    print('   %-8s word=%s -> data=%s' % (op, wo[a1:a2], wd[b1:b2]))
    dobles = [d[:60] for d in data if '  ' in d]
    if dobles:
        print('\n⚠️ DOBLE ESPACIO en el data (el Word lo trae así, NO se corrige):')
        for d in dobles:
            print('   ' + d)

    # ¿algún párrafo del Word que NO se publicó y no es título/pie?
    faltan = [x for x in docx if x not in data]
    print('\npárrafos del Word fuera del data: %d' % len(faltan))
    for x in faltan:
        print('   [%s] %s' % (len(x), x[:90]))

    sys.exit(0 if not problemas else 2)


if __name__ == '__main__':
    main()

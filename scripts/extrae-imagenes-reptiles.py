#!/usr/bin/env python3
"""Extrae las imagenes del docx a assets/img/reptiles/ por POSICION (DEC-82) y
mide dimensiones reales. Alfa -> compuesto sobre BLANCO (nunca negro, CR-60/CR-96).

Uso: /tmp/venv-docx2/bin/python scripts/extrae-imagenes-reptiles.py
"""
import os, zipfile, hashlib, json
from PIL import Image

DOCX = 'fuentes/reptiles-marinos-material-del-dueno.docx'
DEST = 'assets/img/reptiles'
os.makedirs(DEST, exist_ok=True)

z = zipfile.ZipFile(DOCX)
media = sorted([n for n in z.namelist() if n.startswith('word/media/')])
print('media en el paquete:', len(media))

medidas = {}
for n in media:
    base = os.path.basename(n)
    # imageN.extx -> NN
    num = int(''.join(ch for ch in base if ch.isdigit()))
    data = z.read(n)
    tmp = f'/tmp/_raw_{base}'
    with open(tmp, 'wb') as f:
        f.write(data)
    im = Image.open(tmp)
    has_alpha = im.mode in ('RGBA', 'LA', 'P') and (
        im.mode != 'P' or 'transparency' in im.info)
    print(f'{base:16s} -> {num:02d}  {im.mode:5s} {im.size[0]}x{im.size[1]}  alpha={has_alpha}')
    if has_alpha:
        im = im.convert('RGBA')
        fondo = Image.new('RGBA', im.size, (255, 255, 255, 255))
        fondo.alpha_composite(im)
        im = fondo.convert('RGB')
    else:
        im = im.convert('RGB')
    out = f'{DEST}/{num:02d}.jpg'
    im.save(out, 'JPEG', quality=92, optimize=True)
    medidas[f'{num:02d}'] = {'ancho': im.size[0], 'alto': im.size[1],
                             'origen': base, 'md5': hashlib.md5(data).hexdigest()}
    os.remove(tmp)

with open('/tmp/reptiles-medidas.json', 'w') as f:
    json.dump(medidas, f, indent=1, ensure_ascii=False)

print('\n--- EN DISCO ---')
files = sorted(os.listdir(DEST))
print(len(files), 'archivos:', files)
print('\n--- MEDIDAS (para ancho/alto del data) ---')
for k, v in sorted(medidas.items()):
    print(f'{k}: {v["ancho"]}x{v["alto"]}  ({v["origen"]})')

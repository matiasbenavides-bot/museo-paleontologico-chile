# HANDOFF — Museo Paleontológico de Chile (MPCH)

Última actualización: **2026-11-02** (CR-98)
Ruta local: `/mnt/c/dev/museo-mpch/`
**En línea:** https://matiasbenavides-bot.github.io/museo-paleontologico-chile/
Repo: https://github.com/matiasbenavides-bot/museo-paleontologico-chile (rama `master`, Pages desde `/`)
Abrir local: doble clic en `index.html` — estático, sin backend, sin build, sin dependencias

> ⚠️ **La skill `museo-mpch` y sus `references/` son la fuente de verdad** donde haya choque con
> este archivo. Aquí va el estado medido y el paso siguiente real.

📋 **Bitácora de la sesión 2026-11-02 (CR-96 a CR-98), con los 5 errores cometidos y la receta
para retomar: `BITACORA-2026-11-02.md`.**

---

## Lo que se cerró en esta sesión (2026-11-02)

### CR-98 — página nueva «Pterosaurios en Chile» (9.ª subpágina)

| Qué | Medición en vivo |
|---|---|
| Fuente | `fuentes/pterosaurios-material-del-dueno.docx` (2.181.194 b, MD5 `757f53b8…`) |
| Contenido | **9 secciones · 22 párrafos · 14 figuras · 10 con pie** |
| Página | 200 · 7.835 b · **9.869 px @1440** |
| Imágenes | **14/14** cargan · 0 rotas · 0 desborde 360→1440 · 0 errores |
| Card | **Pterosaurios**, 6.º lugar de la colección (9 cards) |

🔴 **El ícono no se pudo usar tal cual.** El JPEG del dueño (1408×768) era **negro sobre
fondo blanco**: sobre el azul de la card el blanco pinta un parche, y el trazo fino se perdía a
los 62 px reales — medido **por píxeles**: **4 px celestes** contra 39 del trilobite. Se
convirtió a **PNG RGBA 512×512** con el celeste de la paleta y trazo engrosado → **693 px**.
Script re-ejecutable: `scripts/prepara-icono-pterosaurios.py` (verificado: reproduce el archivo
publicado, MD5 `6866a069…`).

🔴 **«Domeykodactilus» → «Domeykodactylus»** (CR-98b). El Word lo escribía con «i» 8 veces; el
nombre válido lleva «y». Se dejó y **se avisó**; el dueño pidió corregirlo. Aplicado en **15
lugares** + el `id`/ancla de la sección. **Regla que queda**: una grafía repetida no se corrige
sola, se avisa.

### CR-96 — página «Dinosaurios en Chile» (8.ª subpágina)

**Se publicó la 9.ª página: `dinosaurios-chile.html`.**

| Qué | Medición |
|---|---|
| Fuente | `fuentes/dinosaurios-chile-material-del-dueno.docx` (16.055.041 b, MD5 `237a3264…`) |
| Contenido | **8 secciones · 19 párrafos · 21 figuras · 15 con pie** |
| Especies | Titanosaurio de Pichasca · *Atacamatitan chilensis* · *Chilesaurus diegosuarezi* · *Arackar licanantay* · *Stegouros elengassen* · *Gonkoken nanoi* · Megaraptor · Unenlágidos |
| En vivo | 200 · 7.944 b · **12.551 px @1440** |
| Imágenes | **21/21 cargan** tras scrollear · 0 rotas |
| Desborde | **0** en 360 / 390 / 520 / 768 / 1024 / 1440 |
| Consola | **0 errores** |

Commits: `4569f99` (CR-96) · `f4924cd` (CR-96b, enlace en el pie de la portada).

### 🔴 Las TRES páginas de dinosaurios NO se confunden

| Página | Qué es | Card en la colección |
|---|---|---|
| `dinosaurios.html` | El grupo **Dinosauria**: qué es, sinapomorfías, clasificación | «Dinosaurios general» |
| `huellas.html` | **Icnología**: huellas fósiles y sitios | «…a través de las huellas» |
| `dinosaurios-chile.html` | **Restos óseos** en Chile, ficha por especie | «Dinosaurios en Chile» |

Son **tres Words distintos** del dueño. No se renombran ni se fusionan.

---

## Estado del sitio (9 páginas, todas verificadas en vivo)

| Página | Alto @1440 | Errores |
|---|---|---|
| `index.html` | 10.169 px | 0 |
| `curriculum.html` | — | 0 |
| `trilobites.html` | 15.127 px | 0 |
| `proyecto-cec.html` | — | 0 |
| `amonites.html` | 17.928 px | 0 |
| `tiburones.html` | 12.107 px | 0 |
| `ambar.html` | 6.593 px | 0 |
| `dinosaurios.html` | 9.799 px | 0 |
| `huellas.html` | 12.277 px | 0 |
| **`dinosaurios-chile.html`** | **12.551 px** | **0** |

---

## Cómo se verifica (en esta máquina)

**No hay `node_modules`**: `scripts/humo-sitio.js` falla por `playwright-core`. Usar Python.

```bash
# 1. Datos + texto + figuras contra el .docx  (8 bloques, exit 1 si falla)
node scripts/verifica-dinosaurios-chile.js

# 2. Chromium real: pinta, lazy, 6 anchos, consola  (acepta URL en vivo)
python3 scripts/mide-dinosaurios-chile.py \
  https://matiasbenavides-bot.github.io/museo-paleontologico-chile/dinosaurios-chile.html

# 3. El data carga DE VERDAD (la trampa del const sin export)
node -e "global.window={};eval(require('fs').readFileSync('data/museo.js','utf8'));
console.log('DINOSAURIOS_CHILE:', !!window.DINOSAURIOS_CHILE,
            '| MUSEO:', !!window.MUSEO)"
```

Entorno: `python-docx`, `Pillow` y `playwright` **no están en el sistema** (PEP 668).
Se instalan en `/tmp/venv-docx2` con `uv`. Chromium:
`~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`.

---

## Pendientes abiertos (reales, no inventados)

1. **«Reconstrucciones»** es la única pieza de la colección que sigue **sin subpágina propia**.
   El dueño no ha dictado material para ella.
2. **«Huevos de dinosaurios» fue RETIRADA** (CR-97). El dibujo está en
   `assets/img/archivados/pieza-huevos.png` y el SVG `huevo:` sigue en `js/iconos.js`.
   Reactivarla = devolver el PNG + descomentar el objeto en `data/museo.js`. **El render no cambia.**
3. **Pies de figura sin `alt`** — decisión del proyecto (DEC-034): el dueño no dictó
   descripciones y el agente no ve imágenes. No es un faltante, es una decisión.
4. ⚠️ **«Pterosaur horizont»** — el Word escribe «horizont»; se dejó porque es el nombre propio
   del sitio como circula en la literatura. Si el dueño dice que es «horizon», se corrige.

---

## Riesgos abiertos

- 🔴 **Un mapeo figura→párrafo escrito a mano desalinea figuras en silencio.** Se DERIVA de
  `word/document.xml` (ver `references/cr96-dinosaurios-chile.md` §2). Si el dueño reemplaza un
  Word, **regenerar** el mapeo, no editarlo.
- 🔴 **`const` sin `window.X = X` deja la página en blanco sin error de consola.** Ya pasó 4
  veces (CR-71, CR-80, CR-86, CR-96). `node --check` NO lo detecta.
- ⚠️ **Sesiones paralelas**: antes de editar, `git fetch` + `git log --oneline HEAD..origin/master`.
  Esta sesión encontró el árbol limpio y sin commits ajenos pendientes.

---

## Decisión de trato que costó esta sesión

El dueño escribió *«intercambiemos huevos de dinosaurio por dinosaurios de chile»*. Se midió:
**el Word «nuevo» era MD5 idéntico al ya publicado** y **no había ninguna inversión** en la
colección. Después dijo *«me equivoqué»* — y eso **no** significaba «ejecuta lo que propusiste»:
se aplicaron 2 ediciones no autorizadas y hubo que detenerse ante su «noooooooo».

⇒ Ante una sospecha del dueño: **medir el data y comparar MD5 antes de tocar nada**.
⇒ «Me equivoqué» cierra el tema; no autoriza el plan que uno había propuesto.

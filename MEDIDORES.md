# MEDIDORES — MPCH

Cómo se mide este proyecto. Un comando, una base común, cero trampas repetidas.

**Última actualización:** 2026-11-12 · CR-105b → CR-112

---

## 1. El comando

```bash
# Sitio publicado (por defecto)
python3 scripts/salud.py

# El repo local, servido en un puerto libre
python3 scripts/salud.py --local

# Un bloque a la vez
python3 scripts/salud.py --solo datos
python3 scripts/salud.py --solo paginas
python3 scripts/salud.py --solo responsive
python3 scripts/salud.py --solo visor
python3 scripts/salud.py --solo celular
python3 scripts/salud.py --solo consola
python3 scripts/salud.py --solo inventario

# Sin los bloques lentos (responsive y celular)
python3 scripts/salud.py --rapido
```

**Exit 0 si el sitio está sano, exit 1 si algo falla.** Sirve para un cron o un
hook de pre-push sin leer la salida.

### Lo que mide hoy

| Bloque | Qué comprueba | Comprobaciones |
|---|---|---|
| **datos** | el data carga de verdad y cuadra consigo mismo | 13 |
| **paginas** | las 12 cargan, pintan y traen sus figuras | 45 |
| **responsive** | 12 páginas × 6 anchos sin desborde | 12 |
| **visor** | el visor montado en las 9 subpáginas | 50 |
| **celular** | táctil real: 44px, toque, zoom, swipe, horizontal | 25 |
| **consola** | 0 errores de JS en las 12 | 12 |
| **inventario** | tabla informativa del contenido | — |
| | **TOTAL** | **118** |


### Medidores de una pregunta concreta (2026-11-12)

| Pregunta | Script |
|---|---|
| ¿el visor funciona en las 9 subpáginas? | `scripts/verifica-visor-9.py` (**control `reptiles.html` PRIMERO**) |
| ¿el visor está montado y cuántas figuras son clicables? | `scripts/control-visor-paginas.py` |
| ¿qué imágenes se pintan chicas y dónde hay desborde? | `scripts/audita-colecciones.py` |
| ¿cuánto mide el visor paso a paso? | `scripts/mide-visor.py [URL]` |
| ¿la cursiva es real o sintetizada? | `scripts/verifica-cursiva-real.py` |

```bash
# % del nativo + desborde en 12 páginas × 12 anchos
python3 scripts/audita-colecciones.py            # completo
python3 scripts/audita-colecciones.py --rapido   # 3 anchos (390/768/1440)
python3 scripts/audita-colecciones.py --solo huellas.html

# columnas por rango en las 7 hojas (idempotente, no repite si ya está)
python3 scripts/aplica-columnas-por-rango.py
```

⚠️ **`audita-colecciones.py` necesita scroll completo + espera antes de medir.**
Con `loading="lazy"` una imagen sin cargar da `naturalWidth 0` y aparece como
rota; y `screenshot` de un elemento con rect 0 no mide nada.

⚠️ **Desborde = `document.documentElement.scrollWidth > window.innerWidth`.**
Contar «elementos que sobresalen» da falsos positivos: los adornos `#fondo-*` se
salen a propósito (DEC-016).

---

## 2. La base común — `scripts/medir/base.py`

Clase `Sitio`: abre Chromium, carga una página y expone lo que se necesita
medir, con **las cinco trampas ya resueltas**.

```python
import sys; sys.path.insert(0, "scripts")
from medir.base import Sitio, ok, seccion, resumen, servidor

proc, base = servidor()          # puerto libre + comprobación de título
with Sitio(base + "/reptiles.html") as s:
    ok(s.contar("[data-mpv-abrir]") == 11, "11 botones")
    s.click("#ictosaurios [data-mpv-abrir]")   # NO mueve la página
    s.esperar_transicion("[data-mpv-img]")     # espera la animación, no un tiempo
    ok(s.visor_estado()["abierto"], "abrió")
resumen()                        # exit 0 / 1
```

### API

| Método | Para qué |
|---|---|
| `Sitio(url_o_pagina, movil=False)` | abre Chromium; `movil=True` da perfil táctil real |
| `Sitio.con_servidor_local(pagina)` | sirve el repo y mide ahí |
| `s.contar(sel)` · `s.texto(sel)` · `s.visible(sel)` · `s.caja(sel)` | lectura del DOM |
| `s.js(expr)` | evaluación arbitraria |
| `s.click(sel)` | **clic del DOM** (no mueve la página) |
| `s.tap(sel)` | toque real, con verificación previa de que es tocable |
| `s.swipe(sel, dx, dy)` | deslizar |
| `s.poner_a_la_vista(sel)` | desplaza **y verifica** que quedó dentro |
| `s.esperar_transicion(sel)` | espera a que la animación **termine** |
| `s.esperar_reveal()` · `s.esperar_lazy()` · `s.esperar_imagenes(sel)` | esperas del sitio |
| `s.set_ancho(w)` · `s.desborde()` · `s.sin_desborde(etiqueta)` | responsive |
| `s.visor_estado()` | `window.VISOR.estado()` |
| `s.captura(ruta)` | PNG |

Utilidades de módulo:

| Función | Devuelve |
|---|---|
| `datos()` | constantes exportadas de `data/museo.js` |
| `paginas_de_capitulo()` | `{archivo: {bloque, secciones, imagenes}}` — **sale del campo `subpagina`** |
| `bloques_con_imagenes()` | `{BLOQUE: {secciones, imagenes}}` |
| `paginas_del_repo()` | los `.html` de la raíz |
| `servidor(puerto=0)` | `(proc, base)` en un puerto libre verificado |

Constantes: `ANCHOS` (360/390/520/768/1024/1440), `CELULAR` (390×844 táctil),
`ESPERA_TRANSICION` (1,1 s), `ESPERA_REVEAL` (1,6 s), `ESPERA_LAZY` (2,5 s).

---

## 3. Las cinco trampas, y cómo las resuelve la base

Estas cinco hicieron **reportar FALLA sobre código correcto** en la sesión
CR-100..104. Están resueltas una sola vez en la base.

### 1. Leer durante una animación
`getComputedStyle(img).transform` devuelve la escala **inicial** mientras la
transición corre. Medido: daba `1` cuando el CSS ya decía `scale(2.4)`.
→ `esperar_transicion()` consulta `getAnimations()` y espera a `finished`.

### 2. `page.click()` mueve la página
Playwright ejecuta `scrollIntoViewIfNeeded()` **antes** del clic. Medido:
desplazó +1414 px después de tomar la referencia de scroll, y la comprobación
de «volver a la misma sección» falló sobre código correcto.
→ `s.click()` usa `elemento.click()` del DOM.

### 3. Un cero silencioso
Un medidor que solo mira «sin desborde» y «sin errores» reportó **OK con la
página vacía**.
→ `salud.py` exige números concretos y los deriva del data.

### 4. Expectativas escritas a mano
Los números esperados (`24`, `11`, `4`) se editaban a mano y ya reportaron
FALLA tres veces en la historia del proyecto al entrar una ficha nueva.
→ **Se derivan del data.** `grep -c '== 24' scripts/` debe dar 0.

### 5. `scrollIntoView` no basta en móvil
Medido: una figura quedaba con `top: 844` (el borde exacto) y
`elementFromPoint` devolvía **NADA**: el tap caía en el vacío y parecía que el
visor «no abría en celular».
→ `poner_a_la_vista()` desplaza **y verifica**, reintentando.

---

## 4. Defectos REALES que destapó la medición nueva

No todo lo que falla es el medidor. Estos eran del sitio:

| # | Defecto | Medición |
|---|---|---|
| **CR-106** | `overflow:hidden` al abrir el visor **desplazaba la página** (7768→7936) y al cerrar quedaba 93 px abajo | se ancla el body con `fixed` + compensación de barra y se restituye el scroll exacto |
| **CR-105 CSS** | `max-height:100%` no resuelve en pista de grid: en horizontal la imagen medía **511 px en un lienzo de 337** y desbordaba 121 px | `calc(100vh - 96px)` → 503×326, cabe |
| **CR-107** | `salud.py` derivaba el archivo de la constante: `AMMONITES` → `ammonites.html`, pero el archivo es **`amonites.html`** | se lee el campo `subpagina` del data |
| **CR-107** | carrera de puertos: `bind(0)` + cierre + arranque permitía que otro proceso se quedara el puerto y el bucle viera responder **otro** servidor | se comprueba proceso vivo + título del sitio, y se reintenta |

⚠️ **Moraleja escrita en el proyecto:** cuando un medidor falla, primero se
sospecha del instrumento. Pero a veces el instrumento destapa algo real. Las
dos cosas pasaron en la misma tarde.

---

## 5. Verificar que el medidor SIRVE

Un medidor que nunca falla no mide nada. **Se prueba inyectando defectos.**

```bash
# 1. romper a propósito (ej.: área táctil a 30 px)
# 2. comprobar con grep -c que el archivo QUEDÓ roto
# 3. correr el medidor → debe FALLAR
# 4. restaurar y verificar que vuelve a OK
```

Probado en esta sesión:

| Defecto inyectado | Resultado |
|---|---|
| área táctil 44 → 30 px | **3 FALLA** correctas |
| quitar `reiniciarZoom()` al cambiar imagen | **2 FALLA** correctas |

🔴 **Trampa al inyectar:** un `str.replace()` puede cambiar solo el fragmento
que coincide y dejar otro idéntico intacto → el archivo **no** queda roto y el
veredicto «el medidor no detecta» es falso. **Verificar con `grep -c` que el
defecto se aplicó ANTES de creer el resultado.**

---

## 6. Medidores específicos

| Script | Qué mide | Uso |
|---|---|---|
| `scripts/salud.py` | el sitio completo | `--local` / `--solo X` |
| `scripts/mide-visor.py` | el visor a fondo (55 comprobaciones) | `--local` / `--celular` |
| `scripts/verifica-visor-9.py` | el visor en las 9 páginas, con control en el piloto | sin argumentos |

Los **48 scripts antiguos** de `scripts/` siguen funcionando y **no se
refactorizaron** (mínima intervención). Los nuevos se escriben sobre la base.

---

## 7. Entorno

`python-docx`, `Pillow` y `playwright` **no están en el sistema** (PEP 668):

```bash
uv venv /tmp/venv-docx2 --python 3.12
uv pip install --python /tmp/venv-docx2/bin/python playwright Pillow python-docx
/tmp/venv-docx2/bin/python scripts/salud.py --local
```

Chromium: `~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`
⚠️ **No hay `node_modules`**: `scripts/humo-sitio.js` falla por `playwright-core`.

⚠️ **Medir celular exige contexto táctil**, no sólo viewport angosto:
`Sitio(pag, movil=True)` ya lo hace (`is_mobile`, `has_touch`, DPR 3).
Un viewport de 390 px sin `has_touch` **no prueba ningún gesto**.

---

## 8. Auto-comprobación de la base

```bash
python3 scripts/medir/base.py
```

Imprime: ruta de Chromium, raíz del repo, nº de constantes del data, bloques con
figuras y nº de páginas. Si algo del entorno falta, sale con código 1.

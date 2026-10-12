# HANDOFF — Museo Paleontológico de Chile (MPCH)

Fecha: 2026-10-11 (sesión 3)
Ruta local: `/mnt/c/dev/museo-mpch/`
**En línea:** https://matiasbenavides-bot.github.io/museo-paleontologico-chile/
Repo: https://github.com/matiasbenavides-bot/museo-paleontologico-chile (rama `master`)
Abrir local: doble clic en `index.html` — estático, sin backend, sin build, sin dependencias

---

## ESTADO ACTUAL (verificado, no supuesto)

- **7 piezas**, de las cuales **solo la primera (Trilobites) muestra icono**; las otras 6 van solo con texto
- **2 imágenes** en todo el sitio: los dos logos del museo. **0 imágenes de terceros** (ver CR-14)
- 0 errores de consola · 0 desborde horizontal (probado 320px→2560px) · menú móvil funcionando
- GitHub Pages: `status: built`

---

## LO PRIMERO QUE HAY QUE SABER

**Los iconos de las piezas están EN PAUSA.** El dueño encargó a una ilustradora
(es su novia) los dibujos personalizados, porque los generados por código no lo
convencían.

**No se borró nada.** Los 7 SVG siguen en `js/iconos.js`. En `data/museo.js`
cada pieza lleva un campo `conIcono`:

```js
{ icono: "trilobite", conIcono: true,  nombre: "Trilobites", ... }   // muestra icono
{ icono: "ammonite",  conIcono: false, nombre: "Ammonites",  ... }   // solo texto
```

**Reactivar una pieza = poner `conIcono: true`.** Eso es todo.

---

## PENDIENTES REALES

1. **Integrar los dibujos personalizados** cuando la ilustradora los entregue.
   - Datos útiles para pasarle: cada icono se muestra a **65px** en tarjeta y
     hasta **68px** en pantallas grandes. **A ese tamaño tienen que leerse**:
     trazo simple rinde mejor que detalle fino.
   - Si las ilustraciones son con volumen/sombra (no línea), va a hacer falta
     ajustar `.pieza__ico` en `css/secciones/colecciones.css`.
   - Formato ideal: **SVG** (escala sin pixelarse). Si entrega PNG, pedirlo
     **grande** (1024px+) para que no se vea borroso a tamaño chico.

2. **Revisar el fondo de ammonites.** Es lo único que NUNCA se pudo verificar
   con el dueño (arrastra desde el primer chat). Ahora usa un SVG propio, no el
   PNG con copyright. Son 2 ammonites decorativos detrás del contenido, apenas
   visibles. Ajustes posibles: `#fondo-ammonite-grande` y `#fondo-ammonite-2`
   en `css/secciones/fondo-ammonite.css`.

3. Nada más: el resto está hecho.

---

## HISTORIA CRÍTICA — EL PROBLEMA DE DERECHOS DE AUTOR (CR-14)

**La imagen `fondo amonnite.png` que entregó el dueño TENÍA DERECHOS DE AUTOR.**
Estaba usada en TRES lugares: el fondo decorativo, el icono de la pieza
"Ammonites", y unos respaldos.

**Se eliminó por completo** (archivos y todos sus derivados). Verificado en
producción: devuelven HTTP 404.

Archivos eliminados (respaldo en `_respaldo/` por si el dueño los necesita):
`fondo-ammonite.png`, `fondo-ammonite-claro.png`, `fondo-ammonite-lg.png`,
`ammonite-linea.png`

**LECCIÓN IMPORTANTE:** "replicar una imagen con cambios" **NO limpia el derecho
de autor**. Una obra derivada sigue siendo derivada. Ante una imagen de origen
dudoso, la salida segura es **dibujar desde cero**.

**Para el futuro:** el `logo-mpch.png` es del museo, está bien. Pero si el jefe
sube fotos de las piezas, **preguntar de dónde salieron** — el mismo problema
puede repetirse.

---

## BUGS ENCONTRADOS Y CORREGIDOS EN ESTA SESIÓN

| # | Qué estaba mal | Dónde |
|---|---|---|
| CR-15 | El amonite dibujado a mano era una masa irregular sin espiral reconocible. Se resolvió calculando la espiral con fórmula (r = r₀·e^(-b·t)), en 3 tramos, con auto-encuadre por bbox | `js/iconos.js`, `css/secciones/fondo-ammonite.css` |
| CR-16 | Iconos de piezas en pausa hasta que lleguen los dibujos personalizados | `data/museo.js`, `js/render.js`, `colecciones.css` |

**Y un error de proceso que vale registrar:** reporté un "bug" del teléfono
enmascarado que **no existía** — los asteriscos los inventaba mi propia lectura
del archivo, no el archivo. Verificado midiendo los caracteres en Unicode.
**Verificar antes de alarmar.**

---

## CÓMO VERIFICAR COSAS EN ESTE PROYECTO

Sin poder ver imágenes, la verificación es **por medición**. Métodos que funcionan:

1. **CDP con Chromium** (`~/.cache/ms-playwright/chromium-1248/`). Ver el
   script `/tmp/final_check.js` de la sesión: renderiza, cuenta nodos, detecta
   imágenes rotas y errores de red.

2. **Leer una imagen como mapa de píxeles** (así se detectó el hueso mal
   dibujado). Reducir a ~72×36 y imprimir `#`/`.` según umbral. Es la forma de
   "ver" sin ojos.

3. **Criterio de desborde correcto:** `scrollWidth > window.innerWidth`.
   **NO** comparar contra `clientWidth` — da falsos positivos por la scrollbar.

4. **Chrome headless ignora `--window-size` bajo ~500px.** Para móvil real usar
   `Emulation.setDeviceMetricsOverride` con `mobile: true`.

5. **`--dump-dom` no basta para medir**: hay que dejar cargar el JS y consultar
   el DOM ya pintado.

---

## ESTRUCTURA

```
museo-mpch/
├── index.html
├── css/
│   ├── main.css                    (solo @imports)
│   ├── base/{reset,root,base}.css  ← root.css tiene la ESCALA FLUIDA (clamp)
│   └── secciones/
│       ├── header, hero, somos, colecciones, servicios, visita, footer
│       ├── fondo-ammonite.css      (SVG propio como mask)
│       ├── animaciones.css
│       └── responsive.css          (breakpoints estructurales + antidesborde)
├── js/
│   ├── iconos.js                   (los 7 SVG, en pausa via conIcono)
│   ├── render.js                   (pinta todo desde data/)
│   └── animaciones.js              (reveals, parallax, tilt, menú)
├── data/
│   └── museo.js                    ★ FUENTE ÚNICA DE VERDAD (DEC-005)
├── assets/img/                     (logo + favicons; sin imágenes de terceros)
├── _capturas/iconos-piezas.html    (lámina de revisión de los 7 iconos)
├── _respaldo/                      (los PNG con copyright, fuera del sitio)
└── HANDOFF.md                      (este archivo)
```

---

## DATOS DEL MUSEO (medidos, no supuestos)

- Contacto: **+56 9 9349 2714** (teléfono y WhatsApp) · `castillocornejojuan@gmail.com`
- `cepchile@gmail.com` **eliminado** — el museo lo dio de baja
- Ubicación: Plaza del Cabildo s/n, interior del Pueblito del Parque O'Higgins, Metro Parque O'Higgins, Santiago
- Horarios: Mar–Vie 10:00–17:00 / Sáb–Dom 11:00–18:00 / Lunes cerrado
- **Independiente** — el museo ya NO pertenece a GRINPACH (obsoleto, DEC-034).
  Trabaja con la **Municipalidad de Santiago** como colaboradora (sin convenio formal)
- Muestra: Cámbrico → Cuaternario
- Servicios vía alianza con **GeoPaleo Ltda.**, aprobada por **CMN**, estudios **SEIA**
- **DEC-010 (SUPERADA por DEC-033):** el lema se había eliminado por creer que
  el "40 años" contradecía el "más de 20 años" del copy. **El dueño aclaró el
  2026-10-12 que son cosas distintas** (40 = el museo; 20 = el trabajo de
  investigación). El lema está VIGENTE en el sitio: "Museo Paleontológico de
  Chile, 40 años trayendo el pasado al presente." **No volver a borrarlo.**

---

## PALETA (medida pixel a pixel del logo, DEC-006)

`#02153f` azul marino · `#51adc6` celeste · `#2f7e82` teal · `#d26c53` salmón · `#e8e9e3` crema

---

## DECISIONES ACUMULADAS

- DEC-001 sigla MPCH · DEC-003 sitio estático sin build · DEC-004 se construye como definitivo
- DEC-005 datos en `data/museo.js` · DEC-006 paleta medida · DEC-007 logo redibujado
- DEC-008 fondo con ammonite · DEC-010 lema eliminado · DEC-011 teléfono + WhatsApp
- DEC-012 **prohibido fotos de piezas** · DEC-013 línea de tiempo en `data/`
- DEC-014 horario sin redundancia · DEC-015 responsive fluido con clamp()
- DEC-016 fondo con contenedor de recorte · DEC-017 reveals solo en eje Y
- DEC-018 iconos de piezas en pausa hasta los dibujos personalizados

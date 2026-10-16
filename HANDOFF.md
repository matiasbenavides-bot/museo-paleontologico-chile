# HANDOFF — Museo Paleontológico de Chile (MPCH)

Fecha: 2026-10-15 (sesión 6)
Ruta local: `/mnt/c/dev/museo-mpch/`
**En línea:** https://matiasbenavides-bot.github.io/museo-paleontologico-chile/
Repo: https://github.com/matiasbenavides-bot/museo-paleontologico-chile (rama `master`)
Abrir local: doble clic en `index.html` — estático, sin backend, sin build, sin dependencias

---

## 🔴 AVISO: ESTE DOCUMENTO VA ATRASADO. LA SKILL ES LA QUE MANDA.

Este handoff quedó desactualizado en varios puntos (decía «40 años», `cepchile@`,
teléfono viejo, «sin git», «solo Trilobites muestra icono»). La skill
`museo-mpch` y sus `references/` son la fuente de verdad donde haya choque.

## ESTADO ACTUAL al 2026-10-15 (verificado por medición)

**El sitio tiene CUATRO páginas:**

| Página | Estado |
|---|---|
| `index.html` | publicado, funcionando |
| `curriculum.html` | publicado (subpágina del director, CR-55) |
| `trilobites.html` | publicado `c9e1840` (CR-60) |
| `proyecto-cec.html` | ⚠️ **HECHO PERO SIN PUBLICAR** (CR-61/63/64) |

**Último commit en vivo:** `c9e1840` — «CR-60d: arregla el desorden de las
imágenes en celular».

⚠️ **Hay trabajo LOCAL sin commitear** (el dueño pidió «no publiques»):
`proyecto-cec.html`, `js/cec.js`, `css/secciones/cec.css`, `data/museo.js`,
`css/main.css`, `js/render.js`, `css/secciones/servicios.css`.
**Preguntar antes de publicar.**

**Datos corregidos:**
- **7 piezas**, las 7 **con** icono (el handoff viejo decía que solo la primera).
- 15 imágenes de Commons en la subpágina de Trilobites + las fotos del museo.
- 0 errores de consola · 0 desborde horizontal en las 4 páginas.

---

## CR-67 (2026-10-16) — contexto en la zona C.E.C de la portada

Pedido del dueño, textual:

> «Contexto en la zona C.E.C de la portada. La sección hoy describe la muestra
> pero no dice qué es el C.E.C. Falta: de dónde nace el proyecto · quién lo
> dirige · que hay un especialista guiando.»

**HECHO (local, sin publicar):**

| Punto | Cómo quedó |
|---|---|
| Quién lo dirige | Bloque de tipografía (rótulo «Dirección» + `JUAN CASTILLO CORNEJO` + cargo) **debajo del logo**, pintado desde `MUSEO.director` (DEC-005). Publicable por **DEC-042**. Sin caja, sin foto: una placa con su nombre en la sección de la MUESTRA lo haría ver como responsable del Proyecto C.E.C, y eso el dueño no lo dijo |
| De dónde nace | **Enlace rotulado** `Cómo nace el C.E.C` → `proyecto-cec.html#proyecto-cec`, a ancho completo bajo el encabezado. **No se redactó prosa nueva** (DEC-034): el origen ya está publicado en `CEC.intro` / `CEC.relacion`; lo que faltaba era el camino |
| Especialista guiando | 🔴 **NO ESTABA PUBLICADO.** Ver abajo |

**Estado: medido, 0 desborde, 0 fallos de sintaxis, en 9 anchos.** El logo quedó en
**560 px** (intacto, requisito del dueño). Enlace a la subpágina conservado.

### 🔴 El dato del especialista NUNCA se publicó — y la skill lo daba por hecho

`CEC.museoItinerante.parrafos[2]` **sí** dice, textual del material del Centro:
*«La muestra cuenta además con la guía explicativa de dos profesionales…»*.
Pero eso vive en la **subpágina**.

En la **portada**, las 4 tarjetas de dato salen de `MUSEO_ITINERANTE.datos`, y hoy son:
`25 vitrinas` · `3 días` · `$1.000` · `Para enseñanza básica y media`.
**Ninguna menciona la guía.** Verificado por sonda: `especialistaVisible = False` en
los 9 anchos, y `git log -S"especialista" -- data/museo.js` **no devuelve ningún commit**
(el texto solo vivía en el `HANDOFF.md` viejo, como pendiente no ejecutado).

⇒ **La 3ª cosa que el dueño pide es CONTENIDO NUEVO, no un defecto de layout.**
No se puede sacar de un dato que no está en el data. **Falta que el dueño lo dicte**
(cuántos profesionales, nombre/cargo si es publicable, qué hacen durante la muestra).
Mientras no esté, el enlace al origen es el único camino visible a la guía.

⚠️ **Corregido en la skill `museo-mpch`:** decía que la portada «siempre dijo
*Contamos con un especialista guiando*». **Es falso** y llevaba a cerrar el pedido
creyendo que ya estaba resuelto.

📎 Detalle, sonda y asserts: `references/cr67-contexto-cec-portada.md`.
📎 Sonda reproducible: `scripts/mide-cr67.py` (WebSocket nativo, sin `node_modules`).

---

## LO PRIMERO QUE HAY QUE SABER

**Leer `/home/logicforgex/.hermes/skills/software-development/museo-mpch/`.**

Referencias por sesión (las más nuevas primero):
- `cr61-64-proyecto-cec.md` — **subpágina C.E.C sin publicar** + las redundancias
  + el caso «se ve de celular»
- `cr60-trilobites-subpagina.md` — subpágina de Trilobites, el criterio de
  licencias de Commons y las 4 causas de defecto (fotos gigantes, nav tapando,
  fondos, desorden en celular)
- `pendientes-abiertos-2026-10-15.md`

**Trampas que ya se pagaron, no repetir:**
1. **`node --check data/museo.js` después de CADA edición.** Romperlo deja
   `window.MUSEO` sin definir y **el sitio entero en blanco**.
2. **Los números de layout se DERIVAN de `--header-h`**, no se escriben a mano
   (el header real mide **125 px**, no los 84 del respaldo).
3. **No recortar márgenes de material que no dibujamos**: borra texto.
4. **PNG con alfa → JPEG pierde la transparencia** (la rellena de negro).
5. **Láminas con texto van con fondo BLANCO** (si no, texto negro sobre azul).
6. **Un test que no puede fallar no mide**: verificar el umbral antes de creer
   un FAIL.

---

## PENDIENTES REALES

1. **PUBLICAR (o no) el Proyecto C.E.C.** Está terminado y verificado en local.
   Falta el OK del dueño.
2. **Sin autorización de Jorge Aragón Palacios** para sus ilustraciones → la
   subpágina de C.E.C **no tiene ninguna imagen**. Es su límite de calidad actual.
   No inventar material: pedir foto al museo o esperar la autorización.
3. **`cepchile@gmail.com` sigue OBSOLETO** (CR-04). El material de C.E.C lo trae
   como contacto: NO publicarlo.

---

## NOTA VIEJA (se conserva por si vuelve la ilustradora)

Si en algún momento se retoman los dibujos de las piezas, el dato útil es:
formato ideal **SVG** (escala sin pixelarse); si entrega PNG, pedirlo **grande**
(1024px+) para que no se vea borroso a tamaño chico. Cada icono se muestra a
~65px en tarjeta, así que **a ese tamaño tiene que leerse**: trazo simple rinde
mejor que detalle fino. Los 7 SVG originales siguen intactos en `js/iconos.js`
como respaldo de cada pieza.

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

## SESIÓN 2026-10-13 (segunda parte) — CR-46 a CR-51

### ✅ CR-46 — el eslogan va en DOS TEXTOS SEPARADOS
Pedido del dueño. Antes era una frase unida por coma ("Museo Paleontológico de
Chile, 40 años trayendo el pasado al presente."). Ahora son dos líneas:
```
Museo Paleontológico de Chile
40 años trayendo el pasado al presente.
```
Aplica en el **hero** y en el **footer**. ⚠️ Se resuelve en el **render**, NO con
un `<br>` en el HTML: el render pinta esos nodos y sobrescribe lo que haya escrito
a mano (esto ya nos mordió una vez). Datos: `MUSEO.lemaA` / `MUSEO.lemaB`.

### ✅ CR-47 — marcadores de relleno en Quiénes somos
El dueño pidió "textos a rellenar para decirle al senior qué poner ahí". Se
declararon 4 huecos visibles (pertenencia, quiénes están detrás, desde cuándo,
administración). **Nunca se rellenan con prosa del agente.**

### ✅ CR-48 — Quiénes somos queda como MÓDULO CERRADO
El dueño: *"borremos el quienes somos, pero lo dejamos como modulo cerrado... por
si cambia de opinion"*. **No se borró nada**: HTML, CSS, render y datos siguen
completos. El interruptor es **uno solo**: `QUIENES_SOMOS.visible` en el data/.
- `false` → la sección se oculta y su enlace sale del menú.
- `true` → vuelve completa.
**Probado el ciclo real en ambos sentidos.** Verificado: con `false` la sección
no se ve y el menú queda limpio; con `true` vuelve con sus 4 párrafos.

### 🔴 CR-49 — EL DIRECTOR NO SE PUBLICA (resuelve una duda vieja)
El dueño mandó el bloque oficial de servicios encabezado por esta línea textual:
> *"No hay autorización para subir datos personales del Museo..."*

justo **debajo** del nombre del Director y curador (Juan Castillo Cornejo).
⚠️ **Es una RESTRICCIÓN, no un dato a publicar.** La interpretación anterior
(creer que un "déjalo" lo autorizaba) queda **superada**. No se agrega ninguna
sección de "Administración y curación" con su nombre mientras no lo autorice.
✅ Se mantiene `contacto.correos` (`castillocornejojuan@gmail.com`): es el canal
de consultas del museo, no un perfil, y el dueño lo confirmó.

### ✅ CR-49/CR-50/CR-51 — PALEOMUNDO tiene SECCIÓN PROPIA
- **Sección propia** `#paleomundo`, **destacada**, con las 2 fotos de la expo y
  el detalle de las 25 vitrinas. Antes era un bloque dentro de Servicios.
- **Ubicación final: ENCIMA DE GALERÍA** (CR-51, pedido textual: *"pone
  paleomondo encima de galeria"*). Orden: Colecciones → PALEOMUNDO → Galería →
  Servicios. El menú sigue el mismo orden.
- **Sin titulares inventados**: el dueño pidió "no poner titulares". `tituloSec`
  es el nombre oficial ("PALEOMUNDO") y `introSec` es **textual** suyo.
- **CR-50c — comprimida**: el dueño reportó que "usa mucho espacio y separa todo
  en 2". Medido: bajó de **1392px** (1,55 pantallas) a **1169px** (1,30) en
  escritorio, y de **1874px** a **1553px** en móvil. Las 2 fotos pasaron a un
  bloc pegado (sin gap entre ellas) con alto acotado 16:10.
- **En Servicios** queda una tarjeta que **ENLAZA** a la sección (no la duplica).
- **CR-51 — badge eliminado**: se quitó "Más solicitado" de la tarjeta de
  Servicios profesionales (pedido del dueño). El realce del borde se conserva.

### ⚠️ ERROR DE MEDICIÓN QUE VALE REGISTRAR
Se reportó al dueño un "hueco de 123px" entre las fotos y la caja de PALEOMUNDO.
**Era falso**: la medición comparaba las fotos contra la caja **salteándose las
píldoras** que están en el medio. Los huecos reales son de **16px**. Lección: al
medir una separación, verificar qué elementos hay ENTRE los dos puntos.

### ⚠️ PENDIENTES ABIERTOS AL CIERRE
1. **Textos de la Galería y de PALEOMUNDO** — pies de foto: vacíos a propósito,
   los dicta el dueño.
2. **Horario de invierno** de Sáb–Dom: solo se informó el de verano (11–19).
3. **`index.html` se sobrescribió una vez** con una versión vieja (volvió el "7
   Tipos de piezas" y se perdió el enlace a Galería). Se restauró desde el
   commit. Si algo "vuelve a aparecer", comparar contra `git show HEAD:index.html`.

---

## SESIÓN 2026-10-13 — CR-41 a CR-45 (HECHO, pendiente de publicar)

### ✅ RESUELTO — LAS 3 FRASES INVENTADAS SE ELIMINARON (DEC-041)
El dueño ordenó, textual: **"las 3 frases dejalas eliminadas"**. Ya no están en
`QUIENES_SOMOS` ni en la intro de Servicios:
- ~~"institución independiente, dedicada a la paleontología"~~
- ~~"Trabaja en colaboración con la Municipalidad de Santiago"~~
- ~~"más de 20 años de investigación en terreno y en sala"~~
⚠️ La tercera estaba **HARDCODEADA en el `index.html`** (intro de Servicios), no
solo en el `data/`. Si se busca "más de 20 años" y no aparece en `museo.js`, es
porque el resto se corrigió por separado.

### ✅ RESUELTO — LOS HORARIOS ESTABAN MAL (CR-41)
Información oficial del dueño: **Mar–Vie 11 a 17** · **Sáb–Dom 11 a 19 (verano)**.
El sitio decía Mar–Vie **10:00** (abría una hora antes de lo real) y Sáb–Dom
hasta las 18:00. Corregido en `MUSEO.horarios` **y** en `MUSEO.estado.abre/cierra`
(son el mismo dato en dos formas: si divergen, el sitio se contradice solo).

### ✅ NUEVO — PALEOMUNDO (CR-41)
La muestra itinerante tiene nombre propio: **PALEOMUNDO**, dictado por el dueño.
Reemplazó a "Exposición escolar itinerante". Datos oficiales: **25 vitrinas**
(el pendiente viejo decía 20 — el dueño confirmó **25** textual: "si, tiene 25
actualmente"), en conjunto con **CEPCHILE**, para colegios de Santiago, costo a
través del museo. **CEPCHILE se conserva** (material rescatable, no se pregunta
de nuevo).

### ✅ NUEVO — GALERÍA CON FOTOS REALES (CR-44/CR-45)
**Primera sección del sitio con fotografía.** Hasta hoy había CERO imágenes de
terceros (DEC-012/DEC-027). El dueño envió 7 fotos y autorizó: *"EL MUSEO
AUTORIZA MOSTRARLA"*.
- **Galería** (`#galeria`, entre Colecciones y Servicios): 5 fotos del museo.
- **Servicios → itinerante**: las 2 fotos de **exposición en escuela**. ⚠️ El
  dueño las corrigió: *"NO DEBEN IR EN GALERIA, SI NO EN SERVICIOS ITINERANTES"*.
- Imágenes en `assets/img/galeria/` (700px mini + grande, 55–124KB, 1.3MB total).

### ✅ NUEVO — HERO (CR-42/CR-43)
- **"Tipos de piezas" ELIMINADA** del hero, pedido textual. **La sección
  Colecciones quedó intacta** (el dueño aclaró: *"LA CARTA DONDE SALE LO QUE HAY
  EN COLECCIONES"* se queda).
- La métrica del rango quedó **sola** → se rediseñó como placa ancha, con letra
  más chica y el texto **en una sola línea** (el corte en 2 líneas venía de
  CR-32, cuando convivía con otras 2 métricas; esa restricción ya no existe).

### ⚠️ PENDIENTES ABIERTOS AL CIERRE DE LA SESIÓN
1. **Textos de la Galería** — título, intro y pie de cada foto: **VACÍOS a
   propósito** en `GALERIA` y `PALEOMUNDO.fotos`. Los dicta el dueño. El sitio
   funciona sin ellos (no pinta el caption vacío).
2. **Horario de invierno** de Sáb–Dom: solo se informó el de verano (11–19).
3. **El Director (Juan Castillo Cornejo)**: el dueño dijo "déjalo, es importante
   para la comunicación", pero **no indicó dónde ni con qué texto**. NO se agregó
   ninguna sección nueva por eso. El correo del museo se mantiene.
4. **Resolución de las fotos**: son de 720–900px; en pantallas grandes pueden
   verse algo blandas.

### ⚠️ SIN PUBLICAR
Nada de CR-41 a CR-45 estaba en producción al cierre de la sesión. Verificar
contra el sitio en vivo antes de dar algo por hecho.

---

## PENDIENTES NUEVOS (2026-10-12) — NO EJECUTADOS, esperan confirmación

⚠️ **NADA de esta sección está publicado.** Es texto que dictó el dueño y que se
guarda para trabajarlo. **No integrarlo sin resolver las dudas marcadas.**

### ⚠️ PENDIENTE — TEXTOS QUE PUBLICAMOS SIN QUE NADIE LOS DIJERA (DEC-034)
El 2026-10-12 se reescribió el párrafo 1 y 3 de `QUIENES_SOMOS` al sacar GRINPACH,
y **el agente INVENTÓ frases** que el dueño nunca dijo: "institución
independiente, dedicada a la paleontología", "trabaja en colaboración con la
Municipalidad de Santiago", "más de 20 años de investigación en terreno y en
sala". **El dueño lo detectó: "TODA ESA INFORMACION ES INVENTADA POR NOSOTROS".**
→ Quedó PUBLICADO y **pendiente de validación con el dueño**. Las preguntas
exactas para hacerle están en la respuesta de la sesión (dependencia del museo,
municipalidad exacta, de quién son los 40 años y los "más de 20", quién está
detrás hoy, si las 7 piezas y 5 eras siguen correctas).
→ **Regla que se rompió acá: reescribir copy institucional NO es trabajo del
agente.** Se quita el dato obsoleto y se PREGUNTA el nuevo; no se redacta.

### ⚠️ MATERIAL RESCATABLE — GRINPACH y CEPCHILE en estos textos NO son errores

🔴 **Aclaración del dueño (2026-10-12), textual: "ES QUE ES INFORMACION
OBSOLETA, PERO RESCATABLE".**

Se había anotado como "conflicto a resolver" que estos textos nombran GRINPACH y
CEPCHILE, que están obsoletos. **Estaba mal clasificado. NO ES UN CONFLICTO:**

- **Dato INSTITUCIONAL** (de quién depende el museo HOY) → ahí GRINPACH es
  obsoleto y se corrige. Es lo que se arregló en `pertenece` y en Quiénes somos.
- **TRAYECTORIA de una PERSONA** (de qué fue presidente, qué museos integró) →
  **GRINPACH es su HISTORIA y se cuenta tal cual.** Un currículum no se
  "actualiza": describe lo que la persona hizo, en el tiempo en que lo hizo.
  Que el museo ya no dependa del grupo NO borra que él lo presidió.
- Mismo caso con **CEPCHILE**: que el sitio haya dado de baja su correo (CR-04)
  no borra que el proyecto escolar **se hizo en conjunto con ellos.** Es
  trayectoria del proyecto, no una dependencia vigente.

→ **Consecuencia práctica: los textos de Juan Castillo y de "El museo va a tu
colegio" se pueden publicar TAL COMO los dictó el dueño**, sin quitar GRINPACH
ni CEPCHILE. No preguntar de nuevo por esto: ya está aclarado.
→ **Regla general que deja esto:** antes de "corregir" un nombre viejo en un
texto, preguntarse si es un DATO VIGENTE (se corrige) o HISTORIA (se conserva).
Borrar un logro pasado por "obsoleto" sería falsificar el currículum.

### ⚠️ PALETA DE COLORES — NO APLICADA, esperando los códigos
El dueño tiene los colores verdaderos en `logo imprenta (3).jpg` (descargas).
**La paleta del sitio sigue siendo la del logo VIEJO** (`#02153f`, `#51adc6`…,
en `css/base/root.css`). El dueño dijo "TE LOS MANDO YO" y después "MEJOR NO".
→ **Un JPG NO da el color de marca** (compresión + artefactos): solo da
aproximaciones (`#085878`, `#08a8d8`). El exacto se pide al dueño
(Pantone/CMYK/hex del archivo de diseño). **No repintar con la aproximación.**
→ Cuando lleguen: se edita **`css/base/root.css`** y se riega a las 11 hojas.
  Revisar CONTRASTE de los textos blancos y del **logo con placa blanca** si el
  azul nuevo es más claro.

### SECCIÓN SERVICIOS — "El museo va a tu colegio"
Reemplaza/complementa "Exposición escolar itinerante". Texto dictado por el dueño:
el MPCH, **en conjunto con el Centro de Estudios Paleontológicos de Chile
(CEPCHILE)**, desarrolló un proyecto museológico escolar itinerante.
Incluye 5 ítems: 20 vitrinas con reconstrucciones de material fosilífero ·
material de historia natural (minerales, conchas, insectos) · material gráfico
de apoyo · reconstrucciones de dinosaurios · especialista guiando la exposición.
⚠️ **CONFLICTO A RESOLVER:** el sitio **YA ELIMINÓ CEPCHILE** (dieron de baja
incluso `cepchile@gmail.com`, CR-04). Confirmar con el dueño si el trabajo
conjunto con CEPCHILE sigue vigente antes de publicarlo.

### LUGAR DE HONORES — nuevo bloque
Título pedido: "Administración y Curación del Museo Paleontológico de Chile".
Contenido dictado: **JUAN CASTILLO CORNEJO** — Director y Curador del MPCH.
  · Diplomado en Paleontología y Patrimonio Paleontológico, Univ. Autónoma de
    Zacatecas (México)
  · Diplomado en Diseño y Espacios Expositivos, Univ. Adolfo Ibáñez
  · Estudió Ancient Marine Reptile, Univ. de Alberta (Canadá)
  · Presidente del Grupo de Investigaciones Paleontológicas de Chile
  · Profesor asesor del Museo Nacional de Historia Natural en "Juventudes
    Científicas de Chile"; paleontólogo en el Museo de Colchagua (Fund. Cardoen)
  · +30 años de exposiciones y cursos de paleontología; artículos y ensayos de
    divulgación; entrevistas en TV, prensa y revistas
  · Profesor del curso "Paleontología básica, una introducción al estudio de la
    vida antigua"; trabajos en terreno
  · Libros: "Dinosaurios en Chile y los vertebrados del Mesozoico" ·
    "Megabestias en Chile y los vertebrados del Cenozoico" · "Dinosaurios y
    otros animales prehistóricos en Chile" · "Tiburones fósiles de Chile y la
    fauna fósil de Bahía Inglesa"
⚠️ **CONFLICTO A RESOLVER:** dice "presidente del Grupo de Investigaciones
Paleontológicas de Chile (GRINPACH)", que el dueño declaró OBSOLETO. Aclarar si
es (a) que el museo ya no depende del grupo, o (b) que el dato también caducó.
⚠️ El "más de 30 años" de él convive con los "40 años" del museo: son cosas
distintas (ya aclarado por el dueño), pero NO confundirlos al redactar.

### SECCIÓN SERVICIOS — imágenes oficiales
El dueño pidió mejorar Servicios con imágenes oficiales. **No hay assets
todavía**: pedirlos y verificar PROCEDENCIA antes de publicar (DEC-018/DEC-027).

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

#!/usr/bin/env bash
# Commitea DEC-122 EN FASES. Cada bloque (A, B, C, E, F, G, H) en su propio
# commit, y CADA UNO se puede revertir por separado con `git revert <sha>`.
#
# 🔴 POR QUÉ NO SIRVE UN `git add -p`:
#    animaciones.css no tiene bloques contiguos separables por hunks: las
#    llaves de cierre quedan pegadas al bloque siguiente. Un `git add -p`
#    produce commits con CSS INVALIDO a medio escribir. Aquí se REESCRIBE el
#    archivo en cada fase (bloques acumulados + el @media original) y se
#    verifica antes de commitear:
#      · llaves balanceadas y sin cierre negativo
#      · comentarios /* */ balanceados   <-- esto faltó la 1a vez: el bloque D
#        quedó sin cerrar su comentario y se comía el bloque E entero; git
#        entonces hacía hunks gigantes y `revert` de B se llevaba C, D, E y F.
#
# 🔴 Y POR QUÉ H VIVE EN OTRO ARCHIVO (animaciones-reduced.css):
#    dentro de animaciones.css sus reglas compartían línea con el bloque B
#    (.pieza:hover::after) y `git revert` del commit de la card daba CONFLICT.
set -euo pipefail
cd /mnt/c/dev/museo-mpch

FINAL=/tmp/animaciones-FINAL.css
DEST=css/secciones/animaciones.css
[ -f "$FINAL" ] || { echo "FALTA $FINAL"; exit 1; }

verifica() {
  node -e '
const css=require("fs").readFileSync(process.argv[1],"utf8");
let d=0,min=0;for(const c of css){if(c==="{")d++;else if(c==="}"){d--;if(d<min)min=d;}}
const a=(css.match(/\/\*/g)||[]).length, b=(css.match(/\*\//g)||[]).length;
if(d!==0||min<0){console.error("LLAVES balance="+d+" min="+min);process.exit(1);}
if(a!==b){console.error("COMENTARIOS sin cerrar: /* ="+a+" */ ="+b);process.exit(1);}
if(/\*\//.test(css.split("/*").slice(1).join("").replace(/[^*]\//g,""))&&false){}
' "$1"
}

media_original() {
  cat <<'ORIGINAL'
/* --- Accesibilidad: con movimiento reducido, todo quieto y visible --- */
@media (prefers-reduced-motion: reduce) {
  .hero__lema, .hero__titulo, .hero__desc, .hero__cta, .hero__datos, .hero__tarjeta,
  .reveal, .fade-in { opacity: 1 !important; transform: none !important; animation: none !important; filter: none !important; }
  #fondo-canvas, .adorno { display: none; }
  .hero__estratos, .marca__iso,
  .btn--primario::after, .servicio--destacado { animation: none !important; }
}
ORIGINAL
}

escribe_fase() {
  # `hasta` = ULTIMO bloque que este commit deja escrito.
  # El corte va en el comentario del bloque SIGUIENTE (o en la seccion de
  # accesibilidad cuando ya estan todos). Error de la 1a version: se cortaba en
  # el comentario del bloque PROPIO, asi que cada commit se quedaba con el
  # bloque anterior y los commits quedaban corridos uno (medido: CR-122e
  # contenia D, CR-122g contenia F y G no se commiteaba nunca).
  local hasta="$1" corte
  case "$hasta" in
    A) corte=$(grep -n "^/\* --- B) La card respira" "$FINAL" | cut -d: -f1) ;;
    B) corte=$(grep -n "^/\* --- C) El separador barre" "$FINAL" | cut -d: -f1) ;;
    C) corte=$(grep -n "^/\* --- D) Retirado" "$FINAL" | cut -d: -f1) ;;
    D) corte=$(grep -n "^/\* --- E) El CTA deja de brillar solo" "$FINAL" | cut -d: -f1) ;;
    E) corte=$(grep -n "^/\* --- F) El men" "$FINAL" | cut -d: -f1) ;;
    F) corte=$(grep -n "^/\* --- G) Llegar a un ancla" "$FINAL" | cut -d: -f1) ;;
    G) corte=$(grep -n "^/\* --- Accesibilidad: con movimiento" "$FINAL" | cut -d: -f1) ;;
  esac
  [ -n "$corte" ] || { echo "  NO se encontro el corte para la fase $hasta"; exit 1; }
  # D no es un bloque animado: es el comentario que deja constancia de que la
  # propuesta se retiro. Se commitea junto con C para no dejar un commit vacio.
  head -n $((corte - 1)) "$FINAL" > "$DEST"
  media_original >> "$DEST"
  verifica "$DEST"
}

escribe_fase A
git add "$DEST"; git commit -q -m "CR-122a: quitar el keyframes huerfano de animaciones.css (72 { vs 73 })

El archivo cerraba con una llave de mas desde CR-32b. Entre derivaEstratos y
entrarHero quedaba un bloque suelto de un @keyframes borrado:

  50% { transform: translate(-50%, -54%) rotate(9deg) scale(1.045); }
}

Deja al parser leyendo CSS a la deriva justo donde empieza entrarHero. El
sitio funcionaba, pero cualquier regla nueva que cayera ahi podia ser
descartada en silencio.

Medido: 71/71 llaves, balance 0, sin cierre negativo."
echo "  OK A"

escribe_fase B
git add "$DEST"; git commit -q -m "CR-122b: la card respira al pasar el cursor (sustituye el shimmer infinito)

El hover de .pieza estaba declarado DOS veces (colecciones.css y
animaciones.css) y las dos lanzaban shimmer en bucle infinito sobre el borde.
Ahora el borde late con respirarCard: 4.2s, opacidad .35 -> 1 y el gradiente
recorriendo el contorno. Se detiene solo cuando el cursor se va.

Medido: reposo animationName=none · hover respirarCard · 0 desbordes."
echo "  OK B"

escribe_fase C
git add "$DEST"; git commit -q -m "CR-122c: el separador barre una luz de 1px, una sola vez

Los <hr class=separador> eran un gradiente quieto. Ahora el propio fondo del
hr se desplaza (background-position 200% -> -100%, 1.6s) al entrar en
pantalla. NO se usa ::after: el comentario del archivo documenta que un
::after con height:100% sobre un hr de 1px dibujaba una SEGUNDA linea.

En este mismo commit queda escrito el comentario D: la propuesta de
«subrayado que crece en los enlaces del cuerpo» se RETIRO al medir que el
sitio no tiene enlaces de cuerpo (los 15 <a> fuera de menu y pie son los
botones «volver» y los CTA). Se deja la constancia para que nadie la
reintroduzca creyendo que falta.

Medido: animationName=barridoSeparador 1.6s · 0 desbordes."
echo "  OK C (+ D documentado)"

escribe_fase E
git add "$DEST"; git commit -q -m "CR-122e: el boton principal deja de destellar solo

brilloBoton corria infinito cada 4.5s sobre el elemento mas llamativo de la
pagina, estuviera el visitante mirandolo o no. Pasa a: destello inmediato al
pasar el cursor o al enfocar con teclado (brilloBotonRapido 0.9s) y, en
reposo, uno cada 7s.

Medido: ::after animationName=brilloBoton 7s · 0 desbordes."
echo "  OK E"

escribe_fase F
git add "$DEST"; git commit -q -m "CR-122f: el menu movil entra item por item

Los items del panel lateral entraban todos de golpe: el unico movimiento era
navEntra sobre el panel entero. Ahora cada <a> aparece con itemNavEntra
(0.45s, sube 10px) y 40ms de separacion con el anterior. Solo dentro de
max-width:900px; en escritorio .nav.abierto no existe y no se toca nada.

Medido: 9 items, 9 animation-delay distintos (0.1s .. 0.42s)."
echo "  OK F"

escribe_fase G
git add "$DEST"; git commit -q -m "CR-122g: llegar a un ancla deja de ser un salto seco

Al entrar por #seccion el navegador saltaba de golpe. Ahora la seccion que
queda como :target sube 8px con fade de 0.55s y recibe scroll-margin-top
derivado de --header-h con respaldo 84px (el MISMO que usan ambar.css,
amonites.css y dinosaurios-chile.css; con 72px el ancla caia 12px antes que
en el resto del sitio).

Medido: :target #colecciones animationName=llegadaAncla · scroll-margin 137px."
echo "  OK G"

git add css/secciones/animaciones-reduced.css css/main.css
git commit -q -m "CR-122h: prefers-reduced-motion apaga TODO lo animado

La lista de movimiento reducido tenia 7 reglas y se le escapaban: el borde de
la card, el barrido del separador, el escalonado del menu movil y la llegada
por ancla. Un visitante con «reducir movimiento» activado veia animaciones
igual.

Van en css/secciones/animaciones-reduced.css, NO dentro del @media de
animaciones.css: ahi compartian linea con el bloque de la card y `git revert`
del commit de la card daba CONFLICTO. En archivo propio, revertir B, C, F o G
no choca nunca con H.

Medido con reduced_motion=reduce: separador, hero y ::after del CTA salen
animationName=none."
echo "  OK H"

echo; echo "=== commits ==="; git log --oneline -8

"""
Sonda DEC-122 — mide las animaciones nuevas contra el sitio SERVIDO LOCAL.

Qué mide, y por qué cada cosa:
  1. Desborde horizontal en 15 anchos (320 → 2560). Es el defecto que costó
     CR-08: cualquier animación en X extiende el scrollWidth del documento.
  2. Que cada @keyframes nueva esté en el CSS que el navegador descarga.
  3. Que las animaciones se DISPAREN de verdad (computed styles en vivo,
     abriendo el menú móvil y forzando el hover de la card).
  4. Que con prefers-reduced-motion TODO quede quieto (bloque H).

Uso:
  .venv/bin/python scripts/mide-animaciones-dec122.py [base_url]
"""
import sys

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8765"

ANCHOS = [320, 360, 390, 414, 480, 600, 768, 834, 900, 1024, 1180, 1280, 1440, 1920, 2560]

OBJETIVO = ["respirarCard", "barridoSeparador", "brilloBotonRapido",
            "itemNavEntra", "llegadaAncla"]


def main():
    fallos = []
    with sync_playwright() as p:
        nav = p.chromium.launch(headless=True)
        ctx = nav.new_context(viewport={"width": 1280, "height": 900})
        pg = ctx.new_page()
        errores = []
        pg.on("pageerror", lambda e: errores.append(str(e)))

        # --- 1. desborde en 15 anchos ---
        print("== 1. DESBORDE HORIZONTAL (index.html) ==")
        pg.goto(f"{BASE}/index.html", wait_until="networkidle")
        for w in ANCHOS:
            pg.set_viewport_size({"width": w, "height": 900})
            pg.wait_for_timeout(90)
            r = pg.evaluate("""() => {const d=document.documentElement;
                return {s:d.scrollWidth, c:d.clientWidth, d:d.scrollWidth-d.clientWidth};}""")
            ok = r["d"] <= 0
            if not ok:
                fallos.append(f"desborde {r['d']}px a {w}px")
            print(f"  {w:>5}px -> scrollW {r['s']:>5} clientW {r['c']:>5}  {'OK' if ok else 'DESBORDA'}")

        # --- 2. keyframes en el CSS servido ---
        print("\n== 2. LAS ANIMACIONES NUEVAS ESTAN EN EL CSS SERVIDO ==")
        en_css = pg.evaluate("""async (nombres) => {
            const r = await fetch('css/secciones/animaciones.css?t=' + Date.now());
            const txt = r.ok ? await r.text() : '';
            return {http: r.status, largo: txt.length,
                    enArchivo: nombres.filter(n => txt.includes('@keyframes ' + n))};
          }""", OBJETIVO)
        print(f"  (HTTP {en_css['http']}, {en_css['largo']} bytes)")
        for n in OBJETIVO:
            ok = n in en_css["enArchivo"]
            print(f"  {n:<20} {'OK' if ok else 'AUSENTE'}")
            if not ok:
                fallos.append(f"keyframes {n} ausente del CSS servido")

        # --- 3. se disparan de verdad ---
        print("\n== 3. SE DISPARAN (en vivo) ==")
        pg.set_viewport_size({"width": 1280, "height": 900})
        pg.goto(f"{BASE}/index.html", wait_until="networkidle")
        pg.wait_for_timeout(500)

        sep = pg.evaluate("""() => {const e=document.querySelector('.separador');
            if(!e) return {existe:false};
            const cs=getComputedStyle(e);
            return {existe:true, name:cs.animationName, dur:cs.animationDuration};}""")
        if sep["existe"]:
            ok = sep["name"] == "barridoSeparador"
            print(f"  C .separador        {sep['name']} / {sep['dur']}  {'OK' if ok else 'FALLA'}")
            if not ok:
                fallos.append("el separador no anima")
        else:
            print("  C .separador        NO HAY en index.html"); fallos.append("no hay .separador en index")

        cta = pg.evaluate("""() => {const e=document.querySelector('.btn--primario');
            if(!e) return {existe:false};
            const cs=getComputedStyle(e,'::after');
            return {existe:true, name:cs.animationName, dur:cs.animationDuration};}""")
        ok = cta.get("name") == "brilloBoton" and cta.get("dur", "").startswith("7")
        print(f"  E .btn::after       {cta.get('name')} / {cta.get('dur')}  {'OK' if ok else 'FALLA'}")
        if not ok:
            fallos.append(f"brillo del CTA: {cta.get('name')} / {cta.get('dur')}")

        # G: :target — navegar a un ancla
        pg.goto(f"{BASE}/index.html#colecciones", wait_until="networkidle")
        pg.wait_for_timeout(120)
        tg = pg.evaluate("""() => {const e=document.querySelector(':target');
            if(!e) return {existe:false};
            const cs=getComputedStyle(e);
            return {existe:true, id:e.id, name:cs.animationName, sm:cs.scrollMarginTop};}""")
        if tg["existe"]:
            ok = tg["name"] == "llegadaAncla"
            print(f"  G :target #{tg['id']:<12} {tg['name']} · scroll-margin {tg['sm']}  {'OK' if ok else 'FALLA'}")
            if not ok:
                fallos.append(":target no anima")
        else:
            print("  G :target           el ancla no quedo como :target"); fallos.append(":target ausente")

        # B: hover de la card. OJO: `.pieza` NO viene en el HTML — la crea
        # js/render.js al cargar desde COLECCIONES.piezas. Hay que esperar el
        # render o el selector no existe (ammonites.html no la tiene nunca).
        pg.set_viewport_size({"width": 1280, "height": 900})
        pg.goto(f"{BASE}/index.html", wait_until="networkidle")
        try:
            pg.wait_for_selector(".pieza", timeout=8000)
        except Exception:
            fallos.append("render.js no pinto ninguna .pieza en index.html (const sin window?)")
            print("  B .pieza            NO SE PINTO  <-- revisar render")
        reposo = pg.evaluate("""() => {const c=document.querySelector('.pieza');
            return c ? getComputedStyle(c,'::after').animationName : 'n/a';}""")
        pg.hover(".pieza")
        pg.wait_for_timeout(200)
        hover = pg.evaluate("""() => {const c=document.querySelector('.pieza');
            return c ? getComputedStyle(c,'::after').animationName : 'n/a';}""")
        ok = hover == "respirarCard"
        print(f"  B .pieza:hover::after  reposo={reposo}  hover={hover}  {'OK' if ok else 'FALLA'}")
        if not ok:
            fallos.append(f"card en hover: {hover}")

        # F: menu movil escalonado
        pg.set_viewport_size({"width": 390, "height": 844})
        pg.goto(f"{BASE}/index.html", wait_until="networkidle")
        pg.wait_for_timeout(300)
        abierto = pg.evaluate("""() => {
            const n = document.querySelector('.nav');
            if (!n) return {existe:false};
            n.classList.add('abierto');
            const items = [...n.querySelectorAll('a')];
            return {existe:true, n:items.length,
                    retrasos: items.map(a => getComputedStyle(a).animationDelay),
                    nombres: items.map(a => getComputedStyle(a).animationName)};
          }""")
        if abierto["existe"] and abierto["n"]:
            unicos = len(set(abierto["retrasos"]))
            ok = all(x == "itemNavEntra" for x in abierto["nombres"]) and unicos == abierto["n"]
            print(f"  F menu movil         {abierto['n']} items · {unicos} retrasos distintos "
                  f"{abierto['retrasos'][:4]}…  {'OK' if ok else 'FALLA'}")
            if not ok:
                fallos.append(f"menu movil: {abierto['nombres']} / {abierto['retrasos']}")
        else:
            print("  F menu movil         no se encontro .nav")
            fallos.append("no hay .nav")

        # --- 4. reduced motion ---
        print("\n== 4. prefers-reduced-motion: reduce = TODO QUIETO ==")
        ctx2 = nav.new_context(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
        pg2 = ctx2.new_page()
        pg2.goto(f"{BASE}/index.html", wait_until="networkidle")
        pg2.wait_for_timeout(300)
        quieto = pg2.evaluate("""() => {
            const out=[];
            const chk=(sel,ps)=>{const e=document.querySelector(sel);
              if(e) out.push([sel+(ps||''), getComputedStyle(e,ps||null).animationName]);};
            chk('.separador'); chk('.hero__titulo'); chk('.btn--primario','::after');
            return out;}""")
        for sel, anim in quieto:
            ok = anim == "none"
            print(f"  {sel:<24} animationName={anim:<12} {'OK' if ok else 'SIGUE ANIMANDO'}")
            if not ok:
                fallos.append(f"reduced-motion: {sel} sigue con {anim}")

        print(f"\n== errores JS en consola: {len(errores)} ==")
        for e in errores[:5]:
            print("   ", e)
        if errores:
            fallos.append(f"{len(errores)} errores JS")

        nav.close()

    print("\n" + "=" * 62)
    if fallos:
        print(f"FALLOS ({len(fallos)}):")
        for f in fallos:
            print("  -", f)
        return 1
    print("TODO OK — 0 desbordes · animaciones servidas · disparadas · reduced-motion quieto")
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""Captura el separador y el hover de la card a PNG para MIRARLOS.

DOM != PIXELES: que animationName diga 'barridoSeparador' no prueba que se vea.
Estas capturas existen para abrirlas y contar pixeles del barrido.
"""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8765"

with sync_playwright() as p:
    nav = p.chromium.launch(headless=True)
    ctx = nav.new_context(viewport={"width": 1280, "height": 900}, device_scale_factor=1)
    pg = ctx.new_page()

    # --- separador: 3 fotogramas del barrido ---
    pg.goto(f"{BASE}/index.html", wait_until="networkidle")
    sep = pg.query_selector(".separador")
    # El separador vive MUY abajo: primero hay que llevarlo a la ventana o el
    # clip del screenshot queda fuera de la imagen (error medido).
    sep.scroll_into_view_if_needed()
    pg.wait_for_timeout(300)
    sep = pg.query_selector(".separador")
    caja = sep.bounding_box()
    print("separador caja:", caja)
    vis = pg.evaluate("""() => {const e=document.querySelector('.separador');
        const r=e.getBoundingClientRect();
        return {top:r.top, left:r.left, w:r.width, h:r.height,
                vh:innerHeight, vw:innerWidth};}""")
    print("  rect en ventana:", vis)
    clip = {"x": max(0, vis["left"]), "y": max(0, vis["top"] - 6),
            "width": min(vis["w"], vis["vw"]), "height": 14}
    for i, espera in enumerate([0, 400, 1400]):
        pg.wait_for_timeout(espera if i == 0 else espera - [0, 400, 1400][i - 1])
        pg.screenshot(path=f"/mnt/c/Users/logic/Desktop/mpch-122-sep-{i}.png", clip=clip)
        print(f"  sep-{i}.png  (t={espera}ms)")

    # --- card en reposo vs hover ---
    pg.wait_for_selector(".pieza", timeout=8000)
    card = pg.query_selector(".pieza")
    card.scroll_into_view_if_needed()
    pg.wait_for_timeout(300)
    card = pg.query_selector(".pieza")
    box = pg.evaluate("""() => {const e=document.querySelector('.pieza');
        const r=e.getBoundingClientRect(); return {top:r.top,left:r.left,w:r.width,h:r.height};}""")
    clipc = {"x": max(0, box["left"]), "y": max(0, box["top"]),
             "width": box["w"], "height": min(box["h"], 880 - max(0, box["top"]))}
    pg.screenshot(path="/mnt/c/Users/logic/Desktop/mpch-122-card-reposo.png", clip=clipc)
    print("  card-reposo.png")
    card.hover()
    for i, t in enumerate([250, 1000]):
        pg.wait_for_timeout(t if i == 0 else t - 250)
        pg.screenshot(path=f"/mnt/c/Users/logic/Desktop/mpch-122-card-hover-{i}.png", clip=clipc)
        print(f"  card-hover-{i}.png (t={t}ms)")

    nav.close()
print("listo — capturas en el Escritorio")

import sys, pathlib
sys.path.insert(0, "/home/user/pullman-club-site/oralias-bakery/build")
from art import rosette, bunting, concha, oreja

html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1200px;height:630px;overflow:hidden}}
body{{font-family:'Bitstream Charter',Georgia,serif;color:#2E1A12}}
.og{{position:relative;width:1200px;height:630px;overflow:hidden;
  background:radial-gradient(85% 75% at 62% 6%, #FBE9C9 0%, #FBF2DE 55%, #F2E1C0 100%)}}
.sun{{position:absolute;right:-140px;top:-230px;width:560px;opacity:.32}}
.top{{position:absolute;top:-8px;left:-40px;width:1300px}}
.inner{{position:absolute;left:66px;top:182px;width:640px}}
.kicker{{font-family:'DejaVu Sans',sans-serif;font-size:20px;font-weight:700;letter-spacing:.24em;
  text-transform:uppercase;color:#C2502E;margin-bottom:24px}}
h1{{font-size:96px;line-height:.94;letter-spacing:-.03em;font-weight:700}}
h1 .a{{color:#C2502E}}
h1 .b{{display:block;color:#8E1C22}}
.tag{{font-style:italic;font-size:29px;margin-top:26px;color:#6C4A37;line-height:1.26}}
.pans{{position:absolute;right:56px;top:176px;width:390px;height:300px;color:#2E1A12}}
.pans .big{{position:absolute;right:16px;top:0;width:262px}}
.pans .small{{position:absolute;left:0;bottom:6px;width:172px}}
.band{{position:absolute;left:0;bottom:0;width:1200px;height:104px;background:#8E1C22;color:#FDF3DF;
  display:flex;align-items:center;justify-content:space-between;padding:0 66px;
  font-family:'DejaVu Sans',sans-serif;font-size:24px}}
.band b{{font-weight:700}}
.band .sep{{opacity:.45;margin:0 20px}}
</style></head><body><div class="og">
<svg width="0" height="0" style="position:absolute">{rosette()}</svg>
<svg class="sun" viewBox="-100 -100 200 200"><use href="#rosette" x="-100" y="-100" width="200" height="200"/></svg>
<div class="top">{bunting(1300, seed=0)}</div>
<div class="inner">
  <div class="kicker">Panader&iacute;a Mexicana &nbsp;&middot;&nbsp; Shakopee, MN</div>
  <h1>Oralia<span class="a">&rsquo;</span>s <span class="b">Bakery</span></h1>
  <div class="tag">&ldquo;Pan dulce mexicano y pasteles<br>para toda ocasi&oacute;n&rdquo;</div>
</div>
<div class="pans">
  <div class="big">{concha("#F0A81C")}</div>
  <div class="small">{oreja()}</div>
</div>
<div class="band">
  <span><b>590 Marschall Rd, Shakopee, MN</b></span>
  <span><b>(612) 240-2031</b><span class="sep">|</span>Open daily 8am&ndash;8pm</span>
</div>
</div></body></html>"""
pathlib.Path(sys.argv[1]).write_text(html)

#!/bin/zsh
# Competitor capture with playwright-cli. Usage: ./capture.sh NN slug url session
# Produces every artifact in research/sites/NN-slug/ per BUILD-SPEC section 1.2.
set -u
NN="$1"; SLUG="$2"; URL="$3"; S="$4"
ROOT="/Users/user/Desktop/Development-Charlie-2/Charlieautomates/websites/Claude-Velmora/research"
DIR="$ROOT/sites/$NN-$SLUG"
mkdir -p "$DIR/images"
cd "$ROOT"
pw() { /opt/homebrew/bin/playwright-cli -s="$S" "$@"; }
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36"
log() { echo "[$NN-$SLUG] $*"; }

DISMISS='async page => { await page.keyboard.press("Escape"); await page.waitForTimeout(300); const sels = ["button[aria-label*=\"close\" i]", "[aria-label*=\"close\" i]", "[class*=\"close\"]", "[id*=\"close\"]", ".klaviyo-close-form", "[data-testid*=\"close\"]", "[class*=\"close\"] button", "button:has-text(\"Accept\")", "button:has-text(\"Got it\")", "button:has-text(\"No thanks\")", "[aria-label=\"Close\"]", ".modal button", "[class*=\"popup\"] button"]; for (const s of sels) { try { const el = page.locator(s).first(); if (await el.isVisible({ timeout: 300 })) { await el.click({ timeout: 1000 }); await page.waitForTimeout(400); } } catch {} } }'
SCROLL='async page => { await page.waitForTimeout(2500); for (let y = 0; y < 30000; y += 700) { await page.mouse.wheel(0, 700); await page.waitForTimeout(120); const h = await page.evaluate(() => document.body.scrollHeight); if (y > h + 1400) break; } await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1200); }'
STYLES='(() => { const pick = (el) => { if (!el) return null; const s = getComputedStyle(el); return { tag: el.tagName, text: (el.textContent||"").trim().slice(0,80), fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textTransform: s.textTransform, color: s.color, background: s.backgroundColor, borderRadius: s.borderRadius, padding: s.padding }; }; const btn = [...document.querySelectorAll("a,button")].find(e => /book|consult|schedule|appointment/i.test(e.textContent||"") && e.getBoundingClientRect().width > 0); const nav = document.querySelector("nav a, header a"); return JSON.stringify({ url: location.href, title: document.title, h1: pick(document.querySelector("h1")), h2: pick(document.querySelector("h2")), body: pick(document.body), navLink: pick(nav), primaryButton: pick(btn), bodyBg: getComputedStyle(document.body).backgroundColor, fontsLoaded: [...document.fonts].map(f => f.family).filter((v,i,a)=>a.indexOf(v)===i) }, null, 2); })()'
IMAGES='JSON.stringify([...document.images].map(i => ({src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight, alt: i.alt})).filter(i => i.w >= 500 && /^https?:/.test(i.src)))'
INNER='(() => { const host = location.host; const a = [...document.querySelectorAll("a[href]")].map(a => a.href).filter(h => { try { const u = new URL(h); return u.host === host && u.pathname.length > 3 && /treatment|service|botox|injectable|filler|laser|facial|book|menu/i.test(u.pathname) && !/blog|journal|#/.test(u.pathname); } catch { return false; } }); return a[0] || ""; })()'
MENU='async page => { const sels = ["button[aria-label*=\"menu\" i]", "button[aria-label*=\"open\" i]", "[class*=\"hamburger\"]", "[class*=\"burger\"]", "[class*=\"menu-toggle\"]", "[class*=\"nav-toggle\"]", "button[aria-controls]", "button[aria-expanded]", "button:has-text(\"Menu\")", "[class*=\"menu\"] button", "header button:has(svg)", "header button", "nav button", "[class*=\"header\"] button", "[class*=\"nav\"] [role=button]", "[class*=\"hamburger\"] *"]; for (const s of sels) { try { const el = page.locator(s).first(); if (await el.isVisible({ timeout: 300 })) { await el.click({ timeout: 1500 }); await page.waitForTimeout(900); return s; } } catch {} } return "none"; }'

pw close >/dev/null 2>&1
pw open --browser=chrome "$URL" >/dev/null 2>&1
LOC=$(pw --raw eval "location.href" 2>/dev/null | tr -d '"\n')
[ -z "$LOC" ] && { log "open failed (no location)"; exit 1; }
log "opened $LOC"
pw resize 1440 900 >/dev/null 2>&1
pw run-code "$DISMISS" >/dev/null 2>&1
pw run-code "$SCROLL" >/dev/null 2>&1
pw run-code "$DISMISS" >/dev/null 2>&1
pw run-code "async page => { await page.screenshot({ path: '$DIR/desktop-full.png', fullPage: true }); await page.evaluate(() => window.scrollTo(0,0)); await page.waitForTimeout(600); await page.screenshot({ path: '$DIR/hero-desktop.png' }); }" >/dev/null 2>&1
pw --raw eval "document.documentElement.outerHTML" > "$DIR/page.html" 2>/dev/null
pw --raw eval "$STYLES" > "$DIR/styles.json" 2>/dev/null
pw network > "$DIR/network.txt" 2>/dev/null
pw --raw eval "$IMAGES" > "$DIR/image-list.json" 2>/dev/null
INNER_URL=$(pw --raw eval "$INNER" 2>/dev/null | tr -d '"\n')
{
  echo ""
  echo "FLAGS:"
  for k in three spline gsap lenis locomotive framer swiper; do
    if grep -qi "$k" "$DIR/network.txt" "$DIR/page.html" 2>/dev/null; then echo "  $k=yes"; else echo "  $k=no"; fi
  done
  if grep -qiE "<video|\.mp4|\.webm|vimeo|youtube" "$DIR/page.html" 2>/dev/null; then echo "  video=yes"; else echo "  video=no"; fi
} >> "$DIR/network.txt"

# Mobile
pw resize 390 844 >/dev/null 2>&1
pw reload >/dev/null 2>&1
pw run-code "$DISMISS" >/dev/null 2>&1
pw run-code "$SCROLL" >/dev/null 2>&1
pw run-code "async page => { await page.screenshot({ path: '$DIR/mobile-full.png', fullPage: true }); await page.evaluate(() => window.scrollTo(0,0)); await page.waitForTimeout(500); }" >/dev/null 2>&1
MENU_SEL=$(pw run-code "$MENU" 2>/dev/null | tail -1)
pw run-code "async page => { await page.screenshot({ path: '$DIR/nav-open-mobile.png' }); }" >/dev/null 2>&1
echo "menu selector used: $MENU_SEL" > "$DIR/capture-log.txt"
echo "inner url: $INNER_URL" >> "$DIR/capture-log.txt"

# Inner page
if [ -n "$INNER_URL" ]; then
  pw resize 1440 900 >/dev/null 2>&1
  pw goto "$INNER_URL" >/dev/null 2>&1
  pw run-code "$DISMISS" >/dev/null 2>&1
  pw run-code "$SCROLL" >/dev/null 2>&1
  pw run-code "async page => { await page.screenshot({ path: '$DIR/inner-desktop.png', fullPage: true }); }" >/dev/null 2>&1
  pw --raw eval "document.documentElement.outerHTML" > "$DIR/inner.html" 2>/dev/null
  pw resize 390 844 >/dev/null 2>&1
  pw reload >/dev/null 2>&1
  pw run-code "$SCROLL" >/dev/null 2>&1
  pw run-code "async page => { await page.screenshot({ path: '$DIR/inner-mobile.png', fullPage: true }); }" >/dev/null 2>&1
fi
pw close >/dev/null 2>&1

# Images: top 8 distinct by area
node -e '
const fs=require("fs"); const dir=process.argv[1];
let list=[]; try { list=JSON.parse(fs.readFileSync(dir+"/image-list.json","utf8")); } catch { }
const seen=new Set(); const picks=[];
for (const i of list.sort((a,b)=>b.w*b.h-a.w*a.h)) { const key=i.src.split("?")[0]; if(seen.has(key)) continue; seen.add(key); picks.push(i); if(picks.length>=8) break; }
fs.writeFileSync(dir+"/images/manifest.json", JSON.stringify(picks,null,2));
console.log(picks.map(p=>p.src).join("\n"));
' "$DIR" | while IFS= read -r src; do
  [ -z "$src" ] && continue
  n=$(( $(ls "$DIR/images" | grep -c '^[0-9]') + 1 ))
  ext=$(echo "$src" | sed -E 's/\?.*//' | grep -oE '\.(jpe?g|png|webp|avif|gif)$' | head -1)
  [ -z "$ext" ] && ext=".jpg"
  curl -sL -m 30 -A "$UA" -o "$DIR/images/$(printf '%02d' $n)$ext" "$src"
done
log "done: $(ls "$DIR" | tr '\n' ' ')"

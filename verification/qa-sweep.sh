#!/bin/zsh
export PATH="/Users/user/.hermes/node/bin:/opt/homebrew/bin:$PATH"
# Phase 4 sweep: every route at 1440 and 390 against the production preview.
# Writes verification/screens/{route}-{desktop|mobile}.png, verification/console.txt,
# verification/overflow.txt (horizontal scroll check), verification/status.txt.
BASE="${1:-http://127.0.0.1:4322}"
V="/Users/user/Desktop/Development-Charlie-2/Charlieautomates/websites/Claude-Velmora/verification"
mkdir -p "$V/screens"; : > "$V/console.txt"; : > "$V/overflow.txt"; : > "$V/status.txt"
S=velmora-qa; pw() { /opt/homebrew/bin/playwright-cli -s="$S" "$@"; }
ROUTES=( / /treatments /treatments/neuromodulators /treatments/medical-weight-loss /concerns/lines-wrinkles /concerns/body /results /pricing /membership /about /team/elena-marsh /team/sofia-reyes /quiz /book /book/confirmed /support /support/aftercare/injectables /support/aftercare/laser /support/policies /faq /contact /gift-cards /journal /journal/natural-first-philosophy /privacy /terms /medical-disclaimer /accessibility /styleguide /this-route-does-not-exist )
SCROLL='async page => { await page.waitForTimeout(1200); for (let y = 0; y < 40000; y += 600) { await page.mouse.wheel(0, 600); await page.waitForTimeout(60); const h = await page.evaluate(() => document.documentElement.scrollHeight); if (y > h + 1200) break; } await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(700); }'
cd "$V"
pw close >/dev/null 2>&1; pw open --browser=chrome "$BASE/" >/dev/null 2>&1
# Reduced motion for capture: disables Lenis, GSAP pins and the WebGL canvases so
# full-page stitching is deterministic. Motion and 3D are proven by e2e.sh instead.
pw run-code "async page => { await page.emulateMedia({ reducedMotion: 'reduce' }); }" >/dev/null 2>&1
for r in "${ROUTES[@]}"; do
  slug=$(echo "$r" | sed 's|^/||; s|/|_|g'); [ -z "$slug" ] && slug=home
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$r"); echo "$code $r" >> "$V/status.txt"
  for vp in "1440 900 desktop" "390 844 mobile"; do
    set -- ${=vp}
    pw resize $1 $2 >/dev/null 2>&1
    pw goto "$BASE$r" >/dev/null 2>&1
    pw run-code "$SCROLL" >/dev/null 2>&1
    pw run-code "async page => { await page.screenshot({ path: '$V/screens/$slug-$3.png', fullPage: true }); }" >/dev/null 2>&1
    ov=$(pw --raw eval "JSON.stringify({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, over: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0,3).map(e => e.tagName + '.' + String(e.className).split(' ').slice(0,2).join('.'))})" 2>/dev/null | tr -d '\n')
    echo "$r [$3] $ov" >> "$V/overflow.txt"
  done
  pw console 2>/dev/null | grep -iE "error" | grep -vE "favicon|Total messages" | sed "s|^|$r: |" >> "$V/console.txt"
done
pw close >/dev/null 2>&1
echo "SWEEP DONE"; wc -l "$V/status.txt" "$V/console.txt"; grep -c '"sw"' "$V/overflow.txt"

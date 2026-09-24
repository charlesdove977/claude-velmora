#!/bin/zsh
# Inner-page capture + image download for a site folder. Usage: ./inner.sh DIRNAME INNER_URL SESSION
DIRN="$1"; INNER_URL="$2"; S="$3"
R="/Users/user/Desktop/Development-Charlie-2/Charlieautomates/websites/Claude-Velmora/research"; DIR="$R/sites/$DIRN"; cd "$R"
pw() { /opt/homebrew/bin/playwright-cli -s="$S" "$@"; }
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36"
SCROLL='async page => { await page.waitForTimeout(2500); for (let y = 0; y < 30000; y += 700) { await page.mouse.wheel(0, 700); await page.waitForTimeout(120); const h = await page.evaluate(() => document.body.scrollHeight); if (y > h + 1400) break; } await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1200); }'
if [ -n "$INNER_URL" ]; then
  pw close >/dev/null 2>&1; pw open --browser=chrome "$INNER_URL" >/dev/null 2>&1; pw resize 1440 900 >/dev/null 2>&1
  pw run-code "$SCROLL" >/dev/null 2>&1
  pw run-code "async page => { await page.screenshot({ path: '$DIR/inner-desktop.png', fullPage: true }); }" >/dev/null 2>&1
  pw --raw eval "document.documentElement.outerHTML" > "$DIR/inner.html" 2>/dev/null
  pw resize 390 844 >/dev/null 2>&1; pw reload >/dev/null 2>&1; pw run-code "$SCROLL" >/dev/null 2>&1
  pw run-code "async page => { await page.screenshot({ path: '$DIR/inner-mobile.png', fullPage: true }); }" >/dev/null 2>&1
  pw close >/dev/null 2>&1
  echo "inner url: $INNER_URL" >> "$DIR/capture-log.txt"
fi
# images
mkdir -p "$DIR/images"
node -e '
const fs=require("fs"); const dir=process.argv[1];
let list=[]; try { list=JSON.parse(fs.readFileSync(dir+"/image-list.json","utf8")); if(typeof list==="string") list=JSON.parse(list);} catch {}
const seen=new Set(); const picks=[];
for (const i of list.sort((a,b)=>b.w*b.h-a.w*a.h)) { const key=i.src.split("?")[0]; if(seen.has(key)||/\.svg$/i.test(key)) continue; seen.add(key); picks.push(i); if(picks.length>=8) break; }
fs.writeFileSync(dir+"/images/manifest.json", JSON.stringify(picks,null,2));
process.stdout.write(picks.map(p=>p.src).join("\n"));
' "$DIR" | while IFS= read -r src; do
  [ -z "$src" ] && continue
  n=$(( $(ls "$DIR/images" | grep -c '^[0-9]') + 1 ))
  ext=$(echo "$src" | sed -E 's/\?.*//' | grep -oE '\.(jpe?g|png|webp|avif|gif)$' | head -1); [ -z "$ext" ] && ext=".jpg"
  curl -sL -m 30 -A "$UA" -o "$DIR/images/$(printf '%02d' $n)$ext" "$src"
done
echo "[$DIRN] images=$(ls "$DIR/images" | grep -c '^[0-9]')"

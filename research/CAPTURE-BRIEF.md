# Competitor capture brief (for capture agents)

Research root: /Users/user/Desktop/Development-Charlie-2/Charlieautomates/websites/Claude-Velmora/research
Tool: playwright-cli (global binary at /opt/homebrew/bin/playwright-cli). Use ONLY playwright-cli. Never the Chrome extension. Never screenshots from memory.
Always pass your assigned session name with -s=<session> on EVERY command so parallel agents never collide. Example: playwright-cli -s=site01 open https://...
Run every command from the research root so .playwright-cli/ relative outputs land in one place; move files into the site folder with absolute paths.
If a page blocks the headless browser (403, Cloudflare), retry with: playwright-cli -s=<session> open --browser=chrome <url>. If it still fails, swap in the backup site and record why in notes.md.

Per site, create folder research/sites/{NN}-{slug}/ and produce ALL of these:

1. desktop-full.png
   playwright-cli -s=S resize 1440 900
   playwright-cli -s=S goto <url>
   dismiss any cookie / popup modal if a snapshot shows one (click its close/accept ref)
   scroll to the bottom in steps so lazy content loads:
   playwright-cli -s=S run-code "async page => { for (let y = 0; y < 20000; y += 800) { await page.mouse.wheel(0, 800); await page.waitForTimeout(150); } await page.evaluate(() => window.scrollTo(0,0)); await page.waitForTimeout(500); }"
   playwright-cli -s=S run-code "async page => { await page.screenshot({ path: '<ABS site folder>/desktop-full.png', fullPage: true }); }"
2. hero-desktop.png
   playwright-cli -s=S run-code "async page => { await page.evaluate(() => window.scrollTo(0,0)); await page.screenshot({ path: '<ABS>/hero-desktop.png', fullPage: false }); }"
3. page.html (full rendered DOM)
   playwright-cli -s=S --raw eval "document.documentElement.outerHTML" > <ABS>/page.html
4. styles.json (computed styles for h1, h2, body, nav link, primary button)
   playwright-cli -s=S --raw eval "(() => { const pick = (el) => { if (!el) return null; const s = getComputedStyle(el); return { tag: el.tagName, text: (el.textContent||'').trim().slice(0,80), fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textTransform: s.textTransform, color: s.color, background: s.backgroundColor, borderRadius: s.borderRadius, padding: s.padding }; }; const btn = [...document.querySelectorAll('a,button')].find(e => /book|consult|schedule|appointment/i.test(e.textContent||'')); const nav = document.querySelector('nav a, header a'); return JSON.stringify({ url: location.href, title: document.title, h1: pick(document.querySelector('h1')), h2: pick(document.querySelector('h2')), body: pick(document.body), navLink: pick(nav), primaryButton: pick(btn), bodyBg: getComputedStyle(document.body).backgroundColor, fontsLoaded: [...document.fonts].map(f => f.family).filter((v,i,a)=>a.indexOf(v)===i) }, null, 2); })()" > <ABS>/styles.json
5. network.txt
   playwright-cli -s=S network > <ABS>/network.txt
   then append a line "FLAGS: three.js=yes/no spline=yes/no gsap=yes/no lenis=yes/no video=yes/no" by grepping network.txt and page.html for three, spline, gsap, lenis, <video, .mp4, .webm, vimeo, youtube.
6. images/ (5 to 10 representative images, REFERENCE ONLY)
   playwright-cli -s=S --raw eval "JSON.stringify([...document.images].map(i => ({src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight, alt: i.alt})).filter(i => i.w >= 600))" > <ABS>/image-list.json
   pick 5 to 10 distinct hero / treatment / interior images and curl them: curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36" -o <ABS>/images/NN.ext "<src>"
7. mobile-full.png + nav-open-mobile.png
   playwright-cli -s=S resize 390 844
   playwright-cli -s=S reload
   same scroll routine, then full-page screenshot to mobile-full.png
   scroll to top, snapshot, click the hamburger / menu button ref, then run-code screenshot (fullPage false) to nav-open-mobile.png
8. inner page (one treatment page or booking page)
   find a treatment or booking link in the snapshot, goto it at 1440x900, and save inner-desktop.png (full page) + inner-mobile.png (390 full page) + inner.html (outerHTML).
9. notes.md, written by you after LOOKING at your own screenshots (use the Read tool on the png files). Sections, each 2 to 6 bullets:
   ## Hero (layout, media type: photo/video/3D, headline style, CTA count)
   ## Nav (structure, sticky behavior, book CTA in nav?)
   ## Booking CTA placement (hero, nav, sticky bar, footer, per-treatment)
   ## Proof (reviews, credentials, badges, before/after, counts)
   ## Pricing display (transparent from-$, hidden, membership)
   ## Motion (scroll reveals, parallax, video, 3D, smooth scroll libs found in network.txt)
   ## Type + color (from styles.json: families, sizes, palette)
   ## Weaknesses (popups, clutter, slow, generic template, poor mobile nav)
   ## Best element for Velmora (ONE element, why it works, how Velmora could ADAPT it without copying)
10. playwright-cli -s=S close   when the site is fully done.

Hard rules:
- Everything you download stays under research/. Never write into public/ or src/.
- Do not stop to ask questions. If something fails after 2 attempts, note it in notes.md and continue.
- Final reply to the orchestrator: for each site, the folder path, a checklist of which artifacts exist (ls output), one-paragraph summary, and the "Best element for Velmora" verbatim.

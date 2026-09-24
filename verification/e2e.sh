#!/bin/zsh
export PATH="/Users/user/.hermes/node/bin:/opt/homebrew/bin:$PATH"
# Functional proof: booking flow end to end (1440 + 390), forms valid + invalid,
# quiz into /book, reduced-motion poster fallback, mobile menu. Writes
# verification/e2e/*.png and verification/e2e/results.txt.
BASE="${1:-http://127.0.0.1:4322}"
V="/Users/user/Desktop/Development-Charlie-2/Charlieautomates/websites/Claude-Velmora/verification/e2e"
mkdir -p "$V"; R="$V/results.txt"; : > "$R"
S=velmora-e2e; pw() { /opt/homebrew/bin/playwright-cli -s="$S" "$@"; }
ok() { echo "PASS $1" >> "$R"; }; bad() { echo "FAIL $1" >> "$R"; }
cd "$V"
pw close >/dev/null 2>&1; pw open --browser=chrome "$BASE/book" >/dev/null 2>&1

book_flow() {
  local W=$1 H=$2 tag=$3
  pw resize $W $H >/dev/null 2>&1
  pw goto "$BASE/book?treatment=neuromodulators" >/dev/null 2>&1
  pw --raw run-code "async page => {
    await page.waitForSelector('text=What would you like to book?');
    await page.screenshot({ path: '$V/book-step1-$tag.png', fullPage: false });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForSelector('text=Who, and when?');
    await page.getByText('First available').first().click();
    const day = page.locator('[role=radio][aria-label]:not([disabled])').first();
    await day.click();
    await page.locator('[aria-label=\"Choose a time\"] [role=radio]').first().click();
    await page.screenshot({ path: '$V/book-step2-$tag.png', fullPage: true });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForSelector('text=Your details');
    // invalid first
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(300);
    const errs = await page.locator('[role=alert]').count();
    await page.screenshot({ path: '$V/book-step3-invalid-$tag.png', fullPage: true });
    await page.fill('#bf-name', 'QA Tester');
    await page.fill('#bf-email', 'qa@example.com');
    await page.fill('#bf-phone', '(480) 555-0100');
    await page.locator('label:has-text(\"cancellation and deposit policies\") input').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForSelector('text=Review and confirm');
    await page.screenshot({ path: '$V/book-step4-$tag.png', fullPage: true });
    await page.getByRole('button', { name: 'Confirm booking request' }).click();
    await page.waitForURL(/\/book\/confirmed\?ref=/, { timeout: 15000 });
    await page.waitForTimeout(800);
    const ref = await page.locator('[data-ref]').textContent();
    const ics = await page.locator('#ics-link').getAttribute('href');
    await page.screenshot({ path: '$V/book-confirmed-$tag.png', fullPage: true });
    return ('RESULT invalid-errors=' + errs + ' ref=' + ref + ' ics=' + (ics && ics.startsWith('blob:') ? 'blob' : ics));
  }" 2>/dev/null | grep -o 'RESULT[^"]*' | tail -1
}
r=$(book_flow 1440 900 desktop); echo "$r" | grep -q "ref=VA-" && echo "$r" | grep -q "ics=blob" && echo "$r" | grep -qE "invalid-errors=[1-9]" && ok "booking flow desktop: $r" || bad "booking flow desktop: $r"
r=$(book_flow 390 844 mobile); echo "$r" | grep -q "ref=VA-" && echo "$r" | grep -q "ics=blob" && ok "booking flow mobile: $r" || bad "booking flow mobile: $r"

# Contact form: invalid then valid
pw resize 1440 900 >/dev/null 2>&1
form_test() {
  local route=$1 formid=$2 fills=$3 tag=$4
  pw goto "$BASE$route" >/dev/null 2>&1
  pw --raw run-code "async page => {
    await page.waitForSelector('#$formid');
    await page.locator('#$formid button[type=submit]').click();
    await page.waitForTimeout(300);
    const errs = (await page.locator('#$formid .field-error').allTextContents()).filter(Boolean).length;
    await page.screenshot({ path: '$V/form-$tag-invalid.png', fullPage: true });
    $fills
    await page.locator('#$formid button[type=submit]').click();
    await page.waitForSelector('[role=status] h3', { timeout: 10000 });
    const title = await page.locator('[role=status] h3').textContent();
    await page.screenshot({ path: '$V/form-$tag-success.png', fullPage: true });
    return ('RESULT errors=' + errs + ' success=' + title);
  }" 2>/dev/null | grep -o 'RESULT[^"]*' | tail -1
}
r=$(form_test /contact contact-form "await page.fill('#f-name','QA Tester'); await page.fill('#f-email','qa@example.com'); await page.fill('#f-message','This is a QA message with enough characters.');" contact)
echo "$r" | grep -qE "errors=[1-9]" && echo "$r" | grep -q "success=Message sent" && ok "contact form: $r" || bad "contact form: $r"
r=$(form_test /support support-form "await page.fill('#f-name','QA Tester'); await page.fill('#f-email','qa@example.com'); await page.selectOption('#f-topic','Aftercare question'); await page.fill('#f-message','Question about bruising after filler, is this normal?');" support)
echo "$r" | grep -qE "errors=[1-9]" && echo "$r" | grep -q "success=Message sent" && ok "support form: $r" || bad "support form: $r"
r=$(form_test /gift-cards gift-form "await page.fill('#f-purchaserName','QA Tester'); await page.fill('#f-purchaserEmail','qa@example.com'); await page.fill('#f-recipientName','A Friend'); await page.fill('#f-recipientEmail','friend@example.com');" gift)
echo "$r" | grep -qE "errors=[1-9]" && echo "$r" | grep -q "success=Request received" && ok "gift card form: $r" || bad "gift card form: $r"

# Newsletter (footer) invalid + valid
pw goto "$BASE/journal" >/dev/null 2>&1
r=$(pw --raw run-code "async page => { const f = page.locator('form[data-newsletter]').first(); await f.locator('input[name=email]').fill('nope'); await f.locator('button').click(); await page.waitForTimeout(300); const e1 = await f.locator('.form-msg').textContent(); await f.locator('input[name=email]').fill('qa@example.com'); await f.locator('button').click(); await page.waitForTimeout(1500); const e2 = await f.locator('.form-msg').textContent(); return ('RESULT invalid=' + e1 + ' | valid=' + e2); }" 2>/dev/null | grep -o 'RESULT[^"]*' | tail -1)
echo "$r" | grep -q "invalid=Enter a valid email" && echo "$r" | grep -q "valid=You are on the list" && ok "newsletter: $r" || bad "newsletter: $r"

# Support search
pw goto "$BASE/support" >/dev/null 2>&1
r=$(pw --raw run-code "async page => { await page.fill('#support-q', 'bruis'); await page.waitForTimeout(300); const n = await page.locator('#support-results a').count(); const first = await page.locator('#support-results a').first().getAttribute('href'); await page.screenshot({ path: '$V/support-search.png' }); return ('RESULT hits=' + n + ' first=' + first); }" 2>/dev/null | grep -o 'RESULT[^"]*' | tail -1)
echo "$r" | grep -qE "hits=[1-9]" && ok "support search: $r" || bad "support search: $r"

# Quiz -> results -> /book?treatment=
pw goto "$BASE/quiz" >/dev/null 2>&1
r=$(pw --raw run-code "async page => {
  await page.waitForSelector('text=Question 1 of 6');
  await page.getByRole('checkbox', { name: /Sun spots/ }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  for (let i = 0; i < 5; i++) { await page.waitForTimeout(350); await page.locator('[role=radio]').first().click(); }
  await page.waitForSelector('text=Your match', { timeout: 5000 });
  await page.screenshot({ path: '$V/quiz-results.png', fullPage: true });
  const href = await page.locator('main a[href^=\"/book?treatment=\"]').first().getAttribute('href');
  return ('RESULT book=' + href);
}" 2>/dev/null | grep -o 'RESULT[^"]*' | tail -1)
echo "$r" | grep -q "book=/book?treatment=" && ok "quiz: $r" || bad "quiz: $r"

# Mobile menu
pw resize 390 844 >/dev/null 2>&1; pw goto "$BASE/" >/dev/null 2>&1
r=$(pw --raw run-code "async page => { await page.waitForTimeout(1500); await page.click('#menu-toggle'); await page.waitForTimeout(700); const open = await page.locator('#mobile-menu.is-open').count(); await page.screenshot({ path: '$V/mobile-menu.png' }); await page.click('#menu-close'); await page.waitForTimeout(400); const hidden = await page.locator('#mobile-menu[hidden]').count(); const bar = await page.evaluate(() => { window.scrollTo(0, window.innerHeight * 1.2); return new Promise(r => setTimeout(() => r(document.getElementById('sticky-book')?.classList.contains('is-visible')), 600)); }); await page.screenshot({ path: '$V/mobile-sticky-bar.png' }); return ('RESULT open=' + open + ' closed=' + hidden + ' stickybar=' + bar); }" 2>/dev/null | grep -o 'RESULT[^"]*' | tail -1)
echo "$r" | grep -q "open=1 closed=1 stickybar=true" && ok "mobile menu + sticky bar: $r" || bad "mobile menu + sticky bar: $r"

# 3D renders on desktop
pw resize 1440 900 >/dev/null 2>&1; pw goto "$BASE/" >/dev/null 2>&1
r=$(pw --raw run-code "async page => { await page.waitForTimeout(4500); const live = await page.locator('.hero-canvas.is-live').count(); const rings = await page.locator('.lm-ring.is-live').count(); await page.screenshot({ path: '$V/hero-3d.png' }); return ('RESULT heroCanvasLive=' + live + ' metalRingsLive=' + rings); }" 2>/dev/null | grep -o 'RESULT[^"]*' | tail -1)
echo "$r" | grep -q "heroCanvasLive=1 metalRingsLive=3" && ok "hero WebGL slider + liquid metal CTAs: $r" || bad "hero WebGL slider + liquid metal CTAs: $r"

# Reduced motion -> poster only
r=$(pw --raw run-code "async page => { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('$BASE/'); await page.waitForTimeout(3500); const live = await page.locator('.hero-canvas.is-live').count(); const rings = await page.locator('.lm-ring.is-live').count(); const img = await page.locator('.hero-slider picture img').first().isVisible(); await page.screenshot({ path: '$V/hero-reduced-motion.png' }); await page.emulateMedia({ reducedMotion: 'no-preference' }); return ('RESULT heroCanvasLive=' + live + ' metalRingsLive=' + rings + ' staticImageVisible=' + img); }" 2>/dev/null | grep -o 'RESULT[^"]*' | tail -1)
echo "$r" | grep -q "heroCanvasLive=0 metalRingsLive=0 staticImageVisible=true" && ok "reduced motion static fallback: $r" || bad "reduced motion static fallback: $r"

# API rate limit + honeypot
rl=$(for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code} " -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -d '{"name":"QA","email":"qa@example.com","message":"rate limit probe message"}'; done)
echo "$rl" | grep -q "429" && ok "rate limit after 5/min: $rl" || bad "rate limit: $rl"
hp=$(curl -s -X POST "$BASE/api/support" -H 'Content-Type: application/json' -d '{"name":"Bot","email":"bot@example.com","topic":"Policies","message":"buy my stuff please now","company_website":"http://spam.example"}')
echo "$hp" | grep -q '"ok":true' && ok "honeypot silently accepted: $hp" || bad "honeypot: $hp"

pw close >/dev/null 2>&1
echo "E2E DONE"; cat "$R"

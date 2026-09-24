// Converts stock-raw/*.jpg|png into public/images/{name}-{w}.avif|webp at three
// widths, applies one consistent warm grade so stock and 3D read as one world,
// and writes a 1200px JPEG poster for OG use. Run: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "stock-raw");
const OUT = join(ROOT, "public", "images");
const WIDTHS = [640, 1200, 1920];

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));

// Warm grade: slight warmth via channel gains, gentle contrast, a touch of
// desaturation so skin and interiors sit inside the bone/sand palette.
function grade(img) {
  return img
    .modulate({ saturation: 0.9, brightness: 1.02 })
    .linear([1.03, 1.0, 0.95], [4, 2, -2])
    .gamma(1.05);
}

let count = 0;
for (const file of files) {
  const { name } = parse(file);
  const input = join(SRC, file);
  const meta = await sharp(input).metadata();
  for (const w of WIDTHS) {
    const base = grade(sharp(input).rotate().resize({ width: w, withoutEnlargement: true }));
    await base.clone().avif({ quality: 55, effort: 4 }).toFile(join(OUT, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 78 }).toFile(join(OUT, `${name}-${w}.webp`));
    count += 2;
  }
  await grade(sharp(input).rotate().resize({ width: 1200, withoutEnlargement: true }))
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(join(OUT, `${name}-poster.jpg`));
  count += 1;
  console.log(`${name}: ${meta.width}x${meta.height}`);
}
console.log(`Wrote ${count} files to public/images`);

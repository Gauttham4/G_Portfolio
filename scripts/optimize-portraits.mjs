// One-off: re-encode public/about portraits to a smaller size budget.
// Re-runs at q=70 if any file exceeds 400 KB at q=78.

import sharp from '../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'public/about';
const TARGET_BYTES = 400 * 1024;
const HERO_TARGET_BYTES = 350 * 1024;

async function encode(src, quality) {
  const tmp = src + '.opt.jpg';
  await sharp(src)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(tmp);
  return tmp;
}

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g)$/i.test(f));
const results = [];

for (const f of files) {
  const src = join(DIR, f);
  const before = (await stat(src)).size;

  // First pass q=78
  let tmp = await encode(src, 78);
  let size = (await stat(tmp)).size;
  let q = 78;

  const budget = f.includes('hero') ? HERO_TARGET_BYTES : TARGET_BYTES;

  if (size > budget) {
    await unlink(tmp);
    tmp = await encode(src, 70);
    size = (await stat(tmp)).size;
    q = 70;
  }

  await rename(tmp, src);
  results.push({ file: f, before, after: size, q });
  console.log(`${f}: ${(before / 1024).toFixed(0)}KB -> ${(size / 1024).toFixed(0)}KB (q=${q})`);
}

console.log('\nDone:', results.length, 'files');

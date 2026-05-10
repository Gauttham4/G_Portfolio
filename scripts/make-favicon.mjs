// Generate favicon icons from a portrait photo.
// - Smart-crops to upper-center where the face typically sits
// - Outputs Next.js App Router conventions: app/icon.png, app/apple-icon.png

import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC = 'public/about/portrait-cafe.jpg';
const OUT_DIR = 'app';

const meta = await sharp(SRC).metadata();
console.log(`source ${SRC} = ${meta.width} x ${meta.height}`);

// In portrait-cafe.jpg the face sits roughly in the upper-third center.
// Calibrate a tight square crop on that region.
const faceY = Math.round(meta.height * 0.18);  // top of face ~18% from top
const faceH = Math.round(meta.height * 0.42);  // face zone ~42% height
const faceX = Math.round(meta.width * 0.5 - faceH / 2);

const cropParams = { left: Math.max(0, faceX), top: faceY, width: faceH, height: faceH };
console.log('crop', cropParams);

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

// app/icon.png  — 512×512, used for tab favicon at multiple sizes
await sharp(SRC)
  .extract(cropParams)
  .resize(512, 512, { kernel: 'lanczos3' })
  .png({ quality: 92, compressionLevel: 9 })
  .toFile(path.join(OUT_DIR, 'icon.png'));
console.log('wrote', path.join(OUT_DIR, 'icon.png'));

// app/apple-icon.png — 180×180 for iOS home-screen
await sharp(SRC)
  .extract(cropParams)
  .resize(180, 180, { kernel: 'lanczos3' })
  .png({ quality: 95 })
  .toFile(path.join(OUT_DIR, 'apple-icon.png'));
console.log('wrote', path.join(OUT_DIR, 'apple-icon.png'));

// Also produce a 32x32 png for the small favicon slot (browsers pick whichever they need)
await sharp(SRC)
  .extract(cropParams)
  .resize(32, 32, { kernel: 'lanczos3' })
  .png()
  .toFile(path.join(OUT_DIR, 'icon-32.png'));
console.log('wrote', path.join(OUT_DIR, 'icon-32.png'));

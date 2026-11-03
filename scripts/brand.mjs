/**
 * Generates brand assets from the official SG logo (src/assets/images/logo-sg.jpg):
 * src/assets/images/logo-sg.png (transparent, trimmed), favicon-32.png,
 * apple-touch-icon.png, icon-192.png, icon-512.png and og.png.
 * Run: pnpm brand (needs Chrome or Edge for the OG image; set CHROME to its path).
 */
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'src/assets/images/logo-sg.jpg');
const logoPng = join(root, 'src/assets/images/logo-sg.png');
const bg = { r: 5, g: 11, b: 46, alpha: 1 };

// Key out the black background: flood-fill from the edges through dark pixels,
// fading the glow to transparent instead of cutting it.
const LOW = 14;
const HIGH = 80;
const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const out = Buffer.alloc(w * h * 4);
const bgMask = new Uint8Array(w * h);
const peak = (i) => Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
const stack = [];
for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
while (stack.length) {
  const i = stack.pop();
  if (bgMask[i] || peak(i) >= HIGH) continue;
  bgMask[i] = 1;
  const x = i % w;
  if (x > 0) stack.push(i - 1);
  if (x < w - 1) stack.push(i + 1);
  if (i >= w) stack.push(i - w);
  if (i < w * (h - 1)) stack.push(i + w);
}
for (let i = 0; i < w * h; i++) {
  const a = bgMask[i] ? Math.min(1, Math.max(0, (peak(i) - LOW) / (HIGH - LOW))) : 1;
  for (let c = 0; c < 3; c++) out[i * 4 + c] = a > 0 ? Math.min(255, Math.round(data[i * 3 + c] / Math.max(a, 0.35))) : 0;
  out[i * 4 + 3] = Math.round(a * 255);
}
await sharp(out, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 }).png().toFile(logoPng);

const icon = async (size, out, pad = 0.1) => {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(logoPng).resize({ width: inner, height: inner, fit: 'inside' }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toFile(join(root, 'public', out));
};
await sharp(logoPng).resize({ width: 32, height: 32, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(join(root, 'public/favicon-32.png'));
await icon(180, 'apple-touch-icon.png');
await icon(192, 'icon-192.png');
await icon(512, 'icon-512.png');

// Stage og.html and what it loads in a short temp path: Chrome cannot open
// file:// URLs past Windows' 260-character limit.
const stage = mkdtempSync(join(tmpdir(), 'og-'));
const fonts = ['sora/files/sora', 'geist/files/geist', 'geist-mono/files/geist-mono'];
for (const f of fonts) {
  const file = `${f}-latin-wght-normal.woff2`;
  mkdirSync(dirname(join(stage, 'node_modules/@fontsource-variable', file)), { recursive: true });
  copyFileSync(join(root, 'node_modules/@fontsource-variable', file), join(stage, 'node_modules/@fontsource-variable', file));
}
mkdirSync(join(stage, 'src/assets/images'), { recursive: true });
copyFileSync(logoPng, join(stage, 'src/assets/images/logo-sg.png'));
mkdirSync(join(stage, 'scripts'));
copyFileSync(join(root, 'scripts/og.html'), join(stage, 'scripts/og.html'));

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = join(stage, 'profile');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--allow-file-access-from-files',
  `--user-data-dir=${profile}`,
  '--window-size=1200,630',
  '--virtual-time-budget=3000',
  `--screenshot=${join(stage, 'og.png')}`,
  pathToFileURL(join(stage, 'scripts/og.html')).href,
]);
copyFileSync(join(stage, 'og.png'), join(root, 'public/og.png'));
rmSync(stage, { recursive: true, force: true });
console.log('brand assets written to public/ and src/assets/images/');

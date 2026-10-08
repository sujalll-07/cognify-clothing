import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const branding = path.join(root, 'public', 'branding');
const graphics = path.join(root, 'public', 'graphics');
fs.mkdirSync(branding, { recursive: true });
fs.mkdirSync(graphics, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePng(width, height, paint) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = paint(x, y, width, height);
      const o = row + 1 + x * 4;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
      raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  return png;
}

function dist(x, y, cx, cy) {
  return Math.hypot(x - cx, y - cy);
}

function stamp(x, y, w, h, fn) {
  return fn(x / w, y / h, x, y, w, h);
}

const gold = [212, 175, 55];
const cream = [232, 229, 220];

const graphic01 = encodePng(1024, 1024, (x, y, w, h) => {
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const r = Math.hypot(nx, ny);
  const ang = Math.atan2(ny, nx);
  const ring = Math.abs(r - 0.62) < 0.045 ? 1 : 0;
  const inner = Math.abs(r - 0.38) < 0.028 ? 1 : 0;
  const bar = Math.abs(ny) < 0.035 && nx > -0.02 && nx < 0.55 ? 1 : 0;
  const wedge = r < 0.62 && r > 0.38 && ang > -0.35 && ang < 0.55 ? 0 : 1;
  const cMark = (ring || inner) && wedge;
  const a = Math.max(cMark ? 230 : 0, bar && r < 0.7 ? 220 : 0);
  if (r > 0.9) return [0, 0, 0, 0];
  return a ? [...gold, a] : [0, 0, 0, 0];
});

const graphic02 = encodePng(1024, 1024, (x, y, w, h) => {
  const nx = x / w;
  const ny = y / h;
  const inRect = nx > 0.12 && nx < 0.88 && ny > 0.28 && ny < 0.72;
  const border =
    inRect &&
    (nx < 0.16 || nx > 0.84 || ny < 0.32 || ny > 0.68);
  const line = Math.abs(ny - 0.5) < 0.012 && nx > 0.2 && nx < 0.8;
  const a = border || line ? 235 : 0;
  return a ? [...cream, a] : [0, 0, 0, 0];
});

const graphic03 = encodePng(1024, 1024, (x, y, w, h) => {
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const diamond = Math.abs(nx) + Math.abs(ny) < 0.72;
  const diamondInner = Math.abs(nx) + Math.abs(ny) < 0.58;
  const cross = (Math.abs(nx) < 0.03 && Math.abs(ny) < 0.5) || (Math.abs(ny) < 0.03 && Math.abs(nx) < 0.5);
  const a = diamond && !diamondInner ? 230 : cross && diamondInner ? 210 : 0;
  return a ? [133, 140, 114, a] : [0, 0, 0, 0];
});

fs.writeFileSync(path.join(graphics, 'graphic-01.png'), graphic01);
fs.writeFileSync(path.join(graphics, 'graphic-02.png'), graphic02);
fs.writeFileSync(path.join(graphics, 'graphic-03.png'), graphic03);

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" fill="none">
  <path d="M320 70c-72 0-120 52-120 118s52 122 120 122c38 0 70-14 92-40l-38-28c-14 16-32 24-54 24-42 0-70-34-70-78s28-76 70-76c22 0 40 8 54 24l38-28c-22-26-54-38-92-38z" fill="#D4AF37"/>
  <path d="M392 150h48v56h-48z" fill="#D4AF37"/>
  <text x="320" y="300" text-anchor="middle" fill="#D4AF37" font-family="Georgia, serif" font-size="42" letter-spacing="10">COGNIFY</text>
  <text x="320" y="332" text-anchor="middle" fill="#D4AF37" font-family="Georgia, serif" font-size="14" letter-spacing="8">CLOTHING</text>
</svg>
`;

const logoWhiteSvg = logoSvg.replaceAll('#D4AF37', '#FFFFFF');
fs.writeFileSync(path.join(branding, 'cognify-logo.svg'), logoSvg);
fs.writeFileSync(path.join(branding, 'cognify-logo-white.svg'), logoWhiteSvg);

console.log('Wrote graphics and SVG wordmarks. PNG source logo remains branding/cognify-logo.png');

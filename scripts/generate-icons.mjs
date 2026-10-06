// Menghasilkan semua aset ikon dari build/icon.svg
// Jalankan: npm run icons
import sharp from 'sharp';
import { readFile, writeFile, copyFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import * as path from 'path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'build/icon.svg');
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];

const renderPng = async (svg, size) =>
  sharp(svg)
    .resize(size, size)
    .png()
    .toBuffer();

// File ICO berisi beberapa gambar PNG (didukung sejak Windows Vista)
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);

  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map(p => p.data)]);
}

const svg = await readFile(src);

await writeFile(path.join(root, 'build/icon.png'), await renderPng(svg, 1024));
await writeFile(path.join(root, 'public/icon.png'), await renderPng(svg, 512));
await copyFile(src, path.join(root, 'public/icon.svg'));

const pngs = await Promise.all(ICO_SIZES.map(async size => ({ size, data: await renderPng(svg, size) })));
await writeFile(path.join(root, 'build/icon.ico'), buildIco(pngs));

console.log('Ikon dibuat: build/icon.png, build/icon.ico, public/icon.png, public/icon.svg');

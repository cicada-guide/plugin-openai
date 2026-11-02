import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
for (const theme of ['light', 'dark']) {
  await sharp(readFileSync('assets/logo-source.png')).resize(512, 512, { fit: 'contain', background: '#00000000' }).png().toFile(`assets/logo-${theme}.png`);
}
mkdirSync('docs/evidence', { recursive: true });
const panels = [];
for (const [index, theme] of ['light', 'dark'].entries()) {
  const input = await sharp(readFileSync(`assets/logo-${theme}.png`)).resize(48, 48).png().toBuffer();
  const panel = await sharp({ create: { width: 96, height: 96, channels: 4, background: theme === 'light' ? '#FFFFFF' : '#202020' } }).composite([{ input, left: 24, top: 24 }]).png().toBuffer();
  panels.push({ input: panel, left: 96 * index, top: 0 });
}
await sharp({ create: { width: 192, height: 96, channels: 4, background: '#FFFFFF' } }).composite(panels).png().toFile('docs/evidence/icons-48px.png');

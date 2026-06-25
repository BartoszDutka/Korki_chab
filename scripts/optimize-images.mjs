/**
 * Optymalizacja obrazów hero/map do public/.
 * Uruchom: npm run optimize:images
 * Wymaga: plik public/hero-source.jpg (oryginalne zdjęcie sali)
 */
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const source = join(publicDir, 'hero-source.jpg')

if (!existsSync(source)) {
  console.log('Brak public/hero-source.jpg — skopiuj tam zdjęcie hero (JPG) i uruchom ponownie.')
  console.log('Tymczasowo strona używa zewnętrznego URL lub gradientu na mobile.')
  process.exit(0)
}

const sharp = await import('sharp').catch(() => null)
if (!sharp) {
  console.log('Instaluj sharp: npm install -D sharp && npm run optimize:images')
  process.exit(1)
}

const sizes = [
  { name: 'hero-480.webp', width: 480 },
  { name: 'hero-800.webp', width: 800 },
  { name: 'hero-1200.webp', width: 1200 },
]

for (const { name, width } of sizes) {
  await sharp.default(source)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(publicDir, name))
  console.log('OK', name)
}

await sharp.default(source)
  .resize(800, null, { withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(publicDir, 'hero.jpg'))

console.log('Gotowe — hero WebP/JPG w public/')

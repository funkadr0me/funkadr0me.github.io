// After the build, tidy every picture on the built pages (mostly the ones written in a case study's Markdown):
// 1. a picture from /images/ that states no size gets its width and height, so the text doesn't jump as it
//    loads (the styles keep `height: auto`);
// 2. a heavy work picture gets smaller WebP copies in /resized/ and a `srcset`, so a screen only downloads what
//    it can show. Originals stay where they are (shared links and Pages CMS use them).
// The home page's pictures already have their copies (src/pages/resized/[...file].ts) and are left alone.
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const WIDTHS = [480, 800, 1100, 1600];
const HEAVY = 100 * 1024; // smaller files aren't worth copies

/** Width and height as the browser shows the picture (turned the way its camera tag says). */
async function sizeOf(file) {
  const { width, height, orientation = 1 } = await sharp(file).metadata();
  if (!width || !height) return undefined;
  return orientation >= 5 ? { width: height, height: width } : { width, height };
}

/** The widest the layout draws this picture, in pixels (ArticleLayout.astro and the cover in work/[id].astro). */
function drawnWidth(tag, around, size) {
  if (/class="[^"]*\bcover\b/.test(tag)) return Math.min(1100, Math.round((640 * size.width) / size.height)); // 640px tall at most
  for (let i = around.length - 1; i >= 0; i--) {
    const limit = around[i].match(/max-width:\s*(\d+)px/)?.[1];
    if (limit) return Number(limit);
    if (/class="[^"]*\bin-column\b/.test(around[i])) return 330; // two across the text column
    if (/class="[^"]*\bshots\b/.test(around[i])) return 700; // the wider of a pair across the band
    if (/class="[^"]*\bwide\b/.test(around[i])) return 1100;
  }
  return 680; // the text column
}

export default function imageSizes() {
  return {
    name: 'image-sizes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const pages = (await readdir(root, { recursive: true })).filter((file) => file.endsWith('.html'));
        const made = new Set();
        let sized = 0;
        let lightened = 0;

        const copy = async (file, src, width) => {
          const url = `/resized${src.replace(/\.([a-z0-9]+)$/i, '-$1')}-${width}.webp`;
          if (!made.has(url)) {
            made.add(url);
            const out = join(root, decodeURIComponent(url));
            await mkdir(dirname(out), { recursive: true });
            // PNGs here are charts and screenshots with small type: near-lossless keeps their edges clean.
            const quality = /\.png$/i.test(src) ? { nearLossless: true, quality: 60 } : { quality: 82 };
            await sharp(file).rotate().resize({ width }).webp(quality).toFile(out);
          }
          return url;
        };

        for (const page of pages) {
          const html = await readFile(join(root, page), 'utf8');
          const parts = [];
          const around = []; // the figures and divs the current picture sits in
          let done = 0;
          for (const match of html.matchAll(/<(\/?)(figure|div)\b[^>]*>|<img\b[^>]*>/g)) {
            const [tag, closing, wrapper] = match;
            if (wrapper) {
              if (closing) around.pop();
              else around.push(tag);
              continue;
            }
            const src = tag.match(/\ssrc="(\/images\/[^"]+)"/)?.[1];
            if (!src || /\ssrcset=/.test(tag)) continue;
            const file = join(root, decodeURIComponent(src));
            if (!existsSync(file)) continue;
            const size = await sizeOf(file);
            if (!size) continue;

            let next = tag;
            if (!/\s(width|height)=/.test(next)) {
              next = next.replace('<img', `<img width="${size.width}" height="${size.height}"`);
              sized++;
            }
            if (src.startsWith('/images/work/') && /\.(jpe?g|png)$/i.test(src) && (await stat(file)).size > HEAVY) {
              // Never claim more than the picture has: a cover's size on the page follows this figure.
              const drawn = Math.min(drawnWidth(tag, around, size), size.width);
              const widths = [...new Set([...WIDTHS.filter((w) => w < size.width), Math.min(size.width, WIDTHS.at(-1))])];
              const urls = await Promise.all(widths.map((w) => copy(file, src, w)));
              const srcset = urls.map((url, i) => `${url} ${widths[i]}w`).join(', ');
              // Not `sizes="auto"`: browsers then treat the picture as 300px wide until laid out, which narrowed the
              // side-by-side figures on a phone.
              const sizes = `(max-width: ${drawn + 32}px) calc(100vw - 32px), ${drawn}px`;
              // The plain `src` is the copy that covers the drawn width, for anything that ignores `srcset`.
              const plain = urls[widths.findIndex((w) => w >= drawn)] ?? urls.at(-1);
              next = next.replace(`src="${src}"`, `src="${plain}" srcset="${srcset}" sizes="${sizes}"`);
              lightened++;
            }
            if (next === tag) continue;
            parts.push(html.slice(done, match.index), next);
            done = match.index + tag.length;
          }
          if (parts.length) await writeFile(join(root, page), parts.join('') + html.slice(done));
        }
        logger.info(`sized ${sized} pictures, gave ${lightened} smaller copies (${made.size} files)`);
      },
    },
  };
}

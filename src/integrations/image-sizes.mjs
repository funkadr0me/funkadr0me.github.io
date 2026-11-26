// After the build, give every picture from /images/ that states no size its width and height (mostly the ones
// written in a case study's Markdown), so the text doesn't jump as they load. The styles keep `height: auto`.
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export default function imageSizes() {
  return {
    name: 'image-sizes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const pages = (await readdir(root, { recursive: true })).filter((file) => file.endsWith('.html'));
        let added = 0;
        for (const page of pages) {
          const html = await readFile(join(root, page), 'utf8');
          const sizes = new Map();
          for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
            const src = tag.match(/\ssrc="(\/images\/[^"]+)"/)?.[1];
            if (!src || /\s(width|height)=/.test(tag)) continue;
            const file = join(root, decodeURIComponent(src));
            if (!existsSync(file)) continue;
            const { width, height, orientation = 1 } = await sharp(file).metadata();
            if (!width || !height) continue;
            const [w, h] = orientation >= 5 ? [height, width] : [width, height];
            sizes.set(tag, tag.replace('<img', `<img width="${w}" height="${h}"`));
          }
          if (!sizes.size) continue;
          await writeFile(join(root, page), html.replace(/<img\b[^>]*>/g, (tag) => sizes.get(tag) ?? tag));
          added += sizes.size;
        }
        logger.info(`added width and height to ${added} pictures`);
      },
    },
  };
}

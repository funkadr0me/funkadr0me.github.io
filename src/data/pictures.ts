// Pictures live in public/images (where Pages CMS puts uploads), so Astro doesn't process them. These helpers
// read a picture's size, and name the smaller WebP copies that src/pages/resized/[...file].ts makes at build.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

export const publicFile = (src: string) => join(process.cwd(), 'public', decodeURIComponent(src));

/** Width and height as the browser shows the picture (turned the way its camera tag says). */
export async function pictureSize(src: string) {
  if (!src.startsWith('/') || !existsSync(publicFile(src))) return undefined;
  const { width, height, orientation = 1 } = await sharp(publicFile(src)).metadata();
  if (!width || !height) return undefined;
  return orientation >= 5 ? { width: height, height: width } : { width, height };
}

/** The widths worth making: the asked ones below the original, plus the original's own if it is smaller than the largest. */
export const copyWidths = (original: number, asked: number[]) =>
  [...new Set([...asked.filter((w) => w < original), Math.min(original, Math.max(...asked))])];

export const copyUrl = (src: string, width: number) => `/resized${src.replace(/\.[a-z0-9]+$/i, '')}-${width}.webp`;

// The widths each place on the home page asks for.
export const CARD_WIDTHS = [480, 800, 1100]; // 1100 covers a full-width card on a 3x phone
export const PORTRAIT_WIDTHS = [400, 600];

/** Attributes for an <img> that picks a copy to suit the screen. A remote or missing picture is left as it is. */
export async function responsive(src: string, asked: number[]) {
  const size = await pictureSize(src);
  if (!size) return { src };
  const widths = copyWidths(size.width, asked);
  return {
    src: copyUrl(src, widths[Math.min(1, widths.length - 1)]),
    srcset: widths.map((w) => `${copyUrl(src, w)} ${w}w`).join(', '),
    ...size,
  };
}

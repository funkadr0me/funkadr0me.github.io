// /resized/…: smaller WebP copies of the home page's pictures, made at build from the originals in public/images,
// so a picture uploaded through Pages CMS gets its copies without anyone doing anything.
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { CARD_WIDTHS, PORTRAIT_WIDTHS, copyUrl, copyWidths, pictureSize, publicFile } from '../../data/pictures';
import { getProjects, settings } from '../../data/site';

export const getStaticPaths: GetStaticPaths = async () => {
  const wanted = [
    ...(await getProjects()).filter((project) => project.era === 'now' && project.thumb).map((project) => ({ src: project.thumb!, asked: CARD_WIDTHS })),
    ...(settings.portrait ? [{ src: settings.portrait, asked: PORTRAIT_WIDTHS }] : []),
  ];
  const paths = new Map<string, { params: { file: string }; props: { src: string; width: number } }>();
  for (const { src, asked } of wanted) {
    const size = await pictureSize(src);
    if (!size) continue;
    for (const width of copyWidths(size.width, asked)) {
      const file = copyUrl(src, width).replace('/resized/', '');
      paths.set(file, { params: { file }, props: { src, width } });
    }
  }
  return [...paths.values()];
};

export const GET: APIRoute = async ({ props }) => {
  const copy = await sharp(publicFile(props.src as string)).rotate().resize({ width: props.width as number }).webp({ quality: 80 }).toBuffer();
  return new Response(new Uint8Array(copy), { headers: { 'content-type': 'image/webp' } });
};

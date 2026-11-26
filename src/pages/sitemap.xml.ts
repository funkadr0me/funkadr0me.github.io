// /sitemap.xml: every page a search engine should know. Project and writing pages come from the content; a new
// hand-made page in src/pages goes into the first list. The 404 page and the PDF stay out.
import type { APIRoute } from 'astro';
import { getProjectEntries, getWritingEntries, hasWriteUp, workUrl, writingUrl } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const paths = [
    '/',
    '/resume/',
    '/work/advertising-and-scriptwriting/',
    ...(await getProjectEntries()).filter(hasWriteUp).map((entry) => workUrl(entry.id)),
    ...(await getWritingEntries()).filter(hasWriteUp).map((entry) => writingUrl(entry.id)),
  ];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site)}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};

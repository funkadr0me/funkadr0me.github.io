// /robots.txt, built from `site` in astro.config.mjs so a custom domain carries over. Everything may be crawled.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site)}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });

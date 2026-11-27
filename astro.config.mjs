// @ts-check
import { defineConfig } from 'astro/config';
import imageSizes from './src/integrations/image-sizes.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Published on GitHub Pages from the funkadr0me/funkadr0me.github.io repository.
  // Custom domain later: change this to 'https://yourdomain.com' and add public/CNAME (see README).
  site: 'https://funkadr0me.github.io',
  integrations: [imageSizes()],
});

// Prints the resume page to public/Purna-Anantha-Resume.pdf with headless Chrome.
// Run `npm run resume:pdf` (it builds the site first) after changing src/content/resume.json
// or the resume page's print styles, then commit the PDF.
// Chrome is found at CHROME_PATH, or in the usual place on macOS, Linux and Windows.
import { createServer } from 'node:http';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const out = join(root, 'public', 'Purna-Anantha-Resume.pdf');

const chrome = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].find((path) => path && existsSync(path));
if (!chrome) {
  console.error('Chrome not found. Set CHROME_PATH to its executable.');
  process.exit(1);
}
if (!existsSync(join(dist, 'resume', 'index.html'))) {
  console.error('dist/resume/index.html is missing. Run `npm run build` first.');
  process.exit(1);
}

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(dist, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(dist) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
// A throwaway profile, so a Chrome that is already open (or its saved settings) can't get in the way.
const profile = mkdtempSync(join(tmpdir(), 'resume-pdf-'));
// Async on purpose: the page is served from this process, which must stay free to answer Chrome.
const status = await new Promise((resolve) => {
  const child = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${profile}`,
      '--no-pdf-header-footer',
      '--export-tagged-pdf',
      '--generate-pdf-document-outline',
      `--print-to-pdf=${out}`,
      `http://127.0.0.1:${port}/resume/`,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );
  const timer = setTimeout(() => child.kill('SIGKILL'), 90_000);
  child.on('exit', (code) => {
    clearTimeout(timer);
    resolve(code);
  });
});
server.close();
rmSync(profile, { recursive: true, force: true });
if (status !== 0) process.exit(status ?? 1);
console.log(`Wrote ${out} (${Math.round(statSync(out).size / 1024)} KB)`);

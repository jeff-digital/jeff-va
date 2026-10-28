import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';

// Keep the original cascade and script execution order. Commit generated assets
// so the static host can serve the repository without a build step.
const styles = ['css/fonts.css', 'css/icons.css', 'css/home.css', 'css/page-overrides.css', 'css/tailwind.css'];
const scripts = ['menu', 'navigation', 'timezone', 'certificate', 'main', 'case-studies', 'contact-form', 'project-filter', 'reveal'];
await mkdir('assets', { recursive: true });
const outputs = [];
for (const [extension, files, options] of [
  ['css', styles, {}],
  ['js', scripts.map(name => `js/${name}.js`), { format: 'iife' }],
]) {
  const source = (await Promise.all(files.map(file => readFile(file, 'utf8')))).join(extension === 'css' ? '\n' : '\n;\n');
  const { code } = await transform(source, { loader: extension, minify: true, target: 'es2020', legalComments: 'none', ...options });
  const hash = createHash('sha256').update(code).digest('hex').slice(0, 12);
  const output = `site-${hash}.${extension}`;
  await writeFile(`assets/${output}`, code);
  outputs.push(output);
  let html = await readFile('index.html', 'utf8');
  html = html.replace(new RegExp(`assets/site-[a-f0-9]+\\.${extension}`, 'g'), `assets/${output}`);
  await writeFile('index.html', html);
  console.log(`${output}: ${Buffer.byteLength(source)} -> ${Buffer.byteLength(code)} bytes`);
}
for (const file of await readdir('assets')) {
  if (/^site-[a-f0-9]+\.(css|js)$/.test(file) && !outputs.includes(file)) await unlink(`assets/${file}`);
}

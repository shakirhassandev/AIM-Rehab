import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { checkSite, projectRoot } from './check.mjs';
import { siteFiles } from './site-files.mjs';

await checkSite();
const output = path.join(projectRoot, 'dist');
// The output is fixed inside this project; source HTML is never removed.
if (path.dirname(output) !== projectRoot || path.basename(output) !== 'dist') {
  throw new Error('Invalid build output directory.');
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const filename of siteFiles) {
  await cp(path.join(projectRoot, filename), path.join(output, filename), { recursive: true });
}
await checkSite(output);
console.log('Copied the HTML5 website to dist/. Upload its contents to your static host.');

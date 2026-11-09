import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteFiles } from './site-files.mjs';

export const projectRoot = path.resolve(fileURLToPath(new URL('../', import.meta.url)));

export async function checkSite(root = projectRoot) {
  const errors = [];
  const pages = [];
  const styles = [];
  async function visit(filename) {
    const absolute = path.join(root, filename);
    const info = await stat(absolute);
    if (info.isDirectory()) {
      for (const entry of await readdir(absolute)) await visit(path.join(filename, entry));
    } else if (filename.endsWith('.html')) pages.push(filename);
    else if (filename.endsWith('.css')) styles.push(filename);
  }
  for (const filename of siteFiles) await visit(filename);
  const documents = new Map(await Promise.all(pages.map(async (filename) => [
    filename, await readFile(path.join(root, filename), 'utf8'),
  ])));
  let references = 0;
  async function checkReference(filename, reference) {
    if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;
    references += 1;
    const [pathname, fragment] = reference.split('#');
    const pathnameOnly = decodeURIComponent(pathname.split('?')[0]);
    let target = pathnameOnly.startsWith('/')
      ? path.join(root, pathnameOnly)
      : path.resolve(root, path.dirname(filename), pathnameOnly || path.basename(filename));
    if (target !== root && !target.startsWith(root + path.sep)) {
      errors.push(`${filename}: reference leaves the site: ${reference}`);
      return;
    }
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      if (!(await stat(target)).isFile()) throw new Error();
    } catch {
      errors.push(`${filename}: missing file: ${reference}`);
      return;
    }
    if (fragment && target.endsWith('.html')) {
      const targetHtml = documents.get(path.relative(root, target)) || await readFile(target, 'utf8');
      const id = decodeURIComponent(fragment);
      if (!Array.from(targetHtml.matchAll(/\bid="([^"]+)"/g), (match) => match[1]).includes(id)) {
        errors.push(`${filename}: missing anchor: ${reference}`);
      }
    }
  }
  const titles = new Set();
  for (const [filename, html] of documents) {
    if (!/^<!doctype html>/i.test(html.trim())) errors.push(`${filename}: missing HTML5 doctype`);
    if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${filename}: expected one H1`);
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    if (!title || titles.has(title)) errors.push(`${filename}: missing or duplicate page title`);
    titles.add(title);
    if (!/<meta\s+[^>]*name="description"/.test(html)) errors.push(`${filename}: missing description`);
    if (!/<link\s+[^>]*rel="canonical"/.test(html)) errors.push(`${filename}: missing canonical URL`);
    if (/_astro\/|astro:|_next\/|next\/|\.astro\b/.test(html)) errors.push(`${filename}: framework reference remains`);
    const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
    if (new Set(ids).size !== ids.length) errors.push(`${filename}: duplicate element IDs`);
    for (const match of html.matchAll(/<(?:script|img|link|a|iframe|source)\b[^>]*>/g)) {
      const tag = match[0];
      for (const attr of tag.matchAll(/\b(?:src|href)="([^"]+)"/g)) await checkReference(filename, attr[1]);
      const srcset = tag.match(/\bsrcset="([^"]+)"/)?.[1];
      if (srcset) {
        for (const candidate of srcset.split(',')) await checkReference(filename, candidate.trim().split(/\s+/)[0]);
      }
      if (tag.startsWith('<img') && !/\balt="/.test(tag)) errors.push(`${filename}: image missing alt text`);
    }
    for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(match[1]); } catch { errors.push(`${filename}: invalid structured data JSON`); }
    }
  }
  for (const filename of styles) {
    const css = await readFile(path.join(root, filename), 'utf8');
    for (const match of css.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)) await checkReference(filename, match[1]);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`Checked ${pages.length} HTML5 pages and ${references} local links, images, scripts, styles and fonts.`);
  return { pages: pages.length, references };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await checkSite(process.argv[2] ? path.resolve(process.argv[2]) : projectRoot);
}

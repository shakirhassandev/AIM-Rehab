import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteFiles } from './site-files.mjs';

const projectRoot = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
};
const root = path.resolve(projectRoot, option('--dir', '.'));
const port = Number(option('--port', process.env.PORT || '4321'));
const host = option('--host', '127.0.0.1');
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port.');
try { await stat(path.join(root, 'index.html')); }
catch { throw new Error('Site files are missing. Run npm run build before previewing dist/.'); }

const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
const server = createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const relative = pathname.replace(/^\/+/, '');
    const filename = path.resolve(root, relative || 'index.html');
    const top = path.relative(root, filename).split(path.sep)[0];
    if (pathname.includes('\\') || pathname.includes('\0') || !siteFiles.includes(top)
      || (filename !== root && !filename.startsWith(root + path.sep))) throw new Error('Not found');
    let target = filename;
    if ((await stat(target)).isDirectory()) {
      if (!pathname.endsWith('/')) {
        response.writeHead(301, { Location: `${url.pathname}/${url.search}` });
        response.end();
        return;
      }
      target = path.join(target, 'index.html');
    }
    const info = await stat(target);
    if (!info.isFile()) throw new Error('Not found');
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(target)] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-cache',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(target).on('error', () => response.destroy()).pipe(response);
  } catch {
    const html = await readFile(path.join(root, '404.html'), 'utf8');
    response.writeHead(404, { 'Content-Type': mimeTypes['.html'] });
    response.end(request.method === 'HEAD' ? undefined : html);
  }
});
server.listen(port, host, () => console.log(`AIM Rehab HTML5 preview: http://${host}:${port}`));

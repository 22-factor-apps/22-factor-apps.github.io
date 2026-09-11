#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

const walk = (directory) => readdirSync(directory).flatMap((name) => {
  const path = join(directory, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

const pages = walk(dist).filter((path) => path.endsWith('.html'));
const failures = [];

for (const page of pages) {
  const pagePath = `/${relative(dist, page).replaceAll('\\', '/').replace(/index\.html$/, '')}`;
  const document = readFileSync(page, 'utf8');
  for (const match of document.matchAll(/\shref="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;

    const url = new URL(href, `https://22-factor-apps.github.io${pagePath}`);
    const pathname = decodeURIComponent(url.pathname);
    const candidate = extname(pathname)
      ? join(dist, pathname)
      : join(dist, pathname, 'index.html');
    if (!existsSync(candidate)) {
      failures.push(`${relative(dist, page)} -> ${href}`);
    }
  }
}

if (failures.length > 0) {
  throw new Error(`broken internal links:\n${failures.join('\n')}`);
}

console.log(`link check: ${pages.length} HTML pages; all internal targets exist`);

#!/usr/bin/env node

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const factorsDirectory = join(root, 'src', 'content', 'factors');
const files = readdirSync(factorsDirectory)
  .filter((file) => file.endsWith('.md'))
  .sort();

const fail = (message) => {
  throw new Error(`content check failed: ${message}`);
};

const parseValue = (raw) => {
  const value = raw.trim();
  if (/^".*"$/.test(value)) return value.slice(1, -1);
  if (/^\d+$/.test(value)) return Number(value);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

const factors = files.map((file) => {
  const document = readFileSync(join(factorsDirectory, file), 'utf8');
  const match = document.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
  if (!match) fail(`${file} has invalid frontmatter boundaries`);

  const frontmatter = Object.fromEntries(
    match[1]
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(':');
        if (separator < 1) fail(`${file} has an invalid frontmatter line: ${line}`);
        return [line.slice(0, separator), parseValue(line.slice(separator + 1))];
      }),
  );

  for (const field of ['number', 'numeral', 'slug', 'title', 'tagline', 'original', 'category', 'reading']) {
    if (frontmatter[field] === undefined || frontmatter[field] === '') {
      fail(`${file} is missing ${field}`);
    }
  }

  if (!/^\d+ min$/.test(frontmatter.reading)) fail(`${file} has invalid reading time`);
  if (!match[2].includes('## Common failure modes')) fail(`${file} lacks common failure modes`);
  if (!match[2].includes('## Litmus test')) fail(`${file} lacks a litmus test`);
  if (frontmatter.original === false && !match[2].includes('## Research lineage')) {
    fail(`${file} lacks research lineage`);
  }

  const words = match[2].replace(/[`#>*_[\]()/-]/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 350) fail(`${file} is too brief (${words} words)`);

  return { file, document, ...frontmatter };
});

if (factors.length !== 22) fail(`expected 22 factor files, found ${factors.length}`);

factors.sort((left, right) => left.number - right.number);
const expectedNumbers = Array.from({ length: 22 }, (_, index) => index + 1);
if (factors.some((factor, index) => factor.number !== expectedNumbers[index])) {
  fail(`numbers must be exactly 1 through 22; got ${factors.map((factor) => factor.number).join(', ')}`);
}

const unique = (field) => new Set(factors.map((factor) => factor[field])).size === factors.length;
if (!unique('slug')) fail('factor slugs are not unique');
if (!unique('numeral')) fail('factor numerals are not unique');

const originals = factors.filter((factor) => factor.original);
const additions = factors.filter((factor) => !factor.original);
if (originals.length !== 10 || additions.length !== 12) {
  fail(`expected 10 originals and 12 additions, found ${originals.length} and ${additions.length}`);
}
if (originals.some((factor) => factor.number > 10) || additions.some((factor) => factor.number < 11)) {
  fail('original/addition boundary must fall between factors 10 and 11');
}

const slugs = new Set(factors.map((factor) => factor.slug));
for (const factor of factors) {
  for (const match of factor.document.matchAll(/\/factors\/([a-z0-9-]+)/g)) {
    if (!slugs.has(match[1])) fail(`${factor.file} links to unknown factor slug ${match[1]}`);
  }
}

console.log(`content check: ${factors.length} factors; ${originals.length} durable originals + ${additions.length} new; all invariants hold`);

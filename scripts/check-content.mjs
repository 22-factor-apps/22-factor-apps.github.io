#!/usr/bin/env node

import { fail, loadFactors } from './factor-content.mjs';

const factors = loadFactors();

for (const factor of factors) {
  for (const field of ['number', 'numeral', 'slug', 'title', 'tagline', 'commandment', 'boundary', 'original', 'category', 'reading']) {
    if (factor[field] === undefined || factor[field] === '') {
      fail(`${factor.file} is missing ${field}`);
    }
  }

  if (!/^\d+ min$/.test(factor.reading)) fail(`${factor.file} has invalid reading time`);
  if (!factor.body.includes('## The commandment')) fail(`${factor.file} lacks a commandment section`);
  if (!factor.body.includes('## Common failure modes')) fail(`${factor.file} lacks common failure modes`);
  if (!factor.body.includes('## Litmus test')) fail(`${factor.file} lacks a litmus test`);
  if (!factor.litmusTest) fail(`${factor.file} has an empty litmus test`);
  if (factor.original === false && !factor.body.includes('## Research lineage')) {
    fail(`${factor.file} lacks research lineage`);
  }

  const words = factor.body.replace(/[`#>*_[\]()/-]/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 350) fail(`${factor.file} is too brief (${words} words)`);
}

if (factors.length !== 22) fail(`expected 22 factor files, found ${factors.length}`);

factors.sort((left, right) => left.number - right.number);
const expectedNumbers = Array.from({ length: 22 }, (_, index) => index + 1);
if (factors.some((factor, index) => factor.number !== expectedNumbers[index])) {
  fail(`numbers must be exactly 1 through 22; got ${factors.map((factor) => factor.number).join(', ')}`);
}

const unique = (field) => new Set(factors.map((factor) => factor[field])).size === factors.length;
if (!unique('slug')) fail('factor slugs are not unique');
if (!unique('numeral')) fail('factor numerals are not unique');
if (!unique('commandment')) fail('factor commandments are not unique');

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

#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { loadFactors, root } from './factor-content.mjs';

const edition = '2026.3';
const release = 'v0.5.0';
const repository = 'https://github.com/22-factor-apps/22-factor-apps.github.io';
const catalogUrl = 'https://22-factor-apps.github.io/catalog/v1/factors.json';
const factors = loadFactors()
  .sort((left, right) => left.number - right.number)
  .map((factor) => ({
    number: factor.number,
    numeral: factor.numeral,
    slug: factor.slug,
    title: factor.title,
    tagline: factor.tagline,
    commandment: factor.commandment,
    boundary: factor.boundary,
    class: factor.original ? 'durable-original' : 'modern-addition',
    category: factor.category,
    reading_minutes: Number.parseInt(factor.reading, 10),
    litmus_test: factor.litmusTest,
    url: `https://22-factor-apps.github.io/factors/${factor.slug}`,
  }));

const catalog = {
  schema_version: '22-factor.catalog/v1',
  edition,
  source: { repository, release },
  factors,
};

const template = {
  schema_version: '22-factor.assessment/v1',
  edition,
  target: 'replace-with-application-or-system',
  source: {
    catalog_url: catalogUrl,
    repository,
    release,
  },
  factors: factors.map((factor) => ({
    number: factor.number,
    slug: factor.slug,
    title: factor.title,
    commandment: factor.commandment,
    boundary: factor.boundary,
    litmus_test: factor.litmus_test,
    status: 'not-assessed',
    rationale: '',
    evidence: [],
    owner: null,
    review_date: null,
    follow_up: null,
  })),
  overlays: [],
  interpretation: 'This assessment records contextual evidence per factor. It intentionally has no aggregate maturity score; one critical failure must not disappear inside a total.',
};

const outputs = [
  [join(root, 'public', 'catalog', 'v1', 'factors.json'), catalog],
  [join(root, 'public', 'assessment', 'v1', 'template.json'), template],
];

let stale = false;
for (const [path, value] of outputs) {
  const document = `${JSON.stringify(value, null, 2)}\n`;
  if (process.argv.includes('--check')) {
    let existing = '';
    try {
      existing = readFileSync(path, 'utf8');
    } catch {
      // Report a missing output through the same actionable drift path.
    }
    if (existing !== document) {
      console.error(`generated artifact is stale: ${path}`);
      stale = true;
    }
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, document);
    console.log(`generated ${path}`);
  }
}

if (stale) {
  console.error('run npm run generate:catalog and commit the result');
  process.exit(1);
}

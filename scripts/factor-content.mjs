import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = dirname(dirname(fileURLToPath(import.meta.url)));
export const factorsDirectory = join(root, 'src', 'content', 'factors');

export const fail = (message) => {
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

const plainText = (markdown) => markdown
  .replace(/^>\s?/gm, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/[`*_]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const extractSection = (body, heading) => {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = body.match(new RegExp(`^## ${escaped}\\n+([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
  return match ? plainText(match[1]) : '';
};

export const loadFactors = () => readdirSync(factorsDirectory)
  .filter((file) => file.endsWith('.md'))
  .sort()
  .map((file) => {
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

    return {
      file,
      document,
      body: match[2],
      litmusTest: extractSection(match[2], 'Litmus test'),
      ...frontmatter,
    };
  });

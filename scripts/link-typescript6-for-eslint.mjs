import { existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const root = process.cwd();
const target = join(root, 'node_modules/@typescript/typescript6');

if (!existsSync(target)) {
  console.warn(
    'Skipping TypeScript 6 link: @typescript/typescript6 is not installed.',
  );
  process.exit(0);
}

const links = [
  'node_modules/typescript-eslint/node_modules/typescript',
  'node_modules/@typescript-eslint/node_modules/typescript',
  'node_modules/ts-api-utils/node_modules/typescript',
];

for (const rel of links) {
  const link = join(root, rel);
  mkdirSync(dirname(link), { recursive: true });
  rmSync(link, { recursive: true, force: true });
  symlinkSync(relative(dirname(link), target), link, 'dir');
}

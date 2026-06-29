import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

function walk(dir: string): boolean {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (walk(full)) return true;
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      return true;
    }
  }

  return false;
}

export function hasContentFiles(collection: string): boolean {
  const dir = resolve(process.cwd(), 'src', 'content', collection);
  return existsSync(dir) && walk(dir);
}

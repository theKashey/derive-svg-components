import { mkdirSync } from 'node:fs';
import fs from 'node:fs/promises';
import { dirname } from 'node:path';

const isNewer = (source: Date | number | undefined, target: Date | number | undefined) => {
  if (!source) {
    return false;
  }

  if (!target || source > target) {
    return true;
  }

  return false;
};

export const derivedFile = async (
  source: string,
  target: string,
  generator: (data: Buffer) => Promise<string> | string
): Promise<boolean> => {
  const sourceStat = fs.stat(source).catch(() => ({ mtime: 0 }));
  const targetStat = fs.stat(target).catch(() => ({ mtime: 0 }));
  const { mtime: sourceTime } = await sourceStat;
  const { mtime: targetTime } = await targetStat;

  if (isNewer(sourceTime, targetTime)) {
    mkdirSync(dirname(target), { recursive: true });
    await fs.writeFile(target, await generator(await fs.readFile(source)));

    return true;
  }

  return false;
};

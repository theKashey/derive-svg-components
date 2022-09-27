#!/usr/bin/env node

import { resolve } from 'node:path';

import sade from 'sade';

import { transformInFolderToReact } from './react-converter';

const program = sade('derive-svg-component', false);

program.version(require('../package.json').version);

program.command('react <src>', 'derives react component').action((src) => {
  const path = resolve(process.cwd(), src);
  console.log('tranforming all in path', path);
  transformInFolderToReact(path);
});

program.parse(process.argv);

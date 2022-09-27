import { basename, dirname, join, sep, relative } from 'node:path';

import * as glob from 'glob';
import { camelCase, upperFirst } from 'lodash';
import * as prettier from 'prettier';

import { derivedFile } from './derived-file';

const removeSvg = (str: string): string => str.replace(/<svg ([^>]*)>/, '').replace('</svg>', '');

const extractSvgHeader = (str: string): string => str.match(/([^>]*)>/)![1];

const transformFolderName = (root: string, folder: string): string => {
  let paths = folder.substring(root.length).split(sep);

  if (paths.includes('svg')) {
    paths = paths.map((path) => (path === 'svg' ? 'react' : path));
  } else {
    const lastPath = paths.pop();
    paths.push(`react-${lastPath}`);
  }

  return join(root, ...paths);
};

const toComponentName = (name: string): string => upperFirst(camelCase(name));

export const transformInFolderToReact = async (sourceDir: string): Promise<void> => {
  const icons = glob.sync(`${sourceDir}/**/*.svg`, {
    ignore: 'node_modules',
  });

  const prettierConfig = await prettier.resolveConfig(sourceDir);

  if (prettierConfig) {
    prettierConfig.parser = 'typescript';
  }

  let transformed = 0;

  const awaiter = Promise.all(
    icons.map((fileName) => {
      const file = basename(fileName);
      const iconName = file.replace('.svg', '');
      const name = iconName + '.tsx';
      const folderName = transformFolderName(sourceDir, dirname(fileName));
      const targetFile = join(folderName, name);

      return derivedFile(fileName, targetFile, (contentBuffer) => {
        transformed++;

        const content = contentBuffer.toString('utf-8');
        const inner = removeSvg(content);

        const componentName = toComponentName(iconName);

        const source = `/*
* this file was automatically generated
* source: ${relative(sourceDir, fileName)}    
* date: ${new Date().toISOString()}
*/
/* eslint-disable */        
export function ${componentName}(props: {className?:string; width?:number; height?:number}) {
  return ${extractSvgHeader(content)} \n {...props} dangerouslySetInnerHTML={{ __html: \`${inner}\` }}\n/>;
}
`;

        return prettierConfig ? prettier.format(source, prettierConfig) : source;
      });
    })
  );
  await awaiter;
  console.log(`${icons.length} sources found. ${transformed} transformed.`);
};

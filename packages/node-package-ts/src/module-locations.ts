import {
  join,
  normalize,
  dirname,
} from 'node:path';

import {
  parentPaths,
  fileExists,
} from '@sqlpm/file-async-ts';

import glob from 'glob-promise';
import { NodePackageContentSources } from './types';
import { contentSourcesToObject } from './content-sources-to-object';

/**
 * Places where modules could be located. The logic considers mono repos using
 * yarn workspaces. The logic does not consider globally installed modules.
 * NOTE: The intent is to find module locations specific to where sqlpm
 * needs to find sql scripts. The intent is to not be a fully compatible module
 * loader.
 *
 * Example usage:
 *
 * ```typescript
 * ```
 */
export const moduleLocations = async (
  packages: NodePackageContentSources,
): Promise<string[]> => {
  if (packages.length === 0) {
    return [];
  }
  const modulePaths: string[] = [];

  const parentPath = dirname(packages[0].sourcePath);

  // we only need to call this one time.
  const paths = parentPaths(parentPath);
  const contentSourceObject = contentSourcesToObject(packages);

  for (const path of paths) {
    const packagePath = join(path, 'package.json');

    const nodeModulePath = join(path, 'node_modules');
    // check if the path is also where the package.json file exits
    if (contentSourceObject[packagePath]) {
      const jsonPackage = contentSourceObject[packagePath];
      if (jsonPackage.workspaces) {
        for (const workspace of jsonPackage.workspaces) {
          // we want to be sure to add a / to the path to only capture
          // directories and someone might have forgotten the /. See nodir in
          // https://github.com/isaacs/node-glob#globsyncpattern-options for
          // details
          const absoluteWorkspace = normalize(join(path, workspace, '/'));
          const dirs = glob.sync(absoluteWorkspace, { noext: true });
          for (const dir of dirs) {
            modulePaths.push(dir);
          }
        }
      }
    }

    // eslint-disable-next-line no-await-in-loop
    if (await fileExists(nodeModulePath)) {
      modulePaths.push(nodeModulePath);
    }
  }

  return modulePaths;
};

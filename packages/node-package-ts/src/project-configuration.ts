import {
  join,
} from 'node:path';

import {
  parentPaths,
} from '@sqlpm/file-async-ts';

import {
  NodePackageContentSource,
  NodePackageContentSources,
} from './index';

import {
  loadNodePackage,
} from './load-node-package';

// -----------------------------------------------------------------------------

export type ProjectConfigurationSignature = (
  childPath: string,
  packageFileName?: string,
) => Promise<NodePackageContentSources>;

/**
   * The project's `package.json` and any parent `package.json` file may be used
   * to determine how a project is built and where modules are located. For
   * example, a parent `package.json` may contain a
   * [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)
   * configuration.
   *
   * * **@param childPath** - The absolute path to the child path containing
   *  the first `package.json` file.
   * * **@param [packageFileName=package.json]** - A node package file name
   * to use in place of `package.json`.
   * * **@throws** - An error is returned if any of the package.json files found
   * are invalid. An error is returned if childPath resolves to a file.
   * * **@returns** - An array of package.json objects: ordered as found from
   * the child package to the parent package.
   *
   * Example usage:
   *
   * ```typescript
   * import {
   *   dirname,
   * } from 'node:path';
   *
   * import {
   *   projectConfiguration,
   * } from '@sqlpm/loader';
   *
   * (async () => {
   *   const dir = dirname(__dirname);
   *   const projConfig = await projectConfiguration(dir);
   *   expect(projConfig[0].content.name).toBeDefined();
   * })();
   * ```
   */
export const projectConfiguration: ProjectConfigurationSignature = async (
  childPath: string,
  packageFileName: string = 'package.json',
): Promise<NodePackageContentSources> => {
  const paths = parentPaths(childPath);

  const promises = paths.map((path) => loadNodePackage(
    join(path, packageFileName),
    {
      required: false,
    },
  ));

  return (await Promise.all(promises))
    .filter(
      (nodePackage): nodePackage is NodePackageContentSource => !!nodePackage,
    );
};

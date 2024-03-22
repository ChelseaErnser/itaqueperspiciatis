import {
  Dependency,
} from '@schemastore/package';

import {
  NodePackages,
} from './types';

/**
 * Given a {@link Dependency} as defined in package.json, converts the
 * object key/value representation of { packageName: packageVersion } into
 * an array of {@link NodePackage}.
 *
 * **@remarks**
 * For dependent packages, the version is marked as 'unknown' because the
 * actual package may have a different version than the version defined in
 * package.json
 *
 * **@param dependencies** - The dependencies object as defined by
 * [package dependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#dependencies).
 * Also see {@link Dependency}.
 * @returns An array of {@link NodePackage}. If no dependencies were found,
 * an empty array is returned.
 *
 * **@example**
 *
 * ```typescript
 * import {
 *   nodePackagesFromDependency
 * } from '@sqlpm/node-package-ts';
 *
 * const packageDependencies: Dependency = {
 *   '@schemastore/package': '^0.0.6',
 * };
 *
 * const dependencies: NodePackages = nodePackagesFromDependency(
 *   packageDependencies,
 * );
 *
 * expect(dependencies).toEqual([{
 *   package: {
 *     dependencies: [],
 *     name: '@schemastore/package',
 *     version: '^0.0.6',
 *   },
 * }]);
 * ```
 */
export const nodePackagesFromDependency = (
  dependencies: Dependency | undefined,
): NodePackages => {
  // A node package that has no dependencies.
  if (dependencies === undefined) {
    return [];
  }
  const result = Object
    .keys(dependencies)
    .map((key: string) => ({
      package: {
        name: key,
        // version: Reflect.get(dependencies, key),
        // The version listed in the dependency may not be the actual version
        // installed. We will need to pull that version from the package.json
        // file itself. In the mean time, we set the version to unknown.
        version: 'unknown',
        dependencies: [],
      },
    }));

  return result;
};

import clone from 'clone';

import {
  FilterOptions,
  NodePackage,
  NodePackages,
} from './types';

/**
 * {@link filterDependencies} signature
 */
export type FilterDependenciesSignature = (
  dependencies: NodePackages | undefined,
  options?: FilterOptions,
) => NodePackages;

/**
 * Given an array of Node Package dependencies (package.json.dependencies),
 * returns a new array of package dependencies filtered by include and exclude
 * regular expressions against the node package name property.
 * * **@param dependencies** - The array of package dependencies as defined
 * by package.json.dependencies.
 *
 * * **@param [options]**
 *   * **[options.include]** - When provided, a filter is applied to include
 * dependencies that match the regular expression.
 *   * **[options.exclude]** - When provided, a filter is applied to remove
 * dependencies that match the regular expression.
 * @returns The array of package dependencies after they have been filtered.
 *
 * **@example**
 * Return file meta data and content details.
 *
 * ```typescript
 * import {
 *   filteredDependencies
 * } from '@sqlpm/node-package-ts';
 *
 * const nodeDependencies = [
 *   { package: { name: 'package', version: '^0.0.6' } },
 *   { package: { name: '@sqlpm/file-async-ts', version: '^1.3.0' } },
 * ];
 *
 * const filteredDependencies = filterDependencies(
 *   nodeDependencies,
 *   { include: [/^@sqlpm\/[\S]/] },
 * );
 *
 * expect(filteredDependencies.length).toEqual(1);
 * ```
 */
export const filterDependencies: FilterDependenciesSignature = (
  dependencies: NodePackages | undefined,
  options?: FilterOptions,
): NodePackages => {
  if (undefined === dependencies) {
    return [];
  }

  let includeFilters: RegExp[] | undefined;
  let excludeFilters: RegExp[] | undefined;

  if (options?.include !== undefined) {
    includeFilters = Array.isArray(options.include)
      ? options.include : [options.include];
  }

  if (options?.exclude !== undefined) {
    excludeFilters = Array.isArray(options.exclude)
      ? options.exclude : [options.exclude];
  }

  const result = dependencies
    .filter((dependency: NodePackage) => {
      let include = false;
      if (includeFilters) {
        for (const filter of includeFilters) {
          if (dependency.package.name.match(filter)) {
            include = true;
            break;
          }
        }
      } else {
        include = true;
      }
      return include;
    }).filter((dependency: NodePackage) => {
      let keep = true;
      if (excludeFilters) {
        for (const filter of excludeFilters) {
          if (dependency.package.name.match(filter)) {
            keep = false;
            break;
          }
        }
      } // else keep is already true
      return keep;
    });

  return clone(result);
};

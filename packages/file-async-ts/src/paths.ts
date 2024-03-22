import {
  lstat,
} from 'fs/promises';

import {
  Stats,
} from 'fs';
import { RequiredOptions } from './types';

/**
 * Given a path, returns information about the path.
 * * **@param path** The absolute path containing a file or directory
 * * **@param options** See {@link RequiredOptions}
 * * **@throws** - Errors if the path was not found and `options.required`
 *   is `true`.
 * * **@returns** A promise that resolves to information about the path or
 * `undefined` if the path was not found and `options.required` was `false` or
 * `undefined`.
 *
 *  **@example**
 * Get the stats of directory the typescript file is located in.
 *
 * ```typescript
 * const stats = await pathStats(__dirname);
 * expect(stats).toBeDefined();
 * ```
 */
export const pathStats = async (
  path: string,
  options?: RequiredOptions,
): Promise<Stats | undefined> => {
  try {
    return await lstat(path);
  } catch (err) {
    if (options?.required === true) {
      throw (err);
    }
  }
  return undefined;
};

/**
 * Given a path, returns `true` if the path resolves to a directory. False
 * if the path resolves to a file or the path wasn't found.
 * * **@param path** The absolute path containing a potential directory.
 * * **@param options** See {@link RequiredOptions}
 * * **@throws** - Errors if the path was not found and `options.required`
 *   is `true`.
 * * **@returns** A promise that resolves to true if the path is a directory
 * or false if the path is not a directory. Resolves to `false` if the path
 * was not found and `options.required` was `false` or `undefined`.
 *
 *  **@example**
 * Checks if the typescript file is located in a directory. ;-)
 *
 * ```typescript
 * const stats = await pathIsDir(__dirname);
 * expect(stats).toBeDefined();
 * ```
 */
export const pathIsDir = async (
  path: string,
  options?: RequiredOptions,
): Promise<boolean> => {
  const stat = await pathStats(path, options);
  if (stat !== undefined) {
    return stat.isDirectory();
  }
  return false;
};

/**
 * Given a path, returns `true` if the path resolves to a file. False
 * if the path resolves to a directory or the path wasn't found.
 * * **@param path** The absolute path containing a potential file.
 * * **@param options** See {@link RequiredOptions}
 * * **@throws** - Errors if the path was not found and `options.required`
 *   is `true`.
 * * **@returns** A promise that resolves to true if the path is a file
 * or false if the path is not a file. Resolves to `false` if the path
 * was not found and `options.required` was `false` or `undefined`.
 *
 *  **@example**
 * Checks if the typescript file is located in a file. ;-)
 *
 * ```typescript
 * const stats = await pathIsFile(__dirname);
 * expect(stats).toBeDefined();
 * ```
 */
export const pathIsFile = async (
  path: string,
  options?: RequiredOptions,
): Promise<boolean> => {
  const stat = await pathStats(path, options);
  if (stat !== undefined) {
    return stat.isFile();
  }
  return false;
};

/**
 * Given a path, returns `true` if the paths exists (for both a file or
 * directory) and `false` if the path does not exist.
 * @param path The absolute path.
 * @returns A promise that resolves to true if the path exists
 * or false if the path does not exist.
 */
export const pathExists = async (
  path: string,
): Promise<boolean> => {
  const stat = await pathStats(path);
  return stat !== undefined;
};

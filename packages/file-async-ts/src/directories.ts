import {
  resolve,
  join,
} from 'node:path';

import {
  PathLike,
  RmDirOptions,
} from 'fs';

import {
  mkdir,
  rm,
  readdir,
} from 'fs/promises';

import {
  RequiredOptions,
} from './types';

import {
  pathExists,
  pathIsDir,
} from './paths';

/**
 * Given an absolute path, recursively creates the directory in that path.
 * * **@param path** The absolute path containing the directories to create.
 * * **@returns** A promise that when it resolves to true means the directory
 * was successfully created.
 */
export const dirCreate = async (
  path: string,
): Promise<boolean> => {
  await mkdir(path, {
    recursive: true,
  });
  return true;
};

/**
 * TODO: Documentation
 * @param rootDir
 * @param subDirectories
 * @returns
 */
export const dirsCreate = async (
  rootDir: string,
  subDirectories: string[],
): Promise<boolean> => {
  const root = resolve(rootDir);

  const createDirs = subDirectories.map(
    (subDir) => dirCreate(join(root, subDir)),
  );

  await Promise.all(createDirs);
  return true;
};

/**
 * Given an absolute or relative path, asynchronously returns all of the file
 * names in a directory.
 *
 * * **@param path** - The absolute or relative path to the file.
 *
 * * **@param [options]**
 *   * **[options.required=true]** - When `true` or `undefined`, when the
 *   directory is not found an exception is thrown. When `false`, no exception
 *   is thrown and `undefined` is returned.
 *
 * * **@throws** - Errors if the directory is not found when
 *   `options.required` is `true`.
 * * **@returns** - An array of file names.
 *
 * **@example**
 * Get the file names of all files in a given directory.
 *
 * ```typescript
 * import {
 *   dirRead
 * } from '@sqlpm/file-ts';
 *
 * (async () => {
 *   const files: string[] | undefined = await dirRead(__dirname);
 *   expect(files?.length).toBeGreaterThan(0);
 * })();
 * ```
*/
export const dirRead = async (
  path: PathLike,
  options?: RequiredOptions,
): Promise<string[] | undefined> => {
  try {
    return await readdir(path);
  } catch (err) {
    if (undefined === options?.required || options.required) {
      throw (err);
    }
  }
  return undefined;
};

export const dirIsEmpty = async (
  path: PathLike,
  options?: RequiredOptions,
): Promise<boolean> => {
  const opts = options || { required: false };
  try {
    const files = await dirRead(path, opts);
    if (files === undefined || files?.length > 0) {
      return false;
    }
  } catch (err) {
    if (undefined === options?.required || options.required) {
      throw (err);
    }
  }
  return true;
};

export interface DirRemoveOptions {
  recursive: boolean
}

/**
 * Given an absolute path, removes an empty directory.
 * @param path The absolute path to the directory
 */
export const dirRemove = async (
  path: string,
  options?: DirRemoveOptions & RequiredOptions,
): Promise<boolean> => {
  // The new rm requires recursive to be true if we are removing a directory.
  // However, in some cases we don't want to remove an empty directory.
  // The options provided are checked to make sure the user explicitly
  // calls remove recursively

  // TODO: Testing
  const required = !!(options && options.required === true);

  const exists = await pathExists(path);

  if (exists === false && required === false) {
    return false;
  }

  if (
    options?.recursive === true
      || (await pathIsDir(path) && await dirIsEmpty(path))
  ) {
    // force should start out false. If required is set to false, then we
    // should not error if the directory is not found. If it is set to true,
    // the we should error out if the folder is not found.
    const force = (options !== undefined && options.required !== undefined)
      ? !options.required : false;

    // rm always requires recursive if the thing we are removing is a folder
    // However, for dirRemove, we only want to delete recursively if we pass
    // recursive=true.
    await rm(path, { recursive: true, force });
    return true;
  }

  return false;
};

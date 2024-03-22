import {
  fileContentDetailStr,
  ReadOptions,
} from '@sqlpm/file-async-ts';

import {
  parseJson, VerifySignature,
} from '@sqlpm/parse-json-ts';

import {
  PkgJSONSchemaExt,
  NodePackageContentSource,
} from './index';

/**
 * Loads, verifies and returns the contents of a node package file
 * (such as package.json) in a {@link NodePackageContentSource}.
 * * **@param path** - The file path, including the file name, to a node package
 * file (such as `package.json`).
 * * **@param [options.required]** When true or undefined, an exception is
 *   thrown if the file is not found.
 * * **@returns** The verified contents and location of the node package in a
 * * **@throws** - An error is thrown if the file is not found and
 *  `options.required` was set to true.
 * in a {@link NodePackageContentSource}.
 *
 * **@example**
 * Load and verify a package.json file.
 *
 *
 * ```typescript
 * import {
 *   join,
 *   dirname,
 * } from 'node:path';
 *
 * import {
 *   loadNodePackage,
 *   NodePackageContentSource,
 * } from '../src/index';
 *
 *
 * const dir = join(dirname(__dirname), 'package.json');
 * const projConfig: NodePackageContentSource | undefined =
 *   await loadNodePackage(dir);
 * expect(projConfig).toBeDefined();
 *
 * expect(projConfig?.sourcePath)
 *   .toEqual(join(dirname(__dirname), 'package.json'));
 * expect(projConfig?.content.name).toBeDefined();
 * expect(projConfig?.content.version).toBeDefined();
 * ```
 */
export const loadNodePackage = async (
  path: string,
  options?: ReadOptions,
): Promise<NodePackageContentSource | undefined> => {
  // We are using closure so we can provide a more useful error message.
  const verifyJson: VerifySignature = (
    obj: object,
  ): true => {
    if ('name' in obj && 'version' in obj) {
      return true;
    }
    throw Error(`All node project files (such as package.json) that are within the scope of '${path}' must have a name and version.`);
  };

  const fileDetail = await fileContentDetailStr(
    path,
    options,
  );

  if (fileDetail) {
    const contentObj = parseJson<PkgJSONSchemaExt>(fileDetail.content, {
      verify: verifyJson,
    });

    return {
      sourcePath: fileDetail.sourcePath,
      content: contentObj,
    };
  }
  return undefined;
};

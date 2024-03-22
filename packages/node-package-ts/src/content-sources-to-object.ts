import {
  ContentSources,
} from '@sqlpm/file-async-ts';

import {
  ContentSourceObject,
} from './types';

/**
 * Converts an array of ContentSources to a key/value object where the key is
 * the source to the package.json file and the value is the contents of the
 * package itself.
 * * **@param contentSources** An array of {@link ContentSources<ContentType>}
 * * **@returns** An object whose key is the source (file path for example) and
 * the value is the content (of a file for example).
 *
 *
 * **@example**
 * Converting Array of Content Sources to an Object
 *
 * ```typescript
 * import {
 *   contentSourcesToObject,
 *   NodePackageContentSources,
 * } from '../src';
 *
 * const sources: NodePackageContentSources = [
 *   {
 *     sourcePath: '/some/path/package.json',
 *     content: {
 *       name: 'someName',
 *       version: '0.0.0',
 *     },
 *   },
 * ];
 * const sourceAsObj = contentSourcesToObject(sources);
 * expect(sourceAsObj).toEqual({
 *   '/some/path/package.json': { name: 'someName', version: '0.0.0' },
 * });
 * ```
 */
export const contentSourcesToObject = <ContentType>(
  contentSources: ContentSources<ContentType>,
): ContentSourceObject<ContentType> => {
  const result: ContentSourceObject<ContentType> = {};

  for (const content of contentSources) {
    // TODO: It might be possible for the content to already exist
    // in the object. Not sure yet what to do in this case. Maybe provide a
    // callback for the user to handle the potential conflict.
    // if (result.sourcePath in result) {
    //  // do warning
    // }
    result[content.sourcePath] = content.content;
  }
  return result;
};

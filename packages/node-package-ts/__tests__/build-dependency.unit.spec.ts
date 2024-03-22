import {
  join,
  sep as separator,
} from 'node:path';

import {
  buildDependency,
} from '../src/index';

describe('build', () => {
  describe('buildDependency', () => {
    it('should successfully build a dependency', async () => {
      const nodePackage = await buildDependency(
        __dirname,
      );

      expect(nodePackage?.source).toEqual({
        absolutePath: join(process.cwd(), 'packages', 'node-package-ts'),
        fileName: 'package.json',
      });

      const packageDetails = nodePackage?.package;

      expect(packageDetails?.name).toEqual('@sqlpm/node-package-ts');

      // It needs to be an absolute version: not something like ^1.4.6
      expect(packageDetails?.version).not.toMatch('^');

      const pkgDependencies = packageDetails?.dependencies;

      expect(pkgDependencies?.length).toBeGreaterThan(1);

      if (undefined !== pkgDependencies) {
        for (const dependency of pkgDependencies) {
          // version should have been resolved.
          expect(dependency.package.version).not.toEqual('unknown');
        }
      }
    });

    it(`should return undefined if no valid
      directory name is provided`, async () => {
      await expect(buildDependency(separator))
        .rejects
        .toThrow(`Unable to build package dependencies because a 'package.json' file was not found at '${separator}'.`);
    });
  });
});

import {
  DatabasePlatform,
} from '@sqlpm/types-ts';

import {
  NodePackage,
  NodePackageContentSource,
  nodePackageFromSource,
} from '../src/index';

describe('nodePackageFromSource', () => {
  describe('no dependencies', () => {
    it(`should return a single {@link NodePackage} with
      no dependencies`, () => {
      const source: NodePackageContentSource = {
        sourcePath: '/some/package.json',
        content: {
          name: '@sqlpm/types',
          version: '0.0.1',
        },
      };

      const nodePackage: NodePackage = nodePackageFromSource(source);
      expect(nodePackage).toEqual({
        source: { absolutePath: '/some', fileName: 'package.json' },
        package: { name: '@sqlpm/types', version: '0.0.1', dependencies: [] },
      });
    });

    // TODO: Should we error out if an empty sourcePath is provided?
    it(`should return a single {@link NodePackage} with
      no dependencies and empty sourcePath`, () => {
      const source: NodePackageContentSource = {
        sourcePath: '',
        content: {
          name: '@sqlpm/types',
          version: '0.0.2',
        },
      };

      const nodePackage: NodePackage = nodePackageFromSource(source);
      expect(nodePackage).toEqual({
        source: { absolutePath: '.', fileName: '' },
        package: { name: '@sqlpm/types', version: '0.0.2', dependencies: [] },
      });
    });
  });

  describe('dependencies', () => {
    it(`should return a single {@link NodePackage} with
      dependencies`, () => {
      const source: NodePackageContentSource = {
        sourcePath: '/some/package.json',
        content: {
          name: '@sqlpm/types',
          version: '0.0.3',
          dependencies: {
            '@sqlpm/types': '^0.0.4',
          },
        },
      };

      const nodePackage: NodePackage = nodePackageFromSource(source);
      expect(nodePackage).toEqual({
        source: { absolutePath: '/some', fileName: 'package.json' },
        package: {
          name: '@sqlpm/types',
          version: '0.0.3',
          dependencies: [
            {
              package: { name: '@sqlpm/types', version: 'unknown', dependencies: [] },
            },
          ],
        },
      });
    });

    it(`should return a single {@link NodePackage} with
      dependencies and filter`, () => {
      const source: NodePackageContentSource = {
        sourcePath: '/some/package.json',
        content: {
          name: '@sqlpm/types',
          version: '0.0.5',
          dependencies: {
            '@sqlpm/types': '^0.0.6',
          },
        },
      };

      const nodePackage: NodePackage = nodePackageFromSource(
        source,
        { exclude: /^@sqlpm\/[\S]/ },
      );
      expect(nodePackage).toEqual({
        source: { absolutePath: '/some', fileName: 'package.json' },
        package: {
          name: '@sqlpm/types',
          version: '0.0.5',
          dependencies: [],
        },
      });
    });

    it(`should return pull out the database property if
      one is provided`, () => {
      const source: NodePackageContentSource = {
        sourcePath: '/some/package.json',
        content: {
          name: '@sqlpm/types',
          version: '0.0.8',
          dependencies: {
            '@sqlpm/types': '^0.0.9',
          },
          database: {
            platform: DatabasePlatform.Postgresql,
          },
        },
      };

      const nodePackage: NodePackage = nodePackageFromSource(
        source,
        { exclude: /^@sqlpm\/[\S]/ },
      );
      expect(nodePackage).toEqual({
        source: { absolutePath: '/some', fileName: 'package.json' },
        package: {
          name: '@sqlpm/types',
          version: '0.0.8',
          dependencies: [],
          database: {
            platform: 'postgresql',
          },
        },
      });
    });
  });
});

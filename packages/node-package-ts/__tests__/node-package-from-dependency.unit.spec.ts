import {
  Dependency,
} from '@schemastore/package';

import {
  nodePackagesFromDependency,
} from '../src/index';

import {
  NodePackages,
} from '../src/types';

describe('nodePackagesFromDependency', () => {
  it(`should return an empty array when the node package 
    has no dependencies`, () => {
    const dependencies: NodePackages | undefined = nodePackagesFromDependency(
      undefined,
    );
    expect(dependencies).toEqual([]);
  });

  it(`should return an empty array when the node package 
    has a dependencies object but no dependencies`, () => {
    const dependencies: NodePackages | undefined = nodePackagesFromDependency(
      {},
    );
    expect(dependencies).toEqual([]);
  });

  it(`should convert a Dependency object to an array
    of NodePackages`, () => {
    const packageDependencies: Dependency = {
      '@schemastore/package': '^0.0.6',
      '@sqlpm/file-async-ts': '^1.0.1',
    };

    const dependencies: NodePackages | undefined = nodePackagesFromDependency(
      packageDependencies,
    );
    expect(dependencies).toEqual([
      {
        package: {
          dependencies: [],
          name: '@schemastore/package',
          version: 'unknown',
        },
      },
      {
        package: {
          dependencies: [],
          name: '@sqlpm/file-async-ts',
          version: 'unknown',
        },
      },
    ]);
  });
});

import {
  filterDependencies, NodePackages,
} from '../src/index';

describe('filterDependencies', () => {
  const nodeDependencies: NodePackages = [
    { package: { name: '@schemastore/package', version: '0.0.6', dependencies: [] } },
    { package: { name: 'sqlpm', version: '100.45.3', dependencies: [] } },
    { package: { name: '@sqlpm/file-async-ts', version: '1.3.0', dependencies: [] } },
  ];

  it('should return an empty array when no dependencies are provided', () => {
    const dependencies: NodePackages = filterDependencies(
      undefined,
    );
    expect(dependencies).toEqual([]);
  });

  it(`should filter nothing when no filters are provided
    and make a deep copy of the original dependencies`, () => {
    const dependencies: NodePackages = filterDependencies(
      nodeDependencies,
    );
    expect(dependencies).toEqual([
      {
        package: {
          name: '@schemastore/package',
          version: '0.0.6',
          dependencies: [],
        },
      },
      {
        package: {
          name: 'sqlpm',
          version: '100.45.3',
          dependencies: [],
        },
      },
      {
        package: {
          name: '@sqlpm/file-async-ts',
          version: '1.3.0',
          dependencies: [],
        },
      },
    ]);

    dependencies[0].package.name = 'edited';
    expect(nodeDependencies[0].package.name)
      .toEqual('@schemastore/package');
  });

  describe('include filtering', () => {
    it(`should support inclusive filtering using a single filter:
    only returning those dependencies that match the filter.`, () => {
      const filteredDependencies = filterDependencies(
        nodeDependencies,
        { include: [/^@sqlpm\/[\S]/] },
      );

      expect(filteredDependencies.length).toEqual(1);
      expect(filteredDependencies[0].package.name)
        .toEqual('@sqlpm/file-async-ts');
    });

    it(`should support inclusive filtering using an array of filters:
    only returning those dependencies that match the filter.`, () => {
      const filteredDependencies = filterDependencies(
        nodeDependencies,
        { include: [/^@sqlpm\/[\S]/] },
      );
      expect(filteredDependencies.length).toEqual(1);
      expect(filteredDependencies[0].package.name)
        .toEqual('@sqlpm/file-async-ts');
    });
  });

  describe('exclude filtering', () => {
    it(`should support exclusive filtering using a single filter:
    only returning those dependencies that match the exclude filter.`, () => {
      const filteredDependencies = filterDependencies(
        nodeDependencies,
        { exclude: /^@sqlpm\/[\S]/ },
      );
      expect(filteredDependencies.length).toEqual(2);
      expect(filteredDependencies[0].package.name)
        .toEqual('@schemastore/package');
    });

    it(`should support exclusive filtering using an array of filter:
    only returning those dependencies that match the exclude filter.`, () => {
      const filteredDependencies = filterDependencies(
        nodeDependencies,
        { exclude: [/^@sqlpm\/[\S]/, /^@schemastore\/[\S]/] },
      );
      expect(filteredDependencies.length).toEqual(1);
      expect(filteredDependencies[0].package.name)
        .toEqual('sqlpm');
    });
  });

  describe('exclude and include filtering', () => {
    it(`should support exclusive and inclusive filtering using a single filter:
    only returning those dependencies that match the exclude filter.`, () => {
      const filteredDependencies = filterDependencies(
        nodeDependencies,
        {
          exclude: /^@sqlpm\/[\S]/,
          include: /^@sqlpm\/[\S]/,
        },
      );
      expect(filteredDependencies.length).toEqual(0);
    });
  });
});

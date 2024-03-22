# **@sqlpm/node-package-ts**

`@sqlpm/node-package-ts` is a typescript library that returns a node package dependency tree of all dependent packages: even taking into consideration yarn workspaces.

This library is not a packager resolver.

**README:** See [How to Use This Library](https://github.com/erichosick/sqlpm#how-to-use-these-libraries) to learn how to enable transpilation for local development or tools like [jest](https://jestjs.io/) or [ts-node](https://www.npmjs.com/package/ts-node) won't work.

## Features

* 100% typescript.
* functions
  * **buildDependency** - Builds a node package dependency tree.
  * **filterDependencies** - Include or exclude [package dependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#dependencies) filtering on [package name](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#name).
  * **nodePackageFromSource** - Converts `package.json` to an easy to use data structure, providing filtering of `dependencies` as needed.

## Usage

## **buildDependency** - Build A Dependency Tree From a Root Node Package

Builds a node package dependency tree starting at the child path.

* **@param childPath** - The starting path of the dependency tree.
* **@param [options]** - See **{@link FilterOptions}**,
  **{@link MessagingOptions}**
* **@throws** - Errors if the `childPath` can not be resolved.
* **@returns** A node package dependency tree starting at the `childPath`
provided.
**@example**
Get package dependency of the current directory

```typescript
import {
  buildDependency
} from '@sqlpm/node-package-ts';
const nodePackage = await buildDependency(__dirname);
expect(nodePackage?.source?.fileName).toEqual('package.json');
```

## **contentSourcesToObject** - Convert a ContentSource Into And Object

Converts an array of ContentSources to a key/value object where the key is
the source to the package.json file and the value is the contents of the
package itself.

* **@param contentSources** An array of {@link ContentSources<ContentType>}
* **@returns** An object whose key is the source (file path for example) and
the value is the content (of a file for example).
**@example**
Converting Array of Content Sources to an Object

```typescript
import {
  contentSourcesToObject,
  NodePackageContentSources,
} from '../src';
const sources: NodePackageContentSources = [
  {
    sourcePath: '/some/path/package.json',
    content: {
      name: 'someName',
      version: '0.0.0',
    },
  },
];
const sourceAsObj = contentSourcesToObject(sources);
expect(sourceAsObj).toEqual({
  '/some/path/package.json': { name: 'someName', version: '0.0.0' },
});
```

## **filterDependencies** - Filter Package Dependencies

Given an array of Node Package dependencies (package.json.dependencies),
returns a new array of package dependencies filtered by include and exclude
regular expressions against the node package name property.

* **@param dependencies** - The array of package dependencies as defined
by package.json.dependencies.
* **@param options**
  * **[options.include]** - When provided, a filter is applied to include
dependencies that match the regular expression.
  * **[options.exclude]** - When provided, a filter is applied to remove
dependencies that match the regular expression.
@returns The array of package dependencies after they have been filtered.
**@example**
Return file meta data and content details.

```typescript
import {
  filteredDependencies
} from '@sqlpm/node-package-ts';
const nodeDependencies = [
  { package: { name: 'package', version: '^0.0.6' } },
  { package: { name: '@sqlpm/file-async-ts', version: '^1.3.0' } },
];
const filteredDependencies = filterDependencies(
  nodeDependencies,
  { include: [/^@sqlpm\/[\S]/] },
);
expect(filteredDependencies.length).toEqual(1);
```

## **loadNodePackage** - Load and Verify a 'package.json' File

Loads, verifies and returns the contents of a node package file
(such as package.json) in a {@link NodePackageContentSource}.

* **@param path** - The file path, including the file name, to a node package
file (such as `package.json`).
* **@param [options.required]** When true or undefined, an exception is
  thrown if the file is not found.
* **@returns** The verified contents and location of the node package in a
* **@throws** - An error is thrown if the file is not found and
 `options.required` was set to true.
in a {@link NodePackageContentSource}.
**@example**
Load and verify a package.json file.

```typescript
import {
  join,
  dirname,
} from 'node:path';
import {
  loadNodePackage,
  NodePackageContentSource,
} from '../src/index';
const dir = join(dirname(__dirname), 'package.json');
const projConfig: NodePackageContentSource | undefined = await loadNodePackage(dir);
expect(projConfig).toBeDefined();
expect(projConfig?.sourcePath)
  .toEqual(join(dirname(__dirname), 'package.json'));
expect(projConfig?.content.name).toBeDefined();
expect(projConfig?.content.version).toBeDefined();
```

## **nodePackagesFromDependency** - Convert a Node Package Dependency to an Array Of NodePackages

Given a {@link Dependency} as defined in package.json, converts the
object key/value representation of { packageName: packageVersion } into
an array of {@link NodePackage}.

**@remarks**
For dependent packages, the version is marked as 'unknown' because the
actual package may have a different version than the version defined in
package.json

**@param dependencies** - The dependencies object as defined by
[package dependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#dependencies).
Also see {@link Dependency}.
@returns An array of {@link NodePackage}. If no dependencies were found,
an empty array is returned.
**@example**

```typescript
import {
  nodePackagesFromDependency
} from '@sqlpm/node-package-ts';
const packageDependencies: Dependency = {
  '@schemastore/package': '^0.0.6',
};
const dependencies: NodePackages = nodePackagesFromDependency(
  packageDependencies,
);
expect(dependencies).toEqual([{
  package: {
    dependencies: [],
    name: '@schemastore/package',
    version: '^0.0.6',
  },
}]);
```

## **nodePackageFromSource** - Convert Node Package Data and Filter Depencencies

After loading a node package, convert the node package into an easy to
manipulate data object. During conversion, filter dependencies.
**@param contentSource** The source (file name) and package.json content.
**@returns A {@link NodePackage} with, optionally, filtered dependencies.
**@example**

```typescript
import {
  NodePackage,
  NodePackageContentSource,
  nodePackageFromSource,
} from '@sqlpm/node-package-ts'
const source: NodePackageContentSource = {
  sourcePath: '/some/package.json',
  content: {
    name: '@sqlpm/types',
    version: '^0.0.0',
    dependencies: {
      '@sqlpm/types': '^0.0.0',
    },
  },
};
const nodePackage: NodePackage = nodePackageFromSource(
  source,
  { exclude: /^@sqlpm\/[\S]/ },
);
expect(nodePackage).toEqual({
  source: {
    absolutePath: '/some',
    fileName: 'package.json'
  },
  package: {
    name: '@sqlpm/types',
    version: '^0.0.0',
    dependencies: [],
  },
});
```

## **projectConfiguration** -

The project's `package.json` and any parent `package.json` file may be used
to determine how a project is built and where modules are located. For
example, a parent `package.json` may contain a
[yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)
configuration.

* **@param childPath** - The absolute path to the child path containing
 the first `package.json` file.
* **@param [packageFileName=package.json]** - A node package file name
to use in place of `package.json`.
* **@throws** - An error is returned if any of the package.json files found
are invalid. An error is returned if childPath resolves to a file.
* **@returns** - An array of package.json objects: ordered as found from the
child package to the parent package.
Example usage:

```typescript
import {
  dirname,
} from 'node:path';
import {
  projectConfiguration,
} from '@sqlpm/loader';
(async () => {
  const dir = dirname(__dirname);
  const projConfig = await projectConfiguration(dir);
  expect(projConfig[0].content.name).toBeDefined();
})();
```

## Intent

* No Emitted Javascript - The intent is to import this typescript library into a typescript project: compiling to Javascript occurring within the project.

## <a name="runningpackage"></a>Running Typescript in node_modules

* `ts
* `jest`

## Development

See the [monorepo readme](https://www.github.com/erichosick/sqlpm).

## License

Licensed under MIT. See LICENSE.md.

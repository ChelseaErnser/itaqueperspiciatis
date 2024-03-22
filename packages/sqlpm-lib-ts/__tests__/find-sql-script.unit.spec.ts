import {
  join,
} from 'node:path';

import {
  loadNodePackage,
} from '@sqlpm/node-package-ts';

import {
  DatabasePlatform,
  DatabasePurpose,
  RunActionDirectory,
} from '@sqlpm/types-ts';

import {
  sqlFindScript,
} from '../src/index';

import {
  SqlToRun,
} from '../src/types';

describe('sqlpm', () => {
  // This test uses the example sqlpm project @sqlpm/sqlpm-example-postgresql.

  it(`should load @sqlpm/sqlpm-example-postgresql schema
    because the node-package-with-schema-dependency directory in the
    test-files directory has a package.json with a dependency on
    @sqlpm/sqlpm-example-postgresql.
    `, async () => {
    const testDir = join(
      __dirname,
      'test-files',
      'node-package-with-schema-dependency',
    );

    const sql: SqlToRun[] = await sqlFindScript(
      DatabasePurpose.Readwrite,
      DatabasePlatform.Postgresql,
      [
        RunActionDirectory.Prerun,
        RunActionDirectory.Run,
        RunActionDirectory.Postrun,
      ],
      undefined,
      testDir,
    );

    const examplePackage = await loadNodePackage(
      join(
        __dirname,
        '..',
        '..',
        '..',
        'schemas',
        'postgresql',
        'sqlpm-example',
        'package.json',
      ),
    );

    expect(sql).toEqual([
      {
        name: '@sqlpm/sqlpm-example-postgresql',
        runAction: 'prerun',
        version: `${examplePackage?.content.version}`,
        file: `${process.cwd()}/schemas/postgresql/sqlpm-example/readwrite/prerun/100_prerun.sql`,
      },
      {
        name: '@sqlpm/sqlpm-example-postgresql',
        runAction: 'run',
        version: `${examplePackage?.content.version}`,
        file: `${process.cwd()}/schemas/postgresql/sqlpm-example/readwrite/run/100_run.sql`,
      },
      {
        name: '@sqlpm/sqlpm-example-postgresql',
        runAction: 'postrun',
        version: `${examplePackage?.content.version}`,
        file: `${process.cwd()}/schemas/postgresql/sqlpm-example/readwrite/postrun/100_postrun.sql`,
      },
    ]);
  });

  it('should return an empty array if no schema was found', async () => {
    const testDir = join(
      __dirname,
      'test-files',
      'node-package-no-schema-dependency',
    );

    const sql: SqlToRun[] = await sqlFindScript(
      DatabasePurpose.Readwrite,
      DatabasePlatform.Postgresql,
      [
        RunActionDirectory.Prerun,
        RunActionDirectory.Run,
        RunActionDirectory.Postrun,
      ],
      undefined,
      testDir,
    );
    expect(sql).toEqual([]);
  });

  it('should error if no package.json file is found in the child path', async () => {
    await expect(sqlFindScript(
      DatabasePurpose.Readwrite,
      DatabasePlatform.Postgresql,
      [
        RunActionDirectory.Prerun,
        RunActionDirectory.Run,
        RunActionDirectory.Postrun,
      ],
      undefined,
      '/',
    )).rejects.toThrow('Unable to build package dependencies because a \'package.json\' file was not found at \'/\'.');
  });
});

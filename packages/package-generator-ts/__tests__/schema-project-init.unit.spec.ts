import {
  join,
} from 'node:path';

import {
  DatabasePlatform,
  DatabasePurpose,
  RunActionDirectory,
} from '@sqlpm/types-ts';

import {
  dirRemove,
  readFileString,
} from '@sqlpm/file-async-ts';

import {
  schemaProjectInit,
  sqlTemplateRun,
  sqlTemplate,
  readmeTemplate,
  projectPackageTemplate,
  licenseTemplate,
  packageDirectory,
  platformDirectory,
  purposeDirectory,
  actionDirectory,
} from '../src/index';

describe('schemaProjectInit', () => {
  it(`should create a complete project
    while not using defaults`, async () => {
    // NOTE: Changing the workspace name here is only for testing and
    // not recommended to do in production.
    const workspaceName = 'test-workspace01';
    const packageName = 'test-project';
    const description = 'A test package.';
    const author = 'The Author';
    const email = 'author@email.com';
    await schemaProjectInit(
      packageName,
      DatabasePlatform.Postgresql,
      description,
      author,
      email,
      [DatabasePurpose.Readwrite],
      [
        RunActionDirectory.Run,
        RunActionDirectory.Reset,
        RunActionDirectory.Test,
      ],
      workspaceName,
    );

    const platDir = platformDirectory(
      workspaceName,
      DatabasePlatform.Postgresql,
    );

    const packageDir = packageDirectory(platDir, packageName);
    const absolutePackageDir = join(process.cwd(), packageDir);
    const purposeDir = purposeDirectory(packageDir, DatabasePurpose.Readwrite);
    const absolutePurposeDir = join(process.cwd(), purposeDir);

    expect(await (readFileString(
      join(absolutePackageDir, 'README.md'),
    ))).toEqual(
      readmeTemplate(
        packageName,
        DatabasePlatform.Postgresql,
        description,
      ),
    );

    expect(await (readFileString(
      join(absolutePackageDir, 'package.json'),
    ))).toEqual(
      projectPackageTemplate(
        packageName,
        DatabasePlatform.Postgresql,
        description,
        author,
        email,
      ),
    );

    expect(await (readFileString(
      join(absolutePackageDir, 'LICENSE.md'),
    ))).toEqual(
      licenseTemplate(author),
    );

    const runActionDir = actionDirectory(
      absolutePurposeDir,
      RunActionDirectory.Run,
    );

    expect(await (readFileString(
      join(runActionDir, '100_run.sql'),
    ))).toEqual(sqlTemplateRun(packageName, 'run', description));

    const testActionDir = actionDirectory(
      absolutePurposeDir,
      RunActionDirectory.Test,
    );

    expect(await (readFileString(
      join(testActionDir, '100_test.sql'),
    ))).toEqual(sqlTemplate(packageName, 'test'));

    const resetActionDir = actionDirectory(
      absolutePurposeDir,
      RunActionDirectory.Reset,
    );

    expect(await (readFileString(
      join(resetActionDir, '100_reset.sql'),
    ))).toEqual(sqlTemplate(packageName, 'reset'));

    await dirRemove(
      join(process.cwd(), workspaceName),
      {
        recursive: true,
      },
    );
  });

  it(`should create a complete project
    while using defaults`, async () => {
    // NOTE: Changing the workspace name here is only for testing and
    // not recommended to do in production.
    const packageName = 'test-project2';
    const description = 'A test package.';
    const workspaceName = 'schemas';
    const author = 'The Author';
    const email = 'author@email.com';
    const databasePlatform = 'test-platform';
    await schemaProjectInit(
      packageName,
      databasePlatform as DatabasePlatform.Postgresql,
      description,
      author,
      email,
    );

    const platDir = platformDirectory(
      workspaceName,
      // Let's not accidentally delete one of our actual platforms when
      // running tests
      databasePlatform as DatabasePlatform.Postgresql,
    );

    const packageDir = packageDirectory(platDir, packageName);
    const purposeDir = purposeDirectory(packageDir, DatabasePurpose.Readwrite);
    const absolutePurposeDir = join(process.cwd(), purposeDir);

    const prerunActionDir = actionDirectory(
      absolutePurposeDir,
      RunActionDirectory.Prerun,
    );

    expect(await (readFileString(
      join(prerunActionDir, '100_prerun.sql'),
    ))).toEqual(sqlTemplate(packageName, 'prerun'));

    const postrunActionDir = actionDirectory(
      absolutePurposeDir,
      RunActionDirectory.Postrun,
    );

    expect(await (readFileString(
      join(postrunActionDir, '100_postrun.sql'),
    ))).toEqual(sqlTemplate(packageName, 'postrun'));

    const resetActionDir = actionDirectory(
      absolutePurposeDir,
      RunActionDirectory.Reset,
    );

    expect(await (readFileString(
      join(resetActionDir, '100_reset.sql'),
    ))).toEqual(sqlTemplate(packageName, 'reset'));

    await dirRemove(
      join(process.cwd(), platDir),
      {
        recursive: true,
      },
    );
  });
});

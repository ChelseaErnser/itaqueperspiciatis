import {
  DatabasePlatform, DatabasePurpose, RunActionDirectory,
} from '@sqlpm/types-ts';

import {
  projectDirectories,
} from '../src/index';

describe('projectDirectories', () => {
  it(`should generate a default project directory
    given a schema and database purpose`, () => {
    const directories = projectDirectories(
      'persona',
      DatabasePlatform.Postgresql,
    );
    expect(directories).toEqual(
      [
        'schemas/postgresql/persona/readwrite/prerun',
        'schemas/postgresql/persona/readwrite/run',
        'schemas/postgresql/persona/readwrite/postrun',
        'schemas/postgresql/persona/readwrite/seed',
        'schemas/postgresql/persona/readwrite/test',
        'schemas/postgresql/persona/readwrite/reset',
      ],
    );
  });

  it('should generate a subset of folders', () => {
    const directories = projectDirectories(
      'persona',
      DatabasePlatform.Postgresql,
      [DatabasePurpose.Readonly, DatabasePurpose.Readwrite],
      [RunActionDirectory.Run, RunActionDirectory.Seed],
    );

    expect(directories).toEqual(
      [
        'schemas/postgresql/persona/readonly/run',
        'schemas/postgresql/persona/readonly/seed',
        'schemas/postgresql/persona/readwrite/run',
        'schemas/postgresql/persona/readwrite/seed',
      ],
    );
  });
});

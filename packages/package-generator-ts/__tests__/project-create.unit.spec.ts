import {
  DatabasePlatform,
  DatabasePurpose,
  RunActionDirectory,
} from '@sqlpm/types-ts';

import {
  actionDirectory,
  packageDirectory,
  platformDirectory,
  purposeDirectory,
} from '../src/index';

describe('schemaProjectInit', () => {
  it('should create the correct directories', () => {
    const platformDir = platformDirectory(
      'schemas',
      DatabasePlatform.Postgresql,
    );
    expect(platformDir).toEqual('schemas/postgresql');

    const packageDir = packageDirectory(platformDir, 'universal');
    expect(packageDir).toEqual('schemas/postgresql/universal');

    const purposeDir = purposeDirectory(packageDir, DatabasePurpose.Readwrite);
    expect(purposeDir).toEqual('schemas/postgresql/universal/readwrite');

    const actionDir = actionDirectory(purposeDir, RunActionDirectory.Test);
    expect(actionDir).toEqual('schemas/postgresql/universal/readwrite/test');
  });
});

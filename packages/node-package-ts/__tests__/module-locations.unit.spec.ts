import {
  dirname,
  join,
  sep as separator,
} from 'node:path';

import {
  moduleLocations,
  projectConfiguration,
} from '../src/index';

describe('moduleLocations', () => {
  it('should find all modules for this project', async () => {
    const dir = dirname(__dirname);
    const projConfig = await projectConfiguration(
      dir,
    );

    const modulesLocations = await moduleLocations(projConfig);
    expect(modulesLocations.length).toBeGreaterThanOrEqual(4);
  });

  it('should support an optional node package name', async () => {
    const dir = dirname(__dirname);
    const projConfig = await projectConfiguration(
      dir,
      'package.json',
    );

    const modulesLocations = await moduleLocations(projConfig);
    expect(modulesLocations.length).toBeGreaterThanOrEqual(4);
  });

  it(`should find no modules when the directory
    provided is empty`, async () => {
    const dir = join(separator, 'nosuchlocation');
    const projConfig = await projectConfiguration(dir);

    const modulesLocations = await moduleLocations(projConfig);
    expect(modulesLocations.length).toEqual(0);
  });
});

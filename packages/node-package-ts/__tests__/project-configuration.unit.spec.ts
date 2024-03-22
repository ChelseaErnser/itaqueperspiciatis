import {
  dirname,
} from 'node:path';

import {
  projectConfiguration,
} from '../src/index';

describe('projectConfiguration', () => {
  it('should find at least the two package.json files for this project', async () => {
    const dir = dirname(__dirname);
    const projConfig = await projectConfiguration(dir);

    expect(projConfig[0].content.name).toBeDefined();
    expect(projConfig[0].content.version).toBeDefined();
    expect(projConfig.length).toBeGreaterThanOrEqual(2);
  });
});

import {
  join,
} from 'node:path';

import {
  dirRead,
} from '../src/index';

describe('dirRead', () => {
  it('should read a directory', async () => {
    const files: string[] | undefined = await dirRead(__dirname);
    expect(files?.length).toBeGreaterThan(0);
  });

  it(`should NOT error if the directory is not found and
  required = false`, async () => {
    const dir = join(__dirname, 'does_not_exist');
    const content: string[] | undefined = await dirRead(dir, { required: false });
    expect(content).toBeUndefined();
  });

  it(`should error if a directory is not found and the
  required option is true`, async () => {
    const dir = join(__dirname, 'does_not_exist');
    await expect(dirRead(dir))
      .rejects
      .toThrow(/^ENOENT: no such file or directory, scandir '[\S]*__tests__\/does_not_exist'$/);
  });
});

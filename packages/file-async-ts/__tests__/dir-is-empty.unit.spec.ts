import { join } from 'node:path';
import {
  dirIsEmpty,
  dirCreate,
  dirRemove,
} from '../src/index';

describe('dirIsEmpty', () => {
  it('should be false when a directory is not empty', async () => {
    const isEmpty = await dirIsEmpty(__dirname);
    expect(isEmpty).toEqual(false);
  });

  it('should be true when a directory is empty', async () => {
    const dir = join(__dirname, 'empty-directory');
    await dirCreate(dir);
    const isEmpty = await dirIsEmpty(dir);
    expect(isEmpty).toEqual(true);

    // cleanup test
    await dirRemove(dir);
  });

  it('should be false if the directory does not exist', async () => {
    const dir = join(__dirname, 'no-such-directory');
    const isEmpty = await dirIsEmpty(dir);
    expect(isEmpty).toEqual(false);
  });

  it(`should error if the path is not found and the status is 
  required`, async () => {
    await expect(dirIsEmpty(
      join(__dirname, 'no-such-directory2'),
      { required: true },
    ))
      .rejects
      .toThrow(
        /^ENOENT: no such file or directory, scandir '[\S]*no-such-directory2'$/,
      );
  });
});

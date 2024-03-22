import {
  join,
} from 'node:path';
import {
  pathExists,
} from '../src/index';

describe('dirIsEmpty', () => {
  it('should be true when a path exists', async () => {
    const exists = await pathExists(__dirname);
    expect(exists).toEqual(true);
  });

  it('should be false if the path does not exist', async () => {
    const dir = join(__dirname, 'no-such-directory');
    const exists = await pathExists(dir);
    expect(exists).toEqual(false);
  });
});

import {
  join,
} from 'node:path';

import {
  dirCreate,
  dirRemove,
  dirsCreate,
  fileExists,
} from '../src/index';

describe('mutate directories', () => {
  describe('dirRemove', () => {
    it(`should not error if a directory is removed that
      does not already exists`, async () => {
      const dir = join(__dirname, 'nodir');
      expect(await fileExists(dir)).toEqual(false);
      expect(await dirRemove(dir)).toEqual(false);
    });

    it(`should support recursively deleting a directory if
      the recursive option is provided`, async () => {
      const dir = join(__dirname, 'dir-test2');
      const subDir = join(dir, 'not-empty');

      await dirRemove(subDir);
      await dirRemove(dir);

      await dirCreate(subDir); // recursively create the directory

      const removed = await dirRemove(dir, { recursive: false });
      expect(removed).toEqual(false);

      expect(await dirRemove(dir, { recursive: true })).toEqual(true);
    });

    it(`should error if an attempt is made to remove a directory that
      has items in it`, async () => {
      const dir = join(__dirname, 'dir-test3');
      const subDir = join(dir, 'not-empty');

      await dirRemove(subDir);
      await dirRemove(dir);

      await dirCreate(subDir); // recursively create the directory

      await expect(await dirRemove(dir)).toEqual(false);

      await dirRemove(subDir);
      await dirRemove(dir);
    });
  });

  describe('dirCreate', () => {
    it(`should not create or error if the directory
      already exists`, async () => {
      expect(await fileExists(__dirname)).toEqual(true);
      await dirCreate(__dirname);
    });

    it(`should create the directory if it 
      does not exist`, async () => {
      const dir = join(__dirname, 'dir-test4');

      // clean up the test
      await dirRemove(dir);
      expect(await fileExists(dir)).toEqual(false);
      expect(await dirCreate(dir)).toEqual(true);
      expect(await dirRemove(dir)).toEqual(true);
    });

    it(`should create the directory recursively if it 
      does not exist`, async () => {
      const dir01 = join(__dirname, 'dir-test5');
      const dir02 = join(dir01, 'deep');

      // clean up the test
      await dirRemove(dir02);
      await dirRemove(dir01);

      expect(await fileExists(dir02)).toEqual(false);
      expect(await dirCreate(dir02)).toEqual(true);

      // clean up the test
      await dirRemove(dir02);
      await dirRemove(dir01);
    });
  });

  describe('dirsCreate', () => {
    it(`should create multiple directories under
      a root directory`, async () => {
      const dir01 = join(__dirname, 'dir-test1');
      const runDir = join(dir01, 'run');
      const testDir = join(dir01, 'test');

      // clean up the test
      await dirRemove(runDir);
      await dirRemove(testDir);
      await dirRemove(dir01);

      expect(await fileExists(dir01)).toEqual(false);
      expect(await fileExists(runDir)).toEqual(false);
      expect(await fileExists(testDir)).toEqual(false);

      expect(await dirsCreate(dir01, ['run', 'test'])).toEqual(true);

      expect(await fileExists(runDir)).toEqual(true);
      expect(await fileExists(testDir)).toEqual(true);

      // clean up the test
      await dirRemove(runDir);
      await dirRemove(testDir);
      await dirRemove(dir01);
    });
  });
});

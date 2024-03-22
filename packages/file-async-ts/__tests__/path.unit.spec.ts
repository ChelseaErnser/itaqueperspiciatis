import { join } from 'node:path';
import {
  pathIsDir,
  pathIsFile,
  pathStats,
} from '../src/index';

describe('path', () => {
  describe('pathStat', () => {
    it('should return information about a path', async () => {
      const stats = await pathStats(__dirname);
      expect(stats).toBeDefined();
    });

    it('should return true when the path is not a directory', async () => {
      const isDir = await pathIsFile(join(__dirname, 'test-files', 'info.txt'));
      expect(isDir).toEqual(true);
    });

    it(`should return undefined if the path is not found
      and the status is not required`, async () => {
      const stats = await pathStats(join(__dirname, 'noSuchFile.txt'));
      expect(stats).toBeUndefined();
    });

    it(`should return undefined if the path is not found
      and the status is not required because options are empty`, async () => {
      const stats = await pathStats(
        join(__dirname, 'noSuchFile.txt'),
        {},
      );
      expect(stats).toBeUndefined();
    });

    it(`should error if the path is not found and the status is 
    required`, async () => {
      await expect(pathStats(
        join(__dirname, 'noSuchFile.txt'),
        { required: true },
      ))
        .rejects
        .toThrow(/^ENOENT: no such file or directory, lstat '[\S]*noSuchFile.txt'$/);
    });
  });

  describe('pathIsDir', () => {
    it('should return true when the path is a directory', async () => {
      const isDir = await pathIsDir(__dirname);
      expect(isDir).toEqual(true);
    });

    it('should return false when the path is not found', async () => {
      const isDir = await pathIsDir(join(__dirname, 'noSuchDir'));
      expect(isDir).toEqual(false);
    });

    it(`should error if the path is not found and the status is 
    required`, async () => {
      await expect(pathIsDir(
        join(__dirname, 'noSuchDir'),
        { required: true },
      ))
        .rejects
        .toThrow(/^ENOENT: no such file or directory, lstat '[\S]*noSuchDir'$/);
    });
  });

  describe('pathIsFile', () => {
    it('should return true when the path is a file', async () => {
      const isDir = await pathIsFile(join(__dirname, 'test-files', 'info.txt'));
      expect(isDir).toEqual(true);
    });

    it('should return false when the path is not a file', async () => {
      const isDir = await pathIsFile(__dirname);
      expect(isDir).toEqual(false);
    });

    it('should return false when the path is not found', async () => {
      const isDir = await pathIsFile(join(__dirname, 'noSuchFile'));
      expect(isDir).toEqual(false);
    });

    it(`should error if the path is not found and the status is 
    required`, async () => {
      await expect(pathIsFile(
        join(__dirname, 'noSuchFile'),
        { required: true },
      ))
        .rejects
        .toThrow(
          /^ENOENT: no such file or directory, lstat '[\S]*noSuchFile'$/,
        );
    });
  });
});

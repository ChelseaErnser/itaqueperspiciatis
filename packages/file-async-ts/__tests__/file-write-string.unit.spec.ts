import {
  join,
} from 'node:path';

import {
  fileWrite,
  fileRemove,
  readFileString,
} from '../src/index';

describe('file mutate', () => {
  describe('fileRemove', () => {
    it(`should only return false if fileRemove
      is called on a file that does not exist`, async () => {
      const file = join(__dirname, 'somefile_does_not_exist.txt');
      expect(await fileRemove(file)).toEqual(false);
    });

    it(`should remove a file and return true
      on a file that exists`, async () => {
      const file = join(__dirname, 'test_file.txt');

      // clean up
      await fileRemove(file);
      await fileWrite(file, 'test');

      expect(await fileRemove(file)).toEqual(true);
    });
  });

  describe('fileWrite', () => {
    it('should write to a file one one does not exist', async () => {
      const file = join(__dirname, 'somefile.txt');
      const content = 'Hello. This is some text.';

      // clean up
      await fileRemove(file);

      await fileWrite(file, content);

      const result = await readFileString(file);
      expect(result).toEqual(content);

      // clean up
      await fileRemove(file);
    });

    it(`should not append or overwrite a file
    that already exists`, async () => {
      const file = join(__dirname, 'somefile2.txt');
      const content = 'Hello. This is some text.';
      const content2 = 'Should not write this.';

      // clean up
      await fileRemove(file);

      await fileWrite(file, content);

      const result = await readFileString(file);
      expect(result).toEqual(content);
      expect(await fileWrite(file, content2)).toEqual(false);

      // clean up
      await fileRemove(file);
    });
  });
});

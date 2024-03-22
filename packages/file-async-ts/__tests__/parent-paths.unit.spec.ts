import {
  parentPaths,
} from '../src/index';

describe('parentPaths', () => {
  describe('POSIX', () => {
    it(`should return all all possible parent paths 
      including the child path`, async () => {
      const result: string[] = parentPaths('/cat/mouse');
      expect(result).toEqual([
        '/cat/mouse',
        '/cat',
        '/',
      ]);
    });

    it(`should normalize the child path before return all all possible
    parent paths  including the child path`, async () => {
      const result: string[] = parentPaths('/cat/../and/mouse');
      expect(result).toEqual(
        [
          '/and/mouse',
          '/and',
          '/',
        ],
      );
    });

    it('should expect an absolute path', () => {
      expect(() => { parentPaths('../cat'); })
        .toThrowError('The path \'../cat\' must be an absolute path.');
    });

    it('should support limiting the depth of a path', () => {
      const paths = parentPaths('/a/b/c/d', { depth: 2 });
      expect(paths).toEqual(['/a/b/c/d', '/a/b/c']);
    });
  });
});

import {
  runActionDirectoryAsArray,
} from '../src/index';

describe('runActionDirectoryAsArray', () => {
  it('should return all the run actions as an array', () => {
    const result: string[] = runActionDirectoryAsArray();
    expect(result).toEqual(
      ['prerun', 'run', 'postrun', 'seed', 'test', 'reset'],
    );
  });
});

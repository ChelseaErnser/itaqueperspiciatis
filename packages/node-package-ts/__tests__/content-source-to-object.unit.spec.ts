import {
  contentSourcesToObject,
  NodePackageContentSources,
} from '../src';

describe('contentSourcesToObject', () => {
  it(`should return an empty array of sources to an object that
     has no properties.`, () => {
    const sources: NodePackageContentSources = [];
    const sourceAsObj = contentSourcesToObject(sources);
    expect(sourceAsObj).toEqual({});
  });

  it(`should return an empty array of sources to an object that
     has no properties.`, () => {
    const sources: NodePackageContentSources = [
      {
        sourcePath: '/some/path/package.json',
        content: {
          name: 'someName',
          version: '0.0.0',
        },
      },
    ];
    const sourceAsObj = contentSourcesToObject(sources);
    expect(sourceAsObj).toEqual({
      '/some/path/package.json': { name: 'someName', version: '0.0.0' },
    });
  });
});

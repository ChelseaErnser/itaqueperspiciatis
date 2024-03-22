// Integration and Unit Tests

import type {
  Config,
} from 'jest';

const integrationTestConfig: Config = {
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
    'node',
    'yaml',
    'yml',
    'sql',
  ],
  preset: 'ts-jest',

  // Let's ignoring 'jest.*.config.ts' because if we don't, edits to this file
  // cause jest to run (during watch mode) giving the impression that changes in
  // this file will be applied on the next run: which they aren't.
  watchPathIgnorePatterns: ['sqlpm-test', 'jest.*.config.ts'],

  // Warning: fakeTimers requires the node environment. They don't work in
  // the jsdom environment.
  testEnvironment: 'node',
  testMatch: [
    '**/*.postgresql.spec.ts',
  ],
  collectCoverageFrom: [
    './packages/**/src/*.ts',
  ],

  // required by postgres library
  // see https://deltice.github.io/jest/docs/en/jest-object.html#jestusefaketimers
  fakeTimers: {
    enableGlobally: true,
  },
};

export default integrationTestConfig;

// Unit tests only

import type {
  Config,
} from 'jest';

const unitTestConfig: Config = {
  preset: 'ts-jest',

  // Let's ignoring 'jest.*.config.ts' because if we don't, edits to this file
  // cause jest to run (during watch mode) giving the impression that changes in
  // this file will be applied on the next run: which they aren't.
  watchPathIgnorePatterns: ['jest.*.config.ts'],

  testEnvironment: 'node',
  testMatch: [
    '**/*.unit.spec.ts',
    // Ignoring integration tests. Called out explicitly because anything
    // matched in testMatch is automatically ignored by the test coverage.
    '!**/*.integration.spec.ts',
    '!**/*.postgresql.spec.ts',
  ],
  collectCoverageFrom: [
    './packages/**/src/*.ts',
  ],
};

export default unitTestConfig;

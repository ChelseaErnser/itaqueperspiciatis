import type {
  Config,
} from '@jest/types';

export const fakeTimers = () => {
// required by postgres library
// see https://jestjs.io/docs/next/timer-mocks
  const useFakeOptions: Config.FakeTimersConfig = {
    advanceTimers: 20,
  };
  jest.useFakeTimers(useFakeOptions);
};

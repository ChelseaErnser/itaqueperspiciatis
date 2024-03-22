import {
  sqlTestPackage,
} from '../src';

import {
  fakeTimers,
} from '../src/fake-timers';

describe('sqlTestPackage', () => {
  fakeTimers();

  it('should test a package', async () => {
    await sqlTestPackage(__dirname, 'empty_database_test');
  });
});

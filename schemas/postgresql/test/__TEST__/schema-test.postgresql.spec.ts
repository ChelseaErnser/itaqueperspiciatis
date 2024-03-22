import {
  sqlTestPackage,
  fakeTimers,
} from '@sqlpm/sqlpm-lib-ts';

describe('test schema', () => {
  fakeTimers();
  it('should successfully test the test schema', async () => {
    // To keep generated sql packages around after the test, set
    // keepGeneratedSql to true: false by default
    await sqlTestPackage(__dirname, 'test_test');
  });
});

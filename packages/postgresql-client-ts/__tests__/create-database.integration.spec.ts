import {
  connectionBuild,
  databaseCreate,
  databaseDrop,
} from '../src/index';
import { fakeTimers } from './support/fake-timers';

describe('database mutation', () => {
  // using environment variables set when tests were called
  const validConnection = connectionBuild();

  describe('databaseDrop', () => {
    it(`should not error or drop a database that does
      not exist`, async () => {
      const result = await databaseDrop('test9000', validConnection);
      expect(result).toEqual(false);
    });

    it('should error when an invalid database name is provided', async () => {
      await expect(
        databaseDrop('invalid-database-name-drop', validConnection),
      ).rejects.toThrow('syntax error at or near "-"');
    });
  });

  describe('databaseCreate', () => {
    fakeTimers();

    it(`should create a database given a valid connection
    to an existing`, async () => {
      // clean up any prior tests
      await databaseDrop('test2', validConnection);

      const dbCreated = await databaseCreate('test2', validConnection);
      expect(dbCreated).toEqual(true);

      // check the database was created by trying to drop it
      // also cleans up the test
      const dbDropped = await databaseDrop('test2', validConnection);
      expect(dbDropped).toEqual(true);
    });

    it(`should return false, and not error, when the
      database already exists`, async () => {
      // clean up any prior tests

      await databaseDrop('test3', validConnection);

      const dbCreated = await databaseCreate('test3', validConnection);
      expect(dbCreated).toEqual(true);

      // Trying it the 2nd time should return false
      const dbCreated2 = await databaseCreate('test3', validConnection);
      expect(dbCreated2).toEqual(false);

      // check the database was created by trying to drop it
      // also cleans up the test
      const dbDropped = await databaseDrop('test3', validConnection);
      expect(dbDropped).toEqual(true);
    });

    it('should error when an invalid database name is provided', async () => {
      await expect(
        databaseCreate('invalid-database-name-create', validConnection),
      ).rejects.toThrow('syntax error at or near "-"');
    });
  });
});

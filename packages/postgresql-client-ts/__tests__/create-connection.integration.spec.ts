// TODO: Decouple pino from the library
// import pino from 'pino';
// const logger = pino(pino.destination('/dev/null')); // pino null for testing

import {
  connectionOpen,
} from '../src/index';

import {
  fakeTimers,
} from './support/fake-timers';

describe('createConnection', () => {
  fakeTimers();

  describe('errors', () => {
    it('connection invalid: it should not find the host', async () => {
      const connection = {
        host: 'host', // host is not valid
        port: 12546,
        user: 'postgres',
        password: 'localpassword',
        dbname: 'postgres',
        schema: 'schema',
      };

      const sqlConnectionInvalid = connectionOpen(connection);

      let error: Error | null = null;
      try {
        await sqlConnectionInvalid`SELECT 1 as num;`;
      } catch (err: unknown) {
        // Note: err instance Of Error is false
        error = err as Error;
      } finally {
        sqlConnectionInvalid.end({ timeout: 1 });
      }
      expect(error?.message).toEqual('getaddrinfo ENOTFOUND host');
    });
  });

  describe('connect', () => {
    it(`connection valid using environment variables provided when
      this test was ran.`, async () => {
      const sql = connectionOpen();

      let selectResult;
      try {
        selectResult = await sql`SELECT 1 as num;`;
      } finally {
        await sql.end({ timeout: 1 });
      }

      expect(selectResult).toEqual([{ num: 1 }]);
    });
  });
});

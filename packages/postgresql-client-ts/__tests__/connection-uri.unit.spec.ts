// import pino from 'pino';

import {
  connectionBuild,
  connectionUri,
  connectionUriNoPwd,
} from '../src/index';

describe('connection', () => {
  describe('connectionUri', () => {
    it(`it should create a uri connection from connection
    options with no schema`, () => {
      const connection = connectionBuild({
        host: 'host2',
        port: 9999,
        user: 'user2',
        password: 'password2',
        dbname: 'database2',
      });

      expect(connectionUri(connection))
        .toEqual('postgresql://user2:password2@host2:9999/database2');
    });

    it(`it should create a uri connection from connection
    options when schema is provided`, () => {
      const connection = connectionBuild({
        host: 'host3',
        port: 9998,
        user: 'user3',
        password: 'password3',
        dbname: 'database3',
        schema: 'schema3',
      });

      expect(connectionUri(connection))
        .toEqual(
          'postgresql://user3:password3@host3:9998/database3?search_path=schema3',
        );
    });
  });

  describe('connectionUriNoPwd', () => {
    it('it should create a uri connection with password obfuscated', () => {
      const connection = connectionBuild({
        host: 'host4',
        port: 9997,
        user: 'user4',
        password: 'password4',
        dbname: 'database4',
        schema: 'schema4',
      });

      expect(connectionUriNoPwd(connection))
        .toEqual(
          'postgresql://user4:*****@host4:9997/database4?search_path=schema4',
        );
    });
  });
});

import {
  // createConnection,
  connectionBuild,
} from '../src/index';

describe('connectionBuild', () => {
  describe('errors', () => {
    it('it should throw an error when no required options are set', () => {
      delete process.env.PGHOST;
      delete process.env.PGPORT;
      delete process.env.PGUSER;
      delete process.env.PGPASSWORD;
      delete process.env.PGDATABASE;
      delete process.env.PGSCHEMA;

      expect(() => { connectionBuild(); })
        .toThrow(
          // eslint-disable-next-line max-len
          'Connection missing required options: host, user, password, database. Required options can be set with environment variables or via the connection parameter',
        );
    });

    it('it should an error when at least one option is missing', () => {
      // if the test is ran with variables, remove them
      delete process.env.PGHOST;
      delete process.env.PGPORT;
      delete process.env.PGUSER;
      delete process.env.PGPASSWORD;
      delete process.env.PGDATABASE;
      delete process.env.PGSCHEMA;

      expect(() => {
        connectionBuild({
          host: 'host',
          user: 'user',
          password: 'password',
        });
      }).toThrow(

        // eslint-disable-next-line max-len
        'Connection missing required options: database. Required options can be set with environment variables or via the connection parameter',
      );
    });
  });

  describe('from parameters', () => {
    it(`it should return the correct configuration when all options
    are set and no environment variables are provided`, () => {
      const connection = connectionBuild({
        host: 'host',
        port: 9855,
        user: 'user',
        password: 'password',
        dbname: 'database',
        schema: 'schema',
      });
      expect(connection).toEqual({
        host: 'host',
        port: 9855,
        user: 'user',
        password: 'password',
        dbname: 'database',
        schema: 'schema',
      });
    });

    it(`it should default port to 5432 and default schema to
    undefined (when no schema is provided)`, () => {
      const connection = connectionBuild({
        host: 'host',
        user: 'user',
        password: 'password',
        dbname: 'database',
      });

      expect(connection).toEqual({
        host: 'host',
        port: 5432,
        user: 'user',
        password: 'password',
        dbname: 'database',
        schema: undefined,
      });
    });
  });

  describe('from environment variables', () => {
    afterEach(() => {
      delete process.env.PGHOST;
      delete process.env.PGPORT;
      delete process.env.PGUSER;
      delete process.env.PGPASSWORD;
      delete process.env.PGDATABASE;
      delete process.env.PGSCHEMA;
    });

    it('it should use all options, overriding environment', () => {
      process.env.PGHOST = 'host2';
      process.env.PGPORT = '9999';
      process.env.PGUSER = 'user2';
      process.env.PGPASSWORD = 'password2';
      process.env.PGDATABASE = 'database2';
      process.env.PGSCHEMA = 'schema2';

      const connection = connectionBuild({
        host: 'host',
        port: 9854,
        user: 'user',
        password: 'password',
        dbname: 'database',
        schema: 'schema',
      });

      expect(connection).toEqual({
        host: 'host',
        port: 9854,
        user: 'user',
        password: 'password',
        dbname: 'database',
        schema: 'schema',
      });
    });
  });
});

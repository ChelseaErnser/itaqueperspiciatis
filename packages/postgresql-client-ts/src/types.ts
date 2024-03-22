import {
  MessagingOptions,
} from '@sqlpm/types-ts';

/**
 * Connection options. These options are based on the conventions described in
 * https://www.postgresql.org/docs/current/libpq-envars.html
 */
export interface Connection {
  /** The host for the connection. Example: localhost. The PGHOST environment
   * variable overrides this value.
    */
  host: string,

  /** The port for the connection. Defaults to 5432. The PGPORT environment
   * variable overrides this value.
   */
  port: number,

  /** The username for the connection. The PGUSER environment variable overrides
   *  this value.
  */
  user: string,

  /** A password for the connection. The PGPASSWORD environment variable
   * overrides this value.
   */
  password: string,

  /** The database name of the connection. The PGDATABASE environment variable
   * overrides this value.
   */
  dbname: string,

  /** An optional schema to default to in the database. The PGSCHEMA environment
   * variable overrides this value. Note: At the time of writing this code,
   * PGSCHEMA was not an official postgresql environment variable.
   */
  schema?: string | undefined

  /** FUTURE FEATURE: Add options and ssl configuration */
}

export interface PostgresNotice {
  [field: string]: string;
}

/**
 * Function signature for mutating a database. See {@link databaseCreate} and
 * {@link databaseDrop}
 * **@type**
 * * **@member {@link DatabaseMutateSignature.databaseName}**
 * * **@member {@link DatabaseMutateSignature.connection}**
 * * **@member {@link DatabaseMutateSignature.options}**
 */
export type DatabaseMutateSignature = (
  /**
   * The name of the database we are mutating (create/drop).
   */
  databaseName: string,

  /**
   * Connection information to the database. See {@link Connection}
   */
  connection: Connection,

  /**
   * Function call options. See {@link MessagingOptions}
   */
  options?: MessagingOptions,
) => Promise<boolean>;

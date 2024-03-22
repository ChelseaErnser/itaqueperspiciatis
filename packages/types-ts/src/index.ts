/**
 * Defines potential messaging/logging levels
 */
export type LogLevel =
  'error' |
  'warn' |
  'help' |
  'data' |
  'info' |
  'debug' |
  'prompt' |
  'verbose' |
  'input' |
  'silly' |
  'event';

/**
 * The start of a structured message for logging and events.
 * See [Structured Message Formats]https://medium.com/full-stack-architecture/structured-message-formats-thoughts-on-what-to-log-501306e916de
 * **@interface**
 * * **@member [{@link StructuredMessage.id}]**
 * * **@member {@link StructuredMessage.level}**
 * * **@member {@link StructuredMessage.message}**
 */
export interface StructuredMessage {

  /**
   * A unique id for the message. The id should be universally unique and
   * preferably sortable.
   */
  id?: string;

  /**
   * A log level enables a log message to be filtered based on the message's
   * importance.
   */
  level: LogLevel;

  /**
   * A simple human-readable message. The message is the final formatted
   * message requiring no further processing.
   */
  message: string;
}

/**
 * Function signature for {@link StructuredMessenger}.
 */

export type StructuredMessageSignature = (
  message: StructuredMessage
) => void;

/**
 *
 *
 * **@interface**
 * * **@member {@link StructuredMessenger.debug}**
 * * **@member {@link StructuredMessenger.error}**
 * * **@member {@link StructuredMessenger.info}**
 * * **@member {@link StructuredMessenger.warn}**
 *
 */
export interface StructuredMessenger {

  /**
   * Send a debug level message.
   */
  debug: (message: string) => void;

  /**
   * Send an error level message.
   */
  error: (message: string) => void;

  /**
   * Send an info level message.
   */
  info: (message: string) => void;

  /**
   * Send a warning (warn) level message.
   */
  warn: (message: string) => void;
}

/**
 * Options that are common between all functions.
 *
 * **@interface**
 * * **@member [{@link MessagingOptions.sendMsg}]**
 */
export interface MessagingOptions {

  /**
   * One or more ways of sending a message, event, log, etc. Call one of the
   * helper methods such as sendMsg.info.
   */
  sendMsg?: StructuredMessenger,
}

/**
 * Supported database platforms. The name of the database platform is also
 * the name of the directory for that platform. For postgresql sql script would
 * be in a directory {project_root}/schemas/postgresql/*
 *
 * **@remarks**
 * We intend to add 'sqlite' | 'mssql' | 'mysql' | 'mariadb' | 'snowflake'.
 *
 * **@remarks**
 * When adding a new DatabasePlatform, be sure to updated the root
 * package.json to include the new database platform schema directory.
 *
 * **@example**
 * Adding postgresql packages required the following update to `package.json`.
 * ```json
 * {
 *   // ...
 *   "workspaces": [
 *     "schemas/postgresql/*",
 *   ],
 * }
 * ```
 */
export enum DatabasePlatform {
  Postgresql = 'postgresql',
}

export const databasePlatformVerify = (
  value: string,
): boolean => Object.values<string>(DatabasePlatform).includes(value);

/**
  * Provides information about the database schemas defined in a module such
  * as the database platform the sql script is written for.
  *
  * **@remarks**
  * Intend to add other attributes like schemaName and domainsCovered
  * (business domains like person, invoice, etc.)
  *
  * **@interface**
  * **@member {@link DatabaseInformation.platform}**
  */
export interface DatabaseInformation {

  /**
   * The database platform(s) of all sql scripts for a given package are
   * written for. In cases where the database platforms are compatible,
   * one of the {@link DatabasePlatform}s will be chosen to represent all
   * compatible database platforms.
   */
  // eslint-disable-next-line no-use-before-define
  platform: DatabasePlatform | DatabasePlatforms
}

/**
 * An array of {@link DatabasePlatform}.
 */
export type DatabasePlatforms = DatabasePlatform[];

/**
 * The primary purpose of the database. For example, readwrite, readonly,
 * replication, etc.
 *
 * **@enum**
 * * **@members - {@link DatabasePurpose.Readonly}**
 * * **@members - {@link DatabasePurpose.Readwrite}**
 */
export enum DatabasePurpose {

  /**
   * The database is a readonly database. Tables, indexes etc. are all
   * optimized for querying. Roles are mostly setup for data querying.
   */
  Readonly = 'readonly',

  /**
   * The database is a readwrite database. Tables, indexes etc. are all
   * optimized for inserts and updates. Roles are mostly setup for data
   * mutations.
   */
  Readwrite = 'readwrite',
}

export type DatabasePurposes = DatabasePurpose[];

/**
 * Defines directory names and the intent of the sql script located in the
 * directory.
 *
 * **@remarks**
 * Support is available to run sql form other directories. These directories
 * are provided as defaults.
 *
 * **@example**
 * Sql located the {@link RunActionDirectory.Test} directory
 * is used for testing.
 *
 * **@enum**
 * * **@members - {@link RunActionDirectory.Prerun}**
 * * **@members - {@link RunActionDirectory.Run}**
 * * **@members - {@link RunActionDirectory.Postrun}**
 * * **@members - {@link RunActionDirectory.Seed}**
 * * **@members - {@link RunActionDirectory.Test}**
 * * **@members - {@link RunActionDirectory.Reset}**
 */
export enum RunActionDirectory {

  /**
   * Anything sql script that must run before script in the `run` directory
   * is applied.
   *
   * **@example**
   *
   * Setting session variables
   */
  Prerun = 'prerun',

  /**
   * Any sql script in the run directory is used to create core
   * entities(schemas, table, views), test scripts, and populate meta -
   * data(such as tags, lookups, defaults).
   */
  Run = 'run',

  /**
   * Any sql script to run after running all script in `run` and `seed`.
   *
   * **@example**
   * A quick sanity check.
   *
   */
  Postrun = 'postrun',

  /**
   * The intent of sql script in this directory is to pre - load a database
   * with seed data for developers and staging environments. Though possible,
   * seed data is not meant for production or before each test run.
   *
   * **@example**
   * * Populate data required in production / testing via the `run` directory.
   * * Populate data required for each test in the test itself.
   */
  Seed = 'seed',

  /**
   * The intent of sql in this directory is to test the behavior and features
   * of the entities created by the sql in the `run` directory. This is to
   * support behavior driven development.
   *
   * **@example**
   *
   * We created a url domain and want to check that the logic for verifying
   * a url is correct.
   *
   */
  Test = 'test',

  /**
   * The intent of sql in this directory is to tear down and reset everything
   * setup/created by the sql script in the `run` directory.
   */
  Reset = 'reset',
}

export type RunActionDirectories = RunActionDirectory[];

// eslint-disable-next-line max-len
export const runActionDirectoryAsArray = (): RunActionDirectory[] => Object.values(RunActionDirectory);

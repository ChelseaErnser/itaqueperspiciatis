import {
  MessagingOptions,
} from '@sqlpm/types-ts';

import {
  PostgresError,
} from 'postgres';

import {
  connectionOpen,
} from './connection-open';

import {
  Connection,
  DatabaseMutateSignature,
} from './types';

/**
 * Creates a database using the connection information provided. A new
 * connection is opened to the database service and then closed.
 * * **@param databaseName** The name of the database we are creating.
 * * **@param connection** - Connection information to the database.
 * See {@link Connection}
 * * **@throws** - Errors if there was an issue with creating the database
 * such as invalid database name or invalid connection.
 * * * **@returns** - A promise that resolves to true if the database
 * was created and false if the database already existed.
 */
export const databaseCreate: DatabaseMutateSignature = async (
  databaseName: string,
  connection: Connection,
  options?: MessagingOptions,
): Promise<boolean> => {
  const sql = connectionOpen(connection);
  try {
    // see https://github.com/npgsql/npgsql/issues/2730 as to why we don't
    // use a parameterized query. Also this error if we try to run the
    // create using Postgresql's EXECUTE(...) gives the error
    // ERROR:  CREATE DATABASE cannot run inside a transaction block.
    // Trying to run this within a DO$$ BEGIN ...END$$ returns the error
    // ERROR:  CREATE DATABASE cannot be executed from a function

    await sql.unsafe(`CREATE DATABASE ${databaseName};`);
  } catch (err) {
    if (err instanceof PostgresError) {
      const error = err as PostgresError;
      if (error.message.includes('already exists')) {
        options?.sendMsg?.debug(`Unable to create database ${databaseName} because it already exists.`);

        // We want this call to be idempotent so just ignore the already
        return false;
      } // else we are going to re-throw the error
    } // else we are going to re-throw the error
    throw (err);
  } finally {
    await sql.end({ timeout: 1 });
  }

  options?.sendMsg?.debug(`Successfully created database ${databaseName}.`);
  return true;
};

export const databaseDrop: DatabaseMutateSignature = async (
  databaseName: string,
  connection: Connection,
  options?: MessagingOptions,
): Promise<boolean> => {
  const sql = connectionOpen(connection);
  try {
    await sql.unsafe(`DROP DATABASE ${databaseName};`);
  } catch (err) {
    if (err instanceof PostgresError) {
      const error = err as PostgresError;
      if (error.message.includes('does not exist')) {
        options?.sendMsg?.debug(`Unable to drop database ${databaseName} because it does not exist.`);

        // We want this call to be idempotent so just ignore the already
        return false;
      } // else we are going to re-throw the error
    }
    throw (err);
  } finally {
    await sql.end({ timeout: 1 });
  }
  options?.sendMsg?.debug(`Successfully dropped database ${databaseName}.`);
  return true;
};

import {
  Connection,
} from './types';

export const connectionBuild = (
  connection: Partial<Connection> = {},
) => {
  // connection options should override the environment variables
  const { env } = process;
  const host = connection?.host || env.PGHOST;
  const port = connection?.port || Number(env.PGPORT) || 5432;
  const user = connection?.user || env.PGUSER;
  const password = connection?.password || env.PGPASSWORD;
  const dbname = connection?.dbname || env.PGDATABASE;
  const schema = connection?.schema || env.PGSCHEMA;

  if (!host || !user || !password || !dbname) {
    const missingOptions = [];
    if (!host) { missingOptions.push('host'); }
    if (!user) { missingOptions.push('user'); }
    if (!password) { missingOptions.push('password'); }
    if (!dbname) { missingOptions.push('database'); }

    // eslint-disable-next-line max-len
    const errorMessage = `Connection missing required options: ${missingOptions.join(', ')}. Required options can be set with environment variables or via the connection parameter`;
    throw Error(errorMessage);
  }

  return {
    host, port, user, password, dbname, schema,
  };
};

export const connectionParams = (
  connection: Partial<Connection> = {},
): string => (connection.schema ? `?search_path=${connection.schema}` : '');

export const connectionUri = (
  connection: Partial<Connection> = {},
): string => {
  const con = connection;
  return `postgresql://${con.user}:${con.password}@${con.host}:${con.port}/${con.dbname}${connectionParams(con)}`;
};

export const connectionUriNoPwd = (
  connection: Partial<Connection> = {},

):string => {
  const con = connection;
  return `postgresql://${con.user}:*****@${con.host}:${con.port}/${con.dbname}${connectionParams(con)}`;
};

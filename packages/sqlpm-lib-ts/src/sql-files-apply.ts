import {
  join,
} from 'node:path';

import {
  dirRead,
} from '@sqlpm/file-async-ts';

import {
  sqlApplyFromFile,
  connectionOpen,
  Connection,
} from '@sqlpm/postgresql-client-ts';

// TODO: Pass the sql client that we will use to this.

export const sqlFilesApply = async (
  sourceFolder: string,
  connection: Connection,
  sourceRoot?: string,
) => {
  const finalRoot = sourceRoot || __dirname;
  const absoluteSource = join(
    finalRoot,
    sourceFolder,
  );

  const sqlFiles = await dirRead(absoluteSource);

  const sql = connectionOpen(connection);

  const applyPromises = [];
  if (sqlFiles !== undefined) {
    for (const sqlFile of sqlFiles) {
      const absoluteSqlFile = join(absoluteSource, sqlFile);
      applyPromises.push(sqlApplyFromFile(absoluteSqlFile, sql));
    }
  } // else {} nothing to do

  try {
    await Promise.all(applyPromises);
  } finally {
    await sql.end({ timeout: 1 });
  }
};

import {
  readFileString,
} from '@sqlpm/file-async-ts';

import {
  SqlToRun,
  SqlToRunScripts,
} from './types';
// const sqlPackages: PackageDependencies = [];

export const sqlBuildScript = async (
  sqlFiles: SqlToRun[],
): Promise<SqlToRunScripts[]> => {
  const sqlToRunScripts: SqlToRunScripts[] = [];
  for (const sqlFile of sqlFiles) {
    // The file must be there. If it isn't, then we will exception
    // If there is a result, then it must be a string
    // eslint-disable-next-line no-await-in-loop
    const content = await readFileString(sqlFile.file) as string;

    // Add information about the sql to the footer so that line numbers are the
    // same between the final generated script file and the sql script that was
    // pulled from a node package.
    const footer = `

-- -----------------------------------------------------------------------------
-- File: ${sqlFile.file}
-- Package Name: ${sqlFile.name}
-- Package Version: ${sqlFile.version}
-- Run Action: ${sqlFile.runAction}
-- -----------------------------------------------------------------------------`;

    // Check if the sqlScript has already been loaded.
    const sqlScript = sqlToRunScripts.filter(
      (script) => script.name === sqlFile.name
      && script.runAction === sqlFile.runAction,
    );

    if (sqlScript.length === 0) {
      sqlToRunScripts.push({
        ...sqlFile,
        script: `${content}${footer}`,
      });
    } else if (sqlScript.length === 1) {
      // TODO: Manage the version.
      //        && script.version === sqlFile.version,

      sqlScript[0].script = `${sqlScript[0].script}${content}${footer}`;
    }
  }

  return sqlToRunScripts;
};

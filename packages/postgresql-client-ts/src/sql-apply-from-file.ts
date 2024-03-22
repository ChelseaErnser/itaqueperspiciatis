/* eslint-disable no-console */
import postgres, {
  PostgresError,
} from 'postgres';

// TODO: Refactor this A LOT. Like a lot of work needs to be done. Better
// logging, better error messages for the users, better guessing of where the
// error is. Especially since Postgresql will say the error position is at
// 0 sometimes.
const logPostgreSqlError = (file: string, error: PostgresError) => {
  const position = Number(error.position) || 0;
  const { query } = error;
  const queryLines = query.split('\n');

  const numLines = queryLines.map((line, index) => {
    const lineNum = String(index + 1).padStart(6, ' ');
    return `${lineNum}: ${line}`;
  });

  let debugLine = 0;
  for (let i = 0; i < numLines.length; i += 1) {
    const posNum = String(debugLine + 1).padStart(6, ' ');
    numLines[i] = `${posNum} ${numLines[i]}`;
    debugLine += numLines[i].length;
  }

  let atPosition = 0;
  let errorLineNumber = 0;
  for (const line of queryLines) {
    if ((atPosition + line.length) > position) {
      break;
    }
    atPosition += line.length;
    errorLineNumber += 1;
  }

  // Looks like the error is on or very near the last line
  if (errorLineNumber === 0 && atPosition !== 0) {
    errorLineNumber = queryLines.length - 1;
  }

  const message: string[] = [];

  message.push(`PostgreSQL compiler error in file '${file}'`);
  message.push(`${error.name} (code ${error.code}) ${error.message} (line ${errorLineNumber + 1} position ${position})`);
  if (errorLineNumber < 0) {
    message.push('Unable to determine error line number.');
    // console.warn('Unable to determine error line number.');
  }

  if (error.code === '2BP01') {
    message.push('');
    message.push('Did you add all the sql resources created by your reset sql ddl?');
    message.push('');
  }

  if (error.message.includes('already exists')) {
    message.push('');
    message.push('It looks like an IF EXITS check is missing for a resource being created.');
    message.push('');
  }

  // TODO: Improve the logic to give hints to user what to do
  // if (error.message.includes('does not exist')) {
  //   message.push('');
  //   message.push('It looks like an IF EXITS check is missing for a resource being dropped.');
  //   message.push('');
  // }

  const verbose = false;
  if (verbose) {
    for (let line = 0; line < numLines.length; line += 1) {
      if (line === errorLineNumber) {
        message.push(`${numLines[line]}`);
      } else {
        message.push(`${numLines[line]}`);
      }
    }
  } else if (errorLineNumber > 0) {
    message.push(`The error may be at or near the line number ${errorLineNumber}:`);

    // Let's print the line number of the error + the lines before and
    // after the line

    if (errorLineNumber > 1) {
      message.push(`${numLines[errorLineNumber - 1]}`);
    }
    message.push(`${numLines[errorLineNumber]}`);

    // error could be the absolute last line of code. So, don't want to try
    // print the next line.
    if (undefined !== numLines[errorLineNumber + 1]) {
      message.push(`${numLines[errorLineNumber + 1]}`);
    }
  }

  console.error(message.join('\n'));
};

export const sqlApplyFromFile = async (
  path: string,
  sql: postgres.Sql<{}>,
): Promise<void> => {
  // TODO: A lot of work here to do.
  // console.log(`Running file '${path}' on the database server`);
  // await this.sql.begin(async () => {
  await sql.file(path)
    .catch((err: unknown) => {
      if (err instanceof PostgresError) {
        logPostgreSqlError(path, err);
      }
      // rethrow the error so we don't try to run anymore files.
      throw err;
    });
  // }).catch((err: unknown) => {
  //   throw err;
  // });
};

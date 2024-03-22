import postgres from 'postgres';

import {
  connectionBuild,
} from './connection';

import {
  Connection,
  PostgresNotice,
} from './types';

export const connectionOpen = (
  connection: Partial<Connection> = {},
): postgres.Sql<{}> => {
  const finalConnection = connectionBuild(connection);
  // https://github.com/porsager/postgres#all-postgres-options
  return postgres({
    ...finalConnection,
    // If we get the error "UNDEFINED_VALUE: Undefined values are not allowed"
    // then it probably means we have something like
    // select * from x where y = ${ undefined }. So, we aren't going to enable
    // the transform option.
    // transform: { undefined: null },
    onnotice: (notice: PostgresNotice) => {
      // Let's not pollute the output by showing postgresql messages
      // that will be common with idempotent sql such as already exists,
      // does not exist, etc.
      if (
        !notice.message.includes('already exists') // CREATE IF NOT EXIST ...
        && (notice.severity !== 'INFO')
        && (!notice.message.includes('does not exist')) // DROP IF EXISTS ...
        && (!notice.message.includes('removing login rights'))
      ) {
        const severity = notice.severity.includes('NOTICE') ? '' : `${notice.severity}: `;

        // TODO: Logging
        // eslint-disable-next-line no-console
        console.log(`${severity}${notice.message}`);

        const noticeDetails = notice.detail?.split('\n');
        if (noticeDetails) {
          for (const noticeDetail of noticeDetails) {
            // TODO: Logging
            // eslint-disable-next-line no-console
            console.log(`${severity}  ${noticeDetail}`);
          }
        }
      }
    },
  });
};

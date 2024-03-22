// import { Dependency } from '@schemastore/package';
import {
  buildDependency,
} from '@sqlpm/node-package-ts';

import {
  join,
} from 'node:path';

import {
  MessagingOptions,
  DatabasePlatform,
  DatabasePurpose,
  RunActionDirectory,
} from '@sqlpm/types-ts';

import {
  dirRead,
} from '@sqlpm/file-async-ts';

import {
  SqlToRun,
} from './types';
import { sqlPackagesGetInverted } from './sql-packages-get-inverted';

export const sqlFindScript = async (
  databasePurpose: DatabasePurpose | string,
  platform: DatabasePlatform,
  runDirectories: RunActionDirectory[],
  options?: MessagingOptions,
  childPath?: string,
): Promise<SqlToRun[]> => {
  const finalPath = childPath || __dirname;
  const sendMsg = options?.sendMsg;

  const scripts: SqlToRun[] = [];

  const finalOptions = {
    include: /^@sqlpm\/[\S]/,
    sendMsg: options?.sendMsg,
  };
  const rootPackage = await buildDependency(finalPath, finalOptions);
  if (rootPackage !== undefined) {
    const sqlPackages = sqlPackagesGetInverted(rootPackage, platform);

    if (sqlPackages.length === 0) {
      const message = `
      No packages found under root package '${rootPackage.package.name}' located at '${rootPackage.source?.absolutePath}' that are a sqlpm node package. Verify that:
      1. If the '${rootPackage.package.name}' package is to be used by sqlpm, then make sure { "database": { "platform": "postgresql" } } is part of your package.json file.
      2. For mono-repo, did you add your schema workspace to  { "workspaces": [ ... ], } in your mono-repo root package and that the workspace directory in workspaces actually exists in your project.
      `;
      sendMsg?.warn(message);
    } else {
      // Run these in the order they are provided
      for (const runDirectory of runDirectories) {
        for (const sqlPackage of sqlPackages) {
          if (sqlPackage.source?.absolutePath) {
            const runDirAbsolute = join(
              sqlPackage.source.absolutePath,
              databasePurpose,
              runDirectory,
            );

            // eslint-disable-next-line no-await-in-loop
            const files: string[] | undefined = await dirRead(
              runDirAbsolute,
              {
                required: false,
              },
            );

            if (files) {
              sendMsg?.debug(`Looking for sql script in ${runDirAbsolute}`);
              if (files?.length === 0) {
                sendMsg?.debug(`No sql script found in ${runDirAbsolute}`);
              } else {
                sendMsg?.debug(`Sql scripts found in ${runDirAbsolute}`);
              }

              for (const file of files.sort()) {
                const absoluteFileName = join(runDirAbsolute, file);
                let addScript = true;
                for (const script of scripts) {
                  if (script.file === absoluteFileName) {
                    addScript = false;
                    if (script.version !== sqlPackage.package.version) {
                      // todo: Write code so we choose the most recent script
                      // especially if the user is in a mono-repo and editing
                      // script in real-ish time.
                      throw Error(`Two version of the same sqlpm script have been found. Sqlpm package '${absoluteFileName}' versions '${script.version}' and '${sqlPackage.package.version}'.`);
                    }
                  }
                }
                if (addScript) {
                  scripts.push({
                    name: sqlPackage.package.name,
                    runAction: runDirectory,
                    version: sqlPackage.package.version,
                    file: absoluteFileName,
                  });
                }
              }
            } else {
              sendMsg?.debug(`No folder found ${runDirAbsolute}`);
            }
          } else {
            throw Error('A source was not found for a package.json node project that contains sql. This should not be logically possible.');
          }
        }
      }
    }
  }

  return scripts;
};

#!/usr/bin/env node
import commander from 'commander';

import {
  join,
} from 'node:path';

import {
  loadNodePackage,
} from '@sqlpm/node-package-ts';

import {
  parseSchemaProjectInit,
  schemaProjectInit,
} from '@sqlpm/package-generator-ts';

(async () => {
  const pkg = await loadNodePackage(
    join(
      __dirname,
      '..',
      'package.json',
    ),
  );

  if (pkg === undefined) {
    throw Error('Missing package.json in sqlpm project');
  }

  const program = new commander.Command();
  program
    .name('sqlpm')
    .description('A package manager for SQL and SQL DDL.')
    .version(pkg?.content.version)
    .addHelpText('after', `

Example calls:
  
  $ sqlpm --init development`);

  program.command('generate')
    .description('Generates a new database schema package')
    .action(async (json) => {
      const input = parseSchemaProjectInit(json);

      console.log('Generating package with the following options:');
      console.log(input);
      await schemaProjectInit(
        input.packageName,
        input.platform,
        input.description,
        input.author,
        input.email,
        input.purposes,
        input.actions,
        input.workspace,
      );
    })
    .argument('<json>', 'A json blob defining how to generate the package')
    .addHelpText('after', `
Example generate:



    `);
  program.parse(process.argv);

  const progOpts = program.opts();

  // const options = {
  //   reset: !!progOpts.reset,
  //   watch: !!progOpts.watch,
  //   bypass: !!progOpts.bypass,
  //   alwaysRun: !!progOpts.alwaysRun,
  //   loggerOptions: {
  //     level: progOpts.logLevel ? progOpts.logLevel : 'info',
  //   },
  //   verbose: !!progOpts.verbose,
  //   init: progOpts.init,
  //   seed: !!progOpts.seed,
  //   runTests: progOpts.runTests ? progOpts.runTests : 'always',
  // };

  // const sqlWatch = new SqlWatch(options);
  // try {
  //   const watching = await sqlWatch.run();
  //   if (!watching) {
  //     process.exit(0);
  //   } // else we shouldn't exit the process and letter the watcher
  // } catch (err: unknown) {
  //   // if we are here, then a major error occurred like bad code
  //   const error = err as Error;
  //   // eslint-disable-next-line no-console
  //   console.log(error.stack || '');
  //   process.exit(1);
  // }
})();

// .option('-c, --create', `creates a new database schema
// automatically run them based on selected options.
// `)

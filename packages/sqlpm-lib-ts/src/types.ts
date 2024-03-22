import {
  RunActionDirectory,
} from '@sqlpm/types-ts';

export interface SqlToRun {
  name: string,
  runAction: RunActionDirectory,
  version: string,
  file: string
}

export interface SqlToRunScripts extends SqlToRun {
  script: string
}

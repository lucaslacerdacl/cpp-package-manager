#!/usr/bin/env node

import chalk from 'chalk';
import * as argv from 'minimist';
import Init from './options/init/init';
import Install from './options/install/install';

export default class StartUp {
  private parameter: string;

  constructor() {
    this.parameter = argv(process.argv.slice(1))._[1];
    this.checkParameter();
  }

  private checkParameter() {
    if (this.parameter === 'init') {
      new Init();
    } else if (this.parameter === 'install') {
      new Install();
    } else {
      console.log(chalk.red('Unknow command.'));
    }
  }
}

new StartUp();

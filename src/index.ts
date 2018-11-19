#!/usr/bin/env node

import chalk from 'chalk';
import * as argv from 'minimist';
import Init from './options/init/init';
import Install from './options/install/install';
import Build from './options/build/build';
import Log from './options/log/log';
import * as inquirer from 'inquirer';
import Version from './options/version/version';

export default class StartUp {
  private parameter: string;
  private log: Log;
  private init: Init;
  private install: Install;
  private build: Build;
  private version: Version;

  constructor() {
    this.parameter = argv(process.argv.slice(1))._[1];
    this.log = new Log();
    this.init = new Init(inquirer, this.log);
    this.install = new Install(this.log);
    this.build = new Build(this.log);
    this.version = new Version(this.log);

  }

  public async checkParameter() {
    if (this.parameter === 'init') {
      await this.init.createConfigFile();
    } else if (this.parameter === 'install') {
      await this.install.installDependencies();
    } else if (this.parameter === 'build') {
      await this.build.generateBinaries();
    } else if (this.parameter === 'version' || this.parameter === '-v' || this.parameter === '--version') {
      await this.version.printVersion();
    } else {
      console.log(chalk.red('Unknow command.'));
    }
  }
}

(async () => {
  try {
    const cpm = new StartUp();
    await cpm.checkParameter();
  } catch (err) {
    new Log(err.message);
  }
})();

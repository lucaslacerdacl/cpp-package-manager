import * as fs from 'fs';
import * as _ from 'lodash';
import DependenciesModel from '../dependencies.model';
import * as nodegit from 'nodegit';
import { exec } from 'child_process';

export default class Install {
  constructor() {
    if (this.isConfigFileAvaliable()) {
      this.installDependencies();
    } else {
      console.error('There is no configuration file.');
    }
  }

  private isConfigFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpm.packages.json');
  }

  private installDependencies() {
    const file = JSON.parse(fs.readFileSync(`${process.cwd()}/cpm.packages.json`).toString());
    _.forEach(file.dependencies, (dependencie: DependenciesModel) => {
      nodegit.Clone.clone(dependencie.url, `${process.cwd()}/cpm_modules/${dependencie.name}`);
      const directory = { cwd: `${process.cwd()}/cpm_modules/${dependencie.name}` };
      exec('cpm install', directory);
    });
    exec('cpm build', {cwd: process.cwd()});
  }
}

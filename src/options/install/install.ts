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
      console.error('Não existe um arquivo de configuração.');
    }
  }

  private isConfigFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpp.packages.json');
  }

  private installDependencies() {
    const file = JSON.parse(fs.readFileSync(`${process.cwd()}/cpp.packages.json`).toString());
    _.forEach(file.dependencies, (dependencie: DependenciesModel) => {
      nodegit.Clone.clone(dependencie.url, `${process.cwd()}/cpp_modules/${dependencie.name}`);
      const directory = { cwd: `${process.cwd()}/cpp_modules/${dependencie.name}` };
      exec('cpm install', directory);
    });
  }
}
import * as fs from 'fs';
import * as _ from 'lodash';
import DependenciesModel from '../dependencies.model';
import * as nodegit from 'nodegit';
import { exec } from 'child_process';
import ConfigProjectModel from '../config-project.model';

export default class Install {
  constructor() {
    if (this.isConfigFileAvaliable()) {
      this.installDependencies();
    } else {
      throw new Error('There is no configuration file.');
    }
  }

  private isConfigFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpm.packages.json');
  }

  private installDependencies() {
    const file = new ConfigProjectModel(JSON.parse(fs.readFileSync(`${process.cwd()}/cpm.packages.json`).toString()));
    const configProject = new ConfigProjectModel(file);
    _.forEach(configProject.dependencies, (dependencie: DependenciesModel) => {
      nodegit.Clone.clone(dependencie.url, `${process.cwd()}/cpm_modules/${dependencie.name}`)
        .then(() => {
          const directory = { cwd: `${process.cwd()}/cpm_modules/${dependencie.name}` };
          exec('cpm install && cpm build', directory);
        });
    });
  }
}

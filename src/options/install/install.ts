import * as fs from 'fs';
import * as _ from 'lodash';
import DependenciesModel from '../dependencies.model';
import * as nodegit from 'nodegit';
import ConfigProjectModel from '../config-project.model';
import Log from '../log/log';
import Exec, { ExecResultModel } from '../../lib/exec';

export default class Install {
  constructor(private log: Log) { }

  public async installDependencies(): Promise<any> {
    const isConfigFileAvaliable = _.includes(fs.readdirSync('.'), 'cpm.packages.json');
    if (isConfigFileAvaliable) {
      await this.readConfigFileAndInstallDependecies();
    } else {
      this.log.createErrorLog('There is no configuration file.');
    }
  }

  private cleanPackagesFolder(): Promise<ExecResultModel> {
    return Exec.command('rm -rf cpm_modules', { cwd: process.cwd() });
  }

  private async readConfigFileAndInstallDependecies(): Promise<any> {
    await this.cleanPackagesFolder()
    .then(() => {
      const file = new ConfigProjectModel(JSON.parse(fs.readFileSync(`${process.cwd()}/cpm.packages.json`).toString()));
      const configProject = new ConfigProjectModel(file);
      _.forEach(configProject.dependencies, (dependency: DependenciesModel) => {
        this.installDependency(dependency);
      });
    })
    .catch(error => {
      this.log.createErrorLog(error);
    });
  }

  private async installDependency(dependency: DependenciesModel): Promise<any> {
    await nodegit.Clone.clone(dependency.url, `${process.cwd()}/cpm_modules/${dependency.name}`)
      .then(() => {
        const directory = { cwd: `${process.cwd()}/cpm_modules/${dependency.name}` };
        return Exec.command('cpm install && cpm build', directory);
      })
      .catch(error => {
        this.log.createErrorLog(error);
      });
  }
}

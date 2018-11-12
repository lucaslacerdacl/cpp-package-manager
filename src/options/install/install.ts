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
      try {
        await this.cleanPackagesFolder();
        await this.readConfigFileAndInstallDependecies();
      } catch (error) {
        this.log.createErrorLog(error);
      }
    } else {
      this.log.createErrorLog('There is no configuration file.');
    }
  }

  private async cleanPackagesFolder(): Promise<ExecResultModel | void> {
    await Exec.command('rm -rf cpm_modules', { cwd: process.cwd(), env: process.env });
  }

  private async readConfigFileAndInstallDependecies(): Promise<void> {
    const file = new ConfigProjectModel(JSON.parse(fs.readFileSync(`${process.cwd()}/cpm.packages.json`).toString()));
    const configProject = new ConfigProjectModel(file);
    await _.forEach(configProject.dependencies, async (dependency: DependenciesModel) => {
      try {
        await this.installDependency(dependency);
      } catch (error) {
        this.log.createErrorLog(error);
      }
    });
  }

  private async installDependency(dependency: DependenciesModel): Promise<void> {
    await nodegit.Clone.clone(dependency.url, `${process.cwd()}/cpm_modules/${dependency.name}`);
    const config = { cwd: `${process.cwd()}/cpm_modules/${dependency.name}`, env: process.env };
    await Exec.command('cpm install && cpm build', config);
  }
}

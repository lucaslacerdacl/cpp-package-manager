import * as fs from 'fs';
import * as _ from 'lodash';
import DependenciesModel from '../dependencies.model';
import { exec } from 'child_process';
import ConfigBuildModel from '../config-build.model';

export default class Build {
  constructor() {
    if (this.checkFileExists('cpm.packages.json')) {
      this.generateBinaries();
    } else {
      console.error('There is no configuration file.');
    }
  }

  private checkFileExists(fileName: string): boolean {
    return _.includes(fs.readdirSync('.'), fileName);
  }

  private generateBinaries() {
    const buildCommand = 'rm -rf dist && mkdir dist && g++ -c **/*.cpp && mv *.o dist/';
    if (this.checkFileExists('cpm.build.json')) {
      this.generateBinariesWithConfigBuildFile(buildCommand);
    } else {
      exec(`${buildCommand}`, { cwd: process.cwd() });
    }
    this.generateDependenciesBinaries();
  }

  private generateBinariesWithConfigBuildFile(buildCommand: string) {
    const configBuildFile = new ConfigBuildModel(JSON.parse(fs.readFileSync(`${process.cwd()}/cpm.build.json`).toString()));
    if (configBuildFile.binaries && configBuildFile.binaries.length > 0) {
      const compileProject = `g++ dist/${configBuildFile.binaries.join(' dist/')}`;
      const outputFile = `-o dist/${configBuildFile.fileName}`;
      exec(`${buildCommand} && ${compileProject} ${outputFile}`, {cwd: process.cwd()});
    } else {
      throw new Error('The file cpm.build.json is not in correct pattern.');
    }
  }

  private generateDependenciesBinaries() {
    const configProjectFile = JSON.parse(fs.readFileSync(`${process.cwd()}/cpm.packages.json`).toString());
    _.forEach(configProjectFile.dependencies, (dependencie: DependenciesModel) => {
      const directory = { cwd: `${process.cwd()}/cpm_modules/${dependencie.name}` };
      exec('cpm build', directory);
    });
  }
}

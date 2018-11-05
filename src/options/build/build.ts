import * as fs from 'fs';
import * as _ from 'lodash';
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
    const buildCommand = 'rm -rf dist && mkdir dist && g++ -c src/**/*.cpp **/*.cpp && mv *.o dist/';
    if (this.checkFileExists('cpm.build.json')) {
      this.generateBinariesWithConfigBuildFile(buildCommand);
    } else {
      exec(`${buildCommand}`, { cwd: process.cwd() });
    }
  }

  private generateBinariesWithConfigBuildFile(buildCommand: string) {
    const configBuildFile = new ConfigBuildModel(JSON.parse(fs.readFileSync(`${process.cwd()}/cpm.build.json`).toString()));
    if (configBuildFile.binaries && configBuildFile.binaries.length > 0) {
      const compileProject = `g++ ${configBuildFile.binaries.join(' ')}`;
      const outputFile = `-o dist/${configBuildFile.fileName}`;
      exec(`${buildCommand} && ${compileProject} ${outputFile}`, {cwd: process.cwd()});
    } else {
      throw new Error('The file cpm.build.json is not in correct pattern.');
    }
  }

}

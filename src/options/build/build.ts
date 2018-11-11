import * as fs from 'fs';
import * as _ from 'lodash';
import Exec from '../../lib/exec';
import Glob from '../../lib/glob';
import ConfigBuildModel from '../config-build.model';
import Log from '../log/log';

export default class Build {
  constructor(private log: Log) { }

  public async generateBinaries(): Promise<void> {
    if (this.checkFileExists('cpm.packages.json')) {
      try {
        const paths = await this.findFiles();
        await this.buildFiles(paths);
      } catch (error) {
        this.log.createErrorLog(error);
      }
    } else {
      this.log.createErrorLog('There is no configuration file.');
    }
  }

  private checkFileExists(fileName: string): boolean {
    return _.includes(fs.readdirSync('.'), fileName);
  }

  private async findFiles(): Promise<string[]> {
    return await Glob.findPattern(`${process.cwd()}/**/*.cpp`);
  }

  private async buildFiles(paths: string[]) {
    const buildCommand = `rm -rf dist && mkdir dist && g++ -c ${paths.join(' ')} && mv *.o dist/`;
    if (this.checkFileExists('cpm.build.json')) {
      await this.generateBinariesWithConfigBuildFile(buildCommand);
    } else {
      await this.executeCommand(`${buildCommand}`);
    }
  }

  private async generateBinariesWithConfigBuildFile(buildCommand: string) {
    const configBuildFile = new ConfigBuildModel(JSON.parse(fs.readFileSync(`${process.cwd()}/cpm.build.json`).toString()));
    if (configBuildFile.binaries && configBuildFile.binaries.length > 0) {
      const compileProject = `g++ ${configBuildFile.binaries.join(' ')}`;
      const outputFile = `-o dist/${configBuildFile.fileName}`;
      await this.executeCommand(`${buildCommand} && ${compileProject} ${outputFile}`);
    } else {
      this.log.createErrorLog('The file cpm.build.json is not in correct pattern.');
    }
  }

  private async executeCommand(command) {
    await Exec.command(`${command}`, { cwd: process.cwd() });
  }

}

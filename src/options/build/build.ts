import * as fs from 'fs';
import * as _ from 'lodash';
import DependenciesModel from '../dependencies.model';
import { exec } from 'child_process';

export default class Build {
  constructor() {
    if (this.isConfigFileAvaliable()) {
      this.generateBinaries();
    } else {
      console.error('There is no configuration file.');
    }
  }

  private isConfigFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpp.packages.json');
  }

  private generateBinaries() {
    const file = JSON.parse(fs.readFileSync(`${process.cwd()}/cpp.packages.json`).toString());
    _.forEach(file.dependencies, (dependencie: DependenciesModel) => {
      const directory = { cwd: `${process.cwd()}/cpp_modules/${dependencie.name}` };
      exec('g++ -c src/**/*.cpp && mkdir dist && mv *.o dist/', directory);
    });
  }
}

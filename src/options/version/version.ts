import Log from '../log/log';
import Exec from '../../lib/exec';
import * as fs from 'fs';

export default class Version {
  constructor(private log: Log) { }

  async printVersion(): Promise<any> {
    try {
      const version = await this.getVersion();
      console.log(version);
    } catch (error) {
      this.log.createErrorLog(error);
    }
  }

  private async getVersion(): Promise<string> {
    const nodeModulesPath = await Exec.command('npm root -g', { cwd: process.cwd() });
    const cpmPath = `${nodeModulesPath.stdout.trim()}/cpp-package-manager`;
    const file = JSON.parse(fs.readFileSync(`${cpmPath}/package.json`).toString());
    return file.version;
  }
}

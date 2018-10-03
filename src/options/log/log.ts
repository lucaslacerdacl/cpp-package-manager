import * as touch from 'touch';
import * as fs from 'fs';
import * as _ from 'lodash';
import LogModel from './log.model';

export default class Log {
  constructor(error: any) {
    const formatedError = new LogModel(error);
    if (!this.isLogFileAvaliable()) {
      this.createLogFile(formatedError);
    } else {
      this.writeLogFile(formatedError);
    }
    console.log('Ocorreu um erro! Verifique o arquivo de log.');
  }

  private isLogFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpp.packages.log.json');
  }

  private createLogFile(error: LogModel) {
    touch('cpp.packages.log.json')
      .then(() => {
        fs.writeFileSync('cpp.packages.log.json', JSON.stringify([error], null, 2));
      });
  }

  private writeLogFile(error: LogModel) {
    const file = fs.readFileSync('cpp.packages.log.json').toString();
    let formatedFile = [];
    if (file.length) {
      formatedFile = JSON.parse(file);
    }
    formatedFile.push(error);
    fs.writeFileSync('cpp.packages.log.json', JSON.stringify(formatedFile, null, 2));
  }
}

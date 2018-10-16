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
    console.log('An error has occurred! Check the log file.');
  }

  private isLogFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpp.log.json');
  }

  private createLogFile(error: LogModel) {
    fs.writeFileSync('cpp.log.json', JSON.stringify([error], null, 2));
  }

  private writeLogFile(error: LogModel) {
    const file = fs.readFileSync('cpp.log.json').toString();
    let formatedFile = [];
    if (file.length) {
      formatedFile = JSON.parse(file);
    }
    formatedFile.push(error);
    fs.writeFileSync('cpp.log.json', JSON.stringify(formatedFile, null, 2));
  }

}

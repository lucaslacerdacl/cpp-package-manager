import * as fs from 'fs';
import * as _ from 'lodash';
import LogModel from './log.model';

export default class Log {

  constructor(error?: any) {
    if (error) {
      this.createErrorLog(error);
    }
  }

  public createErrorLog(error: any) {
    const formatedError = new LogModel(error);
    if (!this.isLogFileAvaliable()) {
      this.createLogFile(formatedError);
    } else {
      this.writeLogFile(formatedError);
    }
    console.log('An error has occurred! Check the log file.');
  }

  private isLogFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpm.log.json');
  }

  private createLogFile(error: LogModel) {
    fs.writeFileSync('cpm.log.json', JSON.stringify([error], null, 2));
  }

  private writeLogFile(error: LogModel) {
    const file = fs.readFileSync('cpm.log.json');
    const formatedFile = JSON.parse(file.toString());
    formatedFile.push(error);
    fs.writeFileSync('cpm.log.json', JSON.stringify(formatedFile, null, 2));
  }

}

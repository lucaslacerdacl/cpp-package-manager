import * as fs from 'fs';
import * as _ from 'lodash';
import ConfigProjectModel from '../config-project.model';
import * as path from 'path';
import InitModel from './init-questions.model';
import * as figlet from 'figlet';
import chalk from 'chalk';
import { Inquirer } from 'inquirer';
import Log from '../log/log';

export default class Init {

  constructor(private inquirer: Inquirer, private log: Log) { }

  public async createConfigFile(): Promise<any> {
    if (this.isConfigFileAvaliable()) {
      this.log.createErrorLog('A configuration file already exists.');
    } else {
      console.log(
        chalk.yellow(
          figlet.textSync('CPM', { horizontalLayout: 'full' })
        )
      );
      await this.getConfigFileResponse();
    }
  }

  private isConfigFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpm.packages.json');
  }

  private async getConfigFileResponse(): Promise<any> {
    const questions = this.createQuestionsToFillConfigFile();
    await this.inquirer.prompt(questions)
    .then(this.createFileWithQuestions)
    .catch(error => {
      this.log.createErrorLog(error);
    });
  }

  private createQuestionsToFillConfigFile(): Array<{}> {
    const name = new InitModel('name', 'input', 'Enter a name for the project', path.basename(process.cwd()));
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const version = new InitModel('version', 'input', 'Enter a version for the project', '1.0.0');

    return new Array<{}>(name.toObject(), description.toObject(), version.toObject());
  }

  private createFileWithQuestions(initResult: any): void {
    const configFile = new ConfigProjectModel(initResult);
    fs.writeFileSync('cpm.packages.json', JSON.stringify(configFile, null, 2));
  }

}

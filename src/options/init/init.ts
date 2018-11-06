import * as fs from 'fs';
import * as _ from 'lodash';
import ConfigProjectModel from '../config-project.model';
import * as inquirer from 'inquirer';
import * as path from 'path';
import InitModel from './init-questions.model';
import * as figlet from 'figlet';
import chalk from 'chalk';

export default class Init {

  constructor() {
    if (this.isConfigFileAvaliable()) {
      throw new Error('A configuration file already exists.');
    } else {
      console.log(
        chalk.yellow(
          figlet.textSync('CPM', { horizontalLayout: 'full' })
        )
      );
      this.getConfigFileResponse();
    }
  }

  private isConfigFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpm.packages.json');
  }

  private getConfigFileResponse() {
    const questions = this.createConfigFileQuestions();
    inquirer.prompt(questions)
    .then(this.createConfigFile);
  }

  private createConfigFileQuestions(): Array<{}> {
    const name = new InitModel('name', 'input', 'Enter a name for the project', path.basename(process.cwd()));
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const version = new InitModel('version', 'input', 'Enter a version for the project', '1.0.0');

    return new Array<{}>(name.toObject(), description.toObject(), version.toObject());
  }

  private createConfigFile(initResult: any) {
    const configFile = new ConfigProjectModel(initResult);
    fs.writeFileSync('cpm.packages.json', JSON.stringify(configFile, null, 2));
  }

}

import Inquirer from '../../lib/inquirer';
import InitRespondeModel from './init-response.model';
import * as touch from 'touch';
import * as fs from 'fs';
import * as _ from 'lodash';
import Log from '../log/log';

export default class Init {

  private inquirer: Inquirer = new Inquirer();

  private isConfigFileAvaliable(): boolean {
    return _.includes(fs.readdirSync('.'), 'cpp.packages.json');
  }

  private createConfigFile(initResult: any) {
    touch('cpp.packages.json');
    const configFile = new InitRespondeModel(initResult);
    fs.writeFileSync('cpp.packages.json', JSON.stringify(configFile, null, 2));
    console.log('Arquivo criado com sucesso!');
  }

  private createLogFile(error: any) {
    new Log(error);
    console.log('Ocorreu um erro! Verifique o arquivo de log.');
  }

  constructor() {
    if (this.isConfigFileAvaliable()) {
      console.log('Já existe um arquivo de configuração.');
    } else {
      this.inquirer.AskInitDetails()
        .then(this.createConfigFile)
        .catch(this.createLogFile);
    }
  }
}
import * as inquirer from 'inquirer';
import * as path from 'path';
import InitModel from '../options/init/init-questions.model';

export default class Inquirer {

  AskInitDetails(): Promise<{}> {
    const validateNameInput = (value) => {
      if (value.length) {
        return true;
      } else {
        return 'Please enter a name.';
      }
    }
    const questions = new InitModel('name', 'input', 'Enter a name for the project', path.basename(process.cwd()), validateNameInput);
    return inquirer.prompt(questions.toObject());
  }
}
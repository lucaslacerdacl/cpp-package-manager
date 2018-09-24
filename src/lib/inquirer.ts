import * as inquirer from 'inquirer';
import * as path from 'path';
import InitModel from '../options/init/init-questions.model';

export default class Inquirer {

  AskInitDetails(): Promise<{}> {
    const validateInput = (value) => {
      if (value.length) {
        return true;
      } else {
        return 'Please enter a value.';
      }
    }
    const name = new InitModel('name', 'input', 'Enter a name for the project', path.basename(process.cwd()), validateInput);
    const description = new InitModel('description', 'input', 'Enter a description for the project', '');
    const questions = new Array<{}>(name.toObject(), description.toObject());
    return inquirer.prompt(questions);
  }
}
import chalk from 'chalk';
import * as figlet from 'figlet';
import * as argv from 'minimist';
import Init from './options/init/init';

export default class StartUp {
  private parameter: string;

  constructor() {
    console.log(
      chalk.yellow(
        figlet.textSync('CPM', { horizontalLayout: 'full' })
      )
    );
    this.parameter = argv(process.argv.slice(1))._[1];
    this.checkParameter();
  }

  private checkParameter() {
    if (this.parameter === 'init') {
      new Init();
    } else {
      console.log(chalk.red('Unknow command.'));
    }
  }
}

new StartUp();

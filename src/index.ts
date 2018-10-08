import chalk from 'chalk';
import * as figlet from 'figlet';
import * as argv from 'minimist';
import Init from './options/init/init';
import Log from './options/log/log';

export default class StartUp {
  private parameter: string;
  private log = new Log();

  constructor() {
    try {
      console.log(
        chalk.yellow(
          figlet.textSync('CPM', { horizontalLayout: 'full' })
        )
      );
      this.parameter = argv(process.argv.slice(1))._[1];
      this.checkParameter();
    } catch (error) {
      this.log.createLog(error);
    }
  }

  private checkParameter() {
    if (this.parameter === 'init') {
      // TO-DO: Remove unused variable.
      const init = new Init(this.log);
    } else {
      console.log(chalk.red('Unknow command.'));
    }
  }
}

// TO-DO: Remove unused variable.
const startUp = new StartUp();

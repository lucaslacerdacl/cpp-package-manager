import { exec, ExecOptions, ExecException } from 'child_process';

export class ExecResultModel {
  error: ExecException;
  stdout: string;
  stderr: string;

  constructor(error?: ExecException, stdout?: string, stderr?: string) {
    if (error) {
      this.error = error;
    }
    if (stdout) {
      this.stdout = stdout;
    }
    if (stderr) {
      this.stderr = stderr;
    }
  }
}

export default class Exec {
  static command(command, options: ExecOptions): Promise<ExecResultModel> {
    return new Promise((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          return reject({error, stdout, stderr});
        }
        resolve({error: null, stdout, stderr});
      });
    });
  }
}

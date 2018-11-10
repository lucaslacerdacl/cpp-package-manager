import * as glob from 'glob';

export default class Glob {
  static findPattern(pattern: string, options?: glob.IOptions): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      glob(pattern, options, (err, files) => {
        if (err === null) {
          resolve(files);
        } else {
          reject(err);
        }
      });
    });
  }
}

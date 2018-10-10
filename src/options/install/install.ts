import * as fs from 'fs';

export default class Install {
  constructor() {
    const file = fs.readFileSync(process.cwd() + '/cpp.packages.json');
  }
}

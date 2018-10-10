import * as fs from 'fs';
import DependenciesModel from '../dependencies.model';
import Install from './install';
import ConfigFileModel from '../config-file.model';
import { stringify } from 'querystring';

describe('Install', () => {

  it('Read dependencies', () => {
    const configFile = new ConfigFileModel({ name: 'test', description: 'testDesc', version: '1.0.0' });
    const dependencies = new DependenciesModel('example', 'http://github.com/example');
    configFile.dependencies = new Array<DependenciesModel>(dependencies);
    const file = Buffer.from(JSON.stringify(configFile));
    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(file);

    new Install();

    expect(spyReadFileSync).toHaveBeenCalledTimes(2);
    expect(spyReadFileSync).toHaveBeenCalledWith(process.cwd() + '/cpp.packages.json');
  });
});

import Build from './build';
import * as fs from 'fs';
import DependenciesModel from '../dependencies.model';
import ConfigFileModel from '../config-file.model';
const child_process = require('child_process');

describe('Build', () => {
  const spyReaddirSync = jest.spyOn(fs, 'readdirSync');
  const spyReadFileSync = jest.spyOn(fs, 'readFileSync');

  beforeEach(() => {
    spyReaddirSync.mockReset();
    spyReadFileSync.mockReset();
  });

  it('should not find config gile', () => {
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    spyReaddirSync.mockReturnValue([]);

    new Build();

    expect(spyConsoleError).toHaveBeenCalledTimes(1);
    expect(spyConsoleError).toHaveBeenCalledWith('There is no configuration file.');

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

  });

  it('should read dependencies and compile binaries', () => {
    spyReaddirSync.mockReturnValue(['cpp.packages.json']);
    const configFile = new ConfigFileModel({ name: 'test', description: 'testDesc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configFile.dependencies = new Array<DependenciesModel>(dependencie);
    const file = Buffer.from(JSON.stringify(configFile));
    spyReadFileSync.mockImplementation(() => { }).mockReturnValueOnce(file);
    const directory = {cwd: `${process.cwd()}/cpp_modules/${dependencie.name}`};
    const spyChildProcessExec = jest.spyOn(child_process, 'exec').mockImplementation(() => {});

    new Build();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpp.packages.json`);

    expect(spyChildProcessExec).toHaveBeenCalledTimes(1);
    expect(spyChildProcessExec).toHaveBeenCalledWith('g++ -c src/**/*.cpp && mkdir dist && mv *.o dist/', directory);

  });
});

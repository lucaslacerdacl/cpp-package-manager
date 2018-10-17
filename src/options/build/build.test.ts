import Build from './build';
import * as fs from 'fs';
import DependenciesModel from '../dependencies.model';
import ConfigFileModel from '../config-file.model';
const child_process = require('child_process');

describe('Build', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should not find config file', () => {
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue([]);

    new Build();

    expect(spyConsoleError).toHaveBeenCalledTimes(1);
    expect(spyConsoleError).toHaveBeenCalledWith('There is no configuration file.');

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

  });

  it('should read dependencies and compile binaries', () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue(['cpp.packages.json']);
    const configFile = new ConfigFileModel({ name: 'test', description: 'testDesc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configFile.dependencies = new Array<DependenciesModel>(dependencie);
    const file = Buffer.from(JSON.stringify(configFile));
    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => { }).mockReturnValueOnce(file);
    const directory = {cwd: `${process.cwd()}/cpp_modules/${dependencie.name}`};
    const spyChildProcessExec = jest.spyOn(child_process, 'exec').mockImplementation(() => { });

    new Build();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpp.packages.json`);

    expect(spyChildProcessExec).toHaveBeenCalledTimes(1);
    expect(spyChildProcessExec).toHaveBeenCalledWith('g++ -c src/**/*.cpp && mkdir dist && mv *.o dist/', directory);

    spyChildProcessExec.mockReset();
  });
});

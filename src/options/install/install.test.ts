import * as fs from 'fs';
import DependenciesModel from '../dependencies.model';
import Install from './install';
import ConfigFileModel from '../config-file.model';
import * as nodegit from 'nodegit';
const child_process = require('child_process');

describe('Install', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should not find config file', () => {
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue([]);

    new Install();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyConsoleError).toHaveBeenCalledTimes(1);
    expect(spyConsoleError).toHaveBeenCalledWith('There is no configuration file.');

  });

  it('should read dependencies and install', () => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue(['cpp.packages.json']);
    const configFile = new ConfigFileModel({ name: 'test', description: 'desc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configFile.dependencies = new Array<DependenciesModel>(dependencie);
    const file = Buffer.from(JSON.stringify(configFile));
    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => {}).mockReturnValueOnce(file);
    const spyNodeGitClone = jest.spyOn(nodegit.Clone, 'clone').mockImplementation(() => {}).mockResolvedValue('');
    const spyChildProcessExec = jest.spyOn(child_process, 'exec').mockImplementation(() => {});

    new Install();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpp.packages.json`);

    const path = `${process.cwd()}/cpp_modules/${dependencie.name}`;

    expect(spyNodeGitClone).toHaveBeenCalledTimes(1);
    expect(spyNodeGitClone).toHaveBeenCalledWith(dependencie.url, path);

    expect(spyChildProcessExec).toHaveBeenCalledTimes(1);
    expect(spyChildProcessExec).toHaveBeenNthCalledWith(1, 'cpm install && cpm build', {cwd: path});

  });
});

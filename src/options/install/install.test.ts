import * as fs from 'fs';
import DependenciesModel from '../dependencies.model';
import Install from './install';
import ConfigProjectModel from '../config-project.model';
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
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue([]);

    try {
      new Install();
    } catch (error) {
      expect(error.message).toBe('There is no configuration file.');
    }

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

  });

  it('should read dependencies and install', async() => {
    const spyReaddirSync = jest.spyOn(fs, 'readdirSync').mockReturnValue(['cpm.packages.json']);
    const configFile = new ConfigProjectModel({ name: 'test', description: 'desc', version: '1.0.0' });
    const dependencie = new DependenciesModel('example', 'http://github.com/example');
    configFile.dependencies = new Array<DependenciesModel>(dependencie);
    const file = Buffer.from(JSON.stringify(configFile));
    const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockImplementation(() => {}).mockReturnValueOnce(file);
    const spyNodeGitClone = jest.spyOn(nodegit.Clone, 'clone').mockImplementation(() => {}).mockResolvedValue('');
    const spyChildProcessExec = jest.spyOn(child_process, 'exec').mockImplementation(() => {});

    await new Install();

    expect(spyReaddirSync).toHaveBeenCalledTimes(1);
    expect(spyReaddirSync).toHaveBeenCalledWith('.');

    expect(spyReadFileSync).toHaveBeenCalledTimes(1);
    expect(spyReadFileSync).toHaveBeenCalledWith(`${process.cwd()}/cpm.packages.json`);

    const path = `${process.cwd()}/cpm_modules/${dependencie.name}`;

    expect(spyNodeGitClone).toHaveBeenCalledTimes(1);
    expect(spyNodeGitClone).toHaveBeenCalledWith(dependencie.url, path);

    expect(spyChildProcessExec).toHaveBeenCalledTimes(1);
    expect(spyChildProcessExec).toHaveBeenCalledWith('cpm install && cpm build', {cwd: path});

  });
});
